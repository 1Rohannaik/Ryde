const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createRidePaymentSession = async (req, res) => {
  try {
    const { amount, rideId, captainId } = req.body;

    if (!amount || !rideId || !captainId) {
      return res
        .status(400)
        .json({ error: "Missing required payment details" });
    }

    // ⚠️ Stripe minimum is ₹50 = 5000 paise
    if (amount < 5000) {
      return res.status(400).json({
        error: "Minimum payment amount should be ₹50 (5000 paise)",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Ride Payment",
              description: `Payment for ride ID: ${rideId}`,
            },
            unit_amount: amount, // already in paise
          },
          quantity: 1,
        },
      ],
      metadata: {
        rideId,
        captainId,
      },
      mode: "payment",
      success_url: "http://localhost:5173/home",
      cancel_url: "http://localhost:5173/riding",
    });

    res.status(200).json({ id: session.id, url: session.url }); // return URL if you want to redirect
  } catch (error) {
    console.error("Stripe Ride Payment error:", error);
    res.status(500).json({ error: error.message });
  }
};
