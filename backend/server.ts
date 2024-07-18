import express, { Request, Response } from 'express';
import Stripe from 'stripe';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
	apiVersion: '2024-06-20',
});

app.use(cors());
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req: Request, res: Response) => {
	const { amount } = req.body;

	try {
		const paymentIntent = await stripe.paymentIntents.create({
			amount,
			currency: 'usd',
		});
		console.log('paymentIntent', paymentIntent);
		res.status(200).send({
			clientSecret: paymentIntent.client_secret,
		});
	} catch (error) {
		res.status(500).send({
			error: (error as Error).message,
		});
	}
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
