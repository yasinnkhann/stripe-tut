import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2024-06-20',
});

app.use(cors());
app.use(express.json());

const storeItems = new Map([
	[1, { priceInCents: 10000, name: 'Learn React Today' }],
	[2, { priceInCents: 20000, name: 'Learn CSS Today' }],
]);

app.post('/create-checkout-session', async (req: Request, res: Response) => {
	try {
		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			mode: 'payment',
			line_items: req.body.items.map((item: any) => {
				const storeItem = storeItems.get(item.id);
				return {
					price_data: {
						currency: 'usd',
						product_data: {
							name: storeItem?.name,
						},
						unit_amount: storeItem?.priceInCents,
					},
					quantity: item.quantity,
				};
			}),
			success_url: 'http://localhost:5173/success',
			cancel_url: 'http://localhost:5173/cancel',
		});

		res.status(200).json({ id: session.id });
	} catch (error) {
		res.status(500).json({ error: (error as Error).message });
	}
});

app.post(
	'/create-additional-payment-intent',
	async (req: Request, res: Response) => {
		const { amount } = req.body;

		try {
			const paymentIntent = await stripe.paymentIntents.create({
				amount,
				currency: 'usd',
			});
			res.status(200).json({ clientSecret: paymentIntent.client_secret });
		} catch (error) {
			res.status(500).json({ error: (error as Error).message });
		}
	}
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
