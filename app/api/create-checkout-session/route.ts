import { stripe } from "@/lib/stripe";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { user_id, email, plan_name, plan_type } = body;
        
        // Determine price and interval based on plan type
        const isAnnual = plan_type === 'ANNUAL';
        const unitAmount = isAnnual ? 7 * 100 : 9 * 100; // $7 for annual, $9 for monthly
        const interval = isAnnual ? 'year' : 'month';
        
        let session = await stripe.checkout.sessions.create({
                customer_email: email,
                line_items: [ 
                    {
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: isAnnual ? `${plan_name} (Annual)` : plan_name
                            },
                            recurring: {
                                interval: interval
                            },
                            unit_amount: isAnnual ? unitAmount * 12 : unitAmount, // $84 for annual billing
                        },
                        quantity: 1,
                    },
                ],
                metadata: {
                    user_id: user_id,
                    plan_type: plan_type
                },
                mode: 'subscription',
                success_url: `http://textbehindimage.rexanwong.xyz/app`,
        });

        return Response.json({ paymentLink: session.url });
    } catch (error) {
        return Response.json({ error: error });
    }
}