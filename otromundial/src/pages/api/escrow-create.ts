export const prerender = false;
import type { APIRoute } from 'astro';

const ESCROW_TIERS = {
    'buy_trip_10d':  { amount: 2200, title: 'El Otro Mundial — Caravana 10 Días' },
    'buy_trip_15d':  { amount: 2800, title: 'El Otro Mundial — Caravana 15 Días' },
    'buy_trip_30d':  { amount: 3500, title: 'El Otro Mundial — Caravana Completa 30 Días' },
    'photobook':     { amount: 80,   title: 'El Otro Mundial — Fotobook Edición Limitada' },
    'sponsor':       { amount: 500,  title: 'El Otro Mundial — Patrocinador Comunitario' },
};

// Use standard Node.js process.env to read Vercel environment variables securely at runtime
export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const buyer_email = body.buyer_email;
        const buyer_name = body.buyer_name || 'Viajero';
        const tier_id = body.tier_id;
        const seller_code = body.seller_code;

        if (!buyer_email) {
            return new Response(JSON.stringify({ success: false, message: 'Se requiere un correo electrónico válido.' }), { status: 400 });
        }

        if (!ESCROW_TIERS[tier_id as keyof typeof ESCROW_TIERS]) {
            return new Response(JSON.stringify({ success: false, message: `Paquete no reconocido: ${tier_id}` }), { status: 400 });
        }

        const tier = ESCROW_TIERS[tier_id as keyof typeof ESCROW_TIERS];
        
        // These will be configured in Vercel Project Settings -> Environment Variables
        const escrowEmail = process.env.ESCROW_EMAIL || import.meta.env.ESCROW_EMAIL;
        const escrowApiKey = process.env.ESCROW_API_KEY || import.meta.env.ESCROW_API_KEY;

        if (!escrowEmail || !escrowApiKey) {
            console.error("Missing Escrow credentials in environment variables.");
             return new Response(JSON.stringify({ success: false, message: 'Faltan credenciales de Escrow en el servidor.' }), { status: 500 });
        }

        // Hitos logic for the tour packs
        let items = [];
        const isTour = tier_id.startsWith('buy_trip');

        if (isTour) {
            let h1, h2, h3;
            if (tier_id === 'buy_trip_10d') { h1 = 660; h2 = 660; h3 = 880; }
            else if (tier_id === 'buy_trip_15d') { h1 = 840; h2 = 840; h3 = 1120; }
            else { h1 = 1050; h2 = 1050; h3 = 1400; } // 30d

            items = [
                {
                    "title": "Hito 1 - Compra y preparación de camionetas",
                    "description": "Adquisición y acondicionamiento de las camionetas de la caravana. Mecánica, seguridad y equipamiento. Se entrega evidencia fotográfica y documental (30% del total).",
                    "type": "milestone", "inspection_period": 259200, "quantity": 1,
                    "schedule": [{"amount": h1, "payer_customer": buyer_email, "beneficiary_customer": escrowEmail}]
                },
                {
                    "title": "Hito 2 - Logística y ruta confirmada",
                    "description": "Confirmación de aliados locales, hospedajes comunitarios y foros en Tijuana, SLP y Oaxaca. Seguros del convoy y documentación oficial (30% del total).",
                    "type": "milestone", "inspection_period": 259200, "quantity": 1,
                    "schedule": [{"amount": h2, "payer_customer": buyer_email, "beneficiary_customer": escrowEmail}]
                },
                {
                    "title": "Hito 3 - Inspección del viajero y salida",
                    "description": "El viajero se reúne con el equipo en persona, inspecciona las camionetas y confirma que todo está listo. Solo tras su aprobación se libera el 40% final y arranca la caravana.",
                    "type": "milestone", "inspection_period": 259200, "quantity": 1,
                    "schedule": [{"amount": h3, "payer_customer": buyer_email, "beneficiary_customer": escrowEmail}]
                }
            ];
        } else {
             items = [
                {
                    "title": tier.title,
                    "description": "Apoyo a la caravana documental El Otro Mundial.",
                    "type": "general_merchandise",
                    "quantity": 1,
                    "schedule": [
                        {
                            "amount": tier.amount,
                            "payer_customer": buyer_email,
                            "beneficiary_customer": escrowEmail,
                        },
                    ],
                    "fees": [
                        {
                            "type": "escrow",
                            "payer": "buyer",
                        },
                    ],
                    "inspection_period": 259200,
                    "shipping_type": "no_shipping",
                },
            ];
        }

        const transaction_body = {
            currency: 'usd',
            description: `${tier.title} — ${buyer_name}`,
            parties: [
                { role: 'seller', customer: escrowEmail, agreed: true },
                { role: 'buyer', customer: buyer_email, agreed: false }
            ],
            items: items
        };

        const auth_token = Buffer.from(`${escrowEmail}:${escrowApiKey}`).toString('base64');

        const response = await fetch('https://api.escrow.com/2017-09-01/transaction', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${auth_token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(transaction_body)
        });

        const data = await response.json();

        if (response.status !== 201) {
            console.error("Escrow API Error:", data);
            return new Response(JSON.stringify({ 
                success: false, 
                message: data.message || 'Error al comunicarse con Escrow.',
                escrow_error: data
            }), { status: response.status });
        }

        // We need to extract the next_step URL for the buyer
        const buyerParty = data.parties.find((p: any) => p.role === 'buyer');
        const landingPage = buyerParty ? buyerParty.next_step : data.landing_page;

        // Registrar la venta en WordPress si se proporcionó un código de colaborador
        if (seller_code) {
            const wpUrl = process.env.WORDPRESS_API_URL || 'https://wp.elotromundial.mx';
            try {
                const wpResponse = await fetch(`${wpUrl}/wp-json/eom/v1/venta-ticket`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        codigo: seller_code,
                        nombre_comprador: buyer_name,
                        email_comprador: buyer_email,
                        monto: tier.amount,
                        folio_confirmacion: String(data.id)
                    })
                });
                
                if (!wpResponse.ok) {
                    const wpErr = await wpResponse.text();
                    console.error(`[WP API Error] No se pudo registrar la venta. Código: ${wpResponse.status}. Detalle:`, wpErr);
                } else {
                    console.log(`[WP API Success] Venta registrada correctamente para colaborador: ${seller_code}`);
                }
            } catch (wpErr) {
                console.error("[WP Network Error] Fallo al conectar con la API de WordPress:", wpErr);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            redirect_url: landingPage,
            tx_id: data.id
        }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error("Endpoint Error:", error);
        return new Response(JSON.stringify({ success: false, message: 'Error interno del servidor.' }), { status: 500 });
    }
};
