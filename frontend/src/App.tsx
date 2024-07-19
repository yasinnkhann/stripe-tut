import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import StripeProvider from './components/StripeProvider';
import CheckoutButton from './components/CheckoutButton';
import PaymentForm from './components/PaymentForm';
import SuccessPage from './pages/SuccessPage';
import CancelPage from './pages/CancelPage';

const router = createBrowserRouter([
	{
		path: '/',
		children: [
			{
				index: true,
				element: (
					<StripeProvider>
						<h1>My Store</h1>
						<h2>Checkout with Stripe Checkout</h2>
						<CheckoutButton />
						<h2>Custom Payment Form</h2>
						<PaymentForm />
					</StripeProvider>
				),
			},
			{
				path: 'success',
				element: <SuccessPage />,
			},
			{
				path: 'cancel',
				element: <CancelPage />,
			},
		],
	},
]);

const App = () => {
	return <RouterProvider router={router} />;
};

export default App;
