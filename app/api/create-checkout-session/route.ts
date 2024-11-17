import { stripe } from "@/lib/stripe";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { user_id, email, plan_name, price } = body;

        let session = await stripe.checkout.sessions.create({
                customer_email: email,
                line_items: [ 
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: plan_name
                            },
                            recurring: {
                                interval: 'month'
                            },
                            unit_amount: price * 100,
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    user_id: user_id
                },
                mode: 'subscription',
                success_url: `http://textbehindimage.rexanwong.xyz/app`,
        });

        return Response.json({ paymentLink: session.url });
    } catch (error) {
        return Response.json({ error: error });
    }
}