import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '', 
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function POST(req: Request) {
  try {
    const { subscription_id } = await req.json();
    // Cancel the subscription on Stripe
    await stripe.subscriptions.cancel(subscription_id);

    // Update the Supabase row
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        paid: false,
        subscription_id: null
      })
      .eq('subscription_id', subscription_id);

    if (error) {
      throw new Error(`Supabase update error: ${error.message}`);
    }

    return NextResponse.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}