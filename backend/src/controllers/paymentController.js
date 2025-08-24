const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// controllers/paymentController.js
exports.createRidePaymentSession = async (req, res) => {
  try {
    const { amount, rideId, captainId } = req.body;

    if (!amount || !rideId || !captainId) {
      return res.status(400).json({ error: "Missing required payment details" });
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
      success_url: " http://localhost:5173/home",
      cancel_url: " http://localhost:5173/riding",
    });

    res.status(200).json({ id: session.id });
  } catch (error) {
    console.error("Stripe Ride Payment error:", error);
    res.status(500).json({ error: error.message });
  }
};

