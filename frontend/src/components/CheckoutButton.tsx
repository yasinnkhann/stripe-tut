import { useStripe } from '@stripe/react-stripe-js';

const CheckoutButton = () => {
	const stripe = useStripe();

	const handleClick = async () => {
		if (!stripe) return;

		const response = await fetch(
			'http://localhost:3001/create-checkout-session',
			{
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					items: [
						{ id: 1, quantity: 1 },
						{ id: 2, quantity: 3 },
					],
				}),
			}
		);

		const session = await response.json();

		const result = await stripe?.redirectToCheckout({ sessionId: session.id });

		if (result?.error) {
			console.error(result.error.message);
		}
	};

	return (
		<button role='link' onClick={handleClick}>
			Checkout
		</button>
	);
};

export default CheckoutButton;
