import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { StripeCardElement } from '@stripe/stripe-js';

const CheckoutForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setLoading(true);

		const cardElement = elements.getElement(CardElement);

		if (!cardElement) {
			setError('Card element not found');
			setLoading(false);
			return;
		}

		const { error, paymentMethod } = await stripe.createPaymentMethod({
			type: 'card',
			card: cardElement as StripeCardElement,
		});

		if (error?.message) {
			setError(error.message);
			setLoading(false);
		} else {
			setError(null);

			const response = await fetch(
				'http://localhost:3001/create-payment-intent',
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ amount: 1000 }), // Amount in cents
				}
			);

			const { clientSecret } = await response.json();

			const { error: confirmError, paymentIntent } =
				await stripe.confirmCardPayment(clientSecret, {
					payment_method: paymentMethod?.id,
				});

			if (confirmError?.message) {
				setError(confirmError.message);
			} else if (paymentIntent?.status === 'succeeded') {
				setSuccess(true);
			}
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardElement />
			<button type='submit' disabled={!stripe || loading}>
				{loading ? 'Processing...' : 'Pay'}
			</button>
			{error && <div>{error}</div>}
			{success && <div>Payment successful!</div>}
		</form>
	);
};

export default CheckoutForm;
