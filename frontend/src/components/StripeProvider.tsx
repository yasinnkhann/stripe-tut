import { ReactNode } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string
);

interface Props {
	children: ReactNode;
}

const StripeProvider = ({ children }: Props) => {
	return <Elements stripe={stripePromise}>{children}</Elements>;
};

export default StripeProvider;