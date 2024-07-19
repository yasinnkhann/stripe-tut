import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = () => {
	const stripe = useStripe();
	const elements = useElements();
	const [error, setError] = useState<string | null>(null);
	const [paymentProcessing, setPaymentProcessing] = useState(false);
	const [paymentSuccess, setPaymentSuccess] = useState(false);

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!stripe || !elements) {
			return;
		}

		setPaymentProcessing(true);

		const response = await fetch(
			'http://localhost:3001/create-additional-payment-intent',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ amount: 1000 }), // Amount in cents
			}
		);

		const { clientSecret } = await response.json();

		const result = await stripe.confirmCardPayment(clientSecret, {
			payment_method: {
				card: elements.getElement(CardElement)!,
			},
		});

		setPaymentProcessing(false);

		if (result.error) {
			setError(result.error.message!);
		} else {
			if (result.paymentIntent?.status === 'succeeded') {
				setPaymentSuccess(true);
			}
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<CardElement />
			<button type='submit' disabled={!stripe || paymentProcessing}>
				Pay
			</button>
			{error && <div>{error}</div>}
			{paymentSuccess && <div>Payment Success!</div>}
		</form>
	);
};

export default PaymentForm;
