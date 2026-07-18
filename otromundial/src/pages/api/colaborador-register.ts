export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { nombre, email, telefono, ciudad, tipo } = body;

        // Basic validation on proxy side
        if (!nombre || !email) {
            return new Response(JSON.stringify({
                success: false,
                message: 'Nombre y correo electrónico son obligatorios.'
            }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const wpUrl = process.env.WORDPRESS_API_URL || import.meta.env.WORDPRESS_API_URL || 'https://wp.elotromundial.mx';

        const wpResponse = await fetch(`${wpUrl}/wp-json/eom/v1/registrar-colaborador`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                email,
                telefono: telefono || '',
                ciudad: ciudad || '',
                tipo: tipo || 'Amigo del Proyecto',
            })
        });

        const data = await wpResponse.json();

        // Handle duplicate email (409 from WP)
        if (wpResponse.status === 409) {
            return new Response(JSON.stringify({
                success: false,
                duplicate: true,
                codigo: data.data?.codigo || null,
                message: data.message || 'Este correo ya está registrado como colaborador.',
            }), { status: 409, headers: { 'Content-Type': 'application/json' } });
        }

        if (!wpResponse.ok) {
            console.error('[WP API Error] Registro colaborador:', data);
            return new Response(JSON.stringify({
                success: false,
                message: data.message || 'Error al registrar colaborador.',
            }), { status: wpResponse.status, headers: { 'Content-Type': 'application/json' } });
        }

        // Success — return the generated code
        return new Response(JSON.stringify({
            success: true,
            codigo: data.codigo,
            nombre: data.nombre,
            message: data.message,
        }), { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('[Colaborador Register] Error:', error);
        return new Response(JSON.stringify({
            success: false,
            message: 'Error interno del servidor.'
        }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};
