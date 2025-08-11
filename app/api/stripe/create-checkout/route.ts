import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

const PRICING_PLAN = {
  name: "Professional",
  price: 19.99,
  photos: 40,
  priceId: "price_1RrFsbDswbEJWagVsEytA8rs",
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting checkout session creation...")

    const session = await getServerSession(authOptions)
    console.log("Session:", session)

    if (!session?.user?.email) {
      console.log("No session or email found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId, projectId } = await request.json()
    console.log("Plan ID:", planId)
    console.log("Project ID:", projectId)
    
    // If it's a temporary project ID, we'll create the real project after payment
    const isTemporaryProject = projectId && typeof projectId === "string" && projectId.startsWith("temp_")
    console.log("Is temporary project:", isTemporaryProject)

    // Use single plan
    const plan = PRICING_PLAN
    console.log("Using plan:", plan)

    // Import database functions
    const { getUserByEmail, createUser, createPurchase } = await import("@/lib/db")

    // Get or create user in database
    let user = await getUserByEmail(session.user.email)
    console.log("Existing user:", user)

    if (!user) {
      console.log("Creating new user...")
      user = await createUser({
        email: session.user.email,
        name: session.user.name || "",
        image: session.user.image || "",
      })
      console.log("Created user:", user)
    }

    if (!user || !user.id) {
      console.log("Failed to get or create user")
      return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
    }

    // Initialize Stripe
    const { stripe } = await import("@/lib/stripe")
    console.log("Creating Stripe checkout session...")

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: isTemporaryProject 
        ? `${process.env.NEXTAUTH_URL}/generate/temp?session_id={CHECKOUT_SESSION_ID}&temp_project_id=${projectId}`
        : `${process.env.NEXTAUTH_URL}/generate/${projectId}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/pricing`,
      metadata: {
        userId: user.id.toString(),
        planId: "professional",
        projectId: projectId,
      },
      customer_email: session.user.email,
      allow_promotion_codes: true,
    })

    console.log("Stripe session created:", checkoutSession.id)

    // Create purchase record
    const purchase = await createPurchase({
      userId: user.id,
      stripeSessionId: checkoutSession.id,
      planType: "professional",
amount: Math.round(plan.price * 100),
      headshotsIncluded: plan.photos,
    })

    console.log("Purchase created:", purchase)

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error) {
    console.error("Detailed error creating checkout session:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
