import StripeProvider from './components/StripeProvider';
import CheckoutForm from './components/CheckoutForm';

const App = () => {
	return (
		<StripeProvider>
			<CheckoutForm />
		</StripeProvider>
	);
};

export default App;
