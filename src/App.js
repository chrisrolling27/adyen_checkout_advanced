import React, { useEffect } from 'react';
import { AdyenCheckout, Dropin } from '@adyen/adyen-web/auto';
import '@adyen/adyen-web/styles/adyen.css';

const App = () => {
    useEffect(() => {
        const initializeCheckout = async () => {
            try {
                const paymentMethodsResponse = await fetchPaymentMethods();
                const checkout = await AdyenCheckout({
                    clientKey: 'test_ZUALCWD7DRGHPG3LBRCRCBK73EZNRRVP',
                    locale: 'en-US',
                    environment: 'test', // Use 'live' for production
                    paymentMethodsResponse: paymentMethodsResponse,
                    onSubmit: (state, dropin) => {
                        handlePayment(state.data, dropin);
                    },
                    onAdditionalDetails: (state, dropin) => {
                        handleAdditionalDetails(state.data, dropin);
                    },
                });

                checkout.create('dropin').mount('#dropin-container');
            } catch (error) {
                console.error('Error initializing AdyenCheckout:', error);
            }
        };

        initializeCheckout();
    }, []);

    // Define the fetchPaymentMethods function
    const fetchPaymentMethods = async () => {
        try {
            const response = await fetch('/paymentMethods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching payment methods:', error);
            return {};
        }
    };

    // Define the handlePayment function
    const handlePayment = async (paymentData, dropin) => {
        try {
            const response = await fetch('/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            if (result.action) {
                dropin.handleAction(result.action);
            } else {
                // Handle payment result (e.g., success or failure)
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
    };

    // Define the handleAdditionalDetails function
    const handleAdditionalDetails = async (detailsData, dropin) => {
        try {
            const response = await fetch('/payments/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(detailsData),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();

            if (result.action) {
                dropin.handleAction(result.action);
            } else {
                // Handle final payment result
            }
        } catch (error) {
            console.error('Error handling additional details:', error);
        }
    };

    return (
        <div className="App">
            <h1>Adyen Drop-in Payment Demo</h1>
            {/* This container is where the Drop-in will be mounted */}
            <div id="dropin-container"></div>
        </div>
    );
};

export default App;