// Payment.js
import React, { useState, useEffect } from "react";
import { Button, View, Alert } from "react-native";
import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import CustomButton from "./CustomButton";

const Payment = ({ newOrder, onPaymentSuccess }) => {
  const [clientSecret, setClientSecret] = useState("");
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const amountInRon = 0.5 * newOrder.quantity; // Calculate amount based on quantity
  const amountInCents = Math.round(amountInRon * 100); // Convert to smallest currency unit

  useEffect(() => {
    const fetchPaymentIntentClientSecret = async () => {
      try {
        const response = await fetch(
          "http://192.168.0.180:3000/create-payment-intent",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount: amountInCents, currency: "ron" }), // Use RON as the currency
          }
        );

        const { clientSecret } = await response.json();
        setClientSecret(clientSecret);
      } catch (error) {
        console.error("Error fetching client secret:", error);
        Alert.alert("Error", "Unable to fetch payment details.");
      }
    };

    fetchPaymentIntentClientSecret();
  }, [amountInCents]);

  const initializePaymentSheet = async () => {
    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: clientSecret,
      merchantDisplayName: "H2GO",
    });

    if (error) {
      console.error("Error initializing payment sheet:", error);
      Alert.alert("Error", "Unable to initialize payment sheet.");
    }
  };

  const openPaymentSheet = async () => {
    await initializePaymentSheet();

    const { error } = await presentPaymentSheet();

    if (error) {
      console.error("Error presenting payment sheet:", error);
      Alert.alert("Error", `Plata respinsa: ${error.message}`);
    } else {
      Alert.alert("Success", "Plata acceptata!");
      onPaymentSuccess(); // Call the success handler
    }
  };

  return (
    <StripeProvider publishableKey="pk_test_51PR8Ez03Ju6QHPzXrdG749P5hih2epL1TquQ4YT35AocvuX9Cq8YaqvkDCBIdKkXri7DoNQSkhwQhn7PQ6PfblR600tA9lrNH8">
      <View>
        {/* <Button title="Proceed to Payment" onPress={openPaymentSheet} /> */}
        <CustomButton
          title="Catre plata"
          containerStyles="mt-2 bg-blue-400 border-4 border-blue-800"
          textStyles="text-blue-800"
          handlePress={openPaymentSheet}
        />
      </View>
    </StripeProvider>
  );
};

export default Payment;
