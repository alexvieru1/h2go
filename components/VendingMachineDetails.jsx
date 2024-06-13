import { View, Text, StyleSheet, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import CustomButton from "./CustomButton";
import NumberSelector from "./NumberSelector";
import ProviderSelector from "./ProviderSelector";
import Payment from "./Payment"; // Import the Payment component
import { useGlobalContext } from "../context/GlobalProvider";
import { createOrderAndAddToUserList, fetchProvider } from "../lib/appwrite";
import { ID } from "react-native-appwrite";
import { useRouter } from "expo-router";
import { fetchProviders } from "../lib/appwrite"; // Adjust the import path accordingly

const VendingMachineDetails = ({ machine, distance, duration }) => {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [providers, setProviders] = useState([]);
  const [providerStock, setProviderStock] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [newOrder, setNewOrder] = useState(null); // Add state for newOrder
  const { user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    const getProviders = async () => {
      if (machine.availableSponsors && machine.availableSponsors.length > 0) {
        try {
          const fetchedProviders = await fetchProviders(
            machine.availableSponsors
          );
          setProviders(fetchedProviders);
        } catch (error) {
          console.error("Failed to fetch providers:", error);
        }
      }
    };

    getProviders();
  }, [machine.availableSponsors]);

  useEffect(() => {
    const getProvider = async () => {
      if (selectedProvider) {
        try {
          const fetchedProvider = await fetchProvider(selectedProvider);
          setProviderStock(fetchedProvider.providedStock);
        } catch (error) {
          console.error("Failed to fetch providers:", error);
        }
      }
    };
    getProvider();
  }, [selectedProvider]);

  const handleCreateOrder = async () => {
    const order = {
      orderId: ID.unique(),
      vendingMachineId: machine.vendingMachineId,
      userId: user.$id,
      datetime: new Date().toISOString(),
      vendingMachineAddress: machine.address,
      quantity: selectedNumber,
      providerId: selectedProvider,
    };

    setNewOrder(order);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    try {
      await createOrderAndAddToUserList(
        newOrder,
        user.$id,
        machine.vendingMachineId,
        selectedNumber
      );
      console.log("Order created and added to user list:", newOrder);
      console.log("Selected Provider:", selectedProvider);
      router.replace(`/success/${selectedProvider}`);

    } catch (error) {
      console.error("Error creating order:", error);
      Alert.alert("Error", "Unable to create order after successful payment.");
    }
  };

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.title}>
        Vending Machine - #{machine?.vendingMachineId}
      </Text>
      <Text style={styles.stock}>
        Sticle disponibile:{" "}
        {providerStock && providerStock < machine?.stock
          ? providerStock
          : machine?.stock}
      </Text>
      <Text className="font-psemibold text-sm">Distanta: {distance} km</Text>
      <Text className="font-psemibold text-sm">Timp: ~{duration} min.</Text>
      <View style={styles.separator}></View>
      <Text style={styles.address}>
        <Text style={styles.addressLabel}>Adresa:</Text> {machine?.address}
      </Text>
      {machine?.stock > 0 && providers.length > 0 && (
        <ProviderSelector
          title="Selecteaza Sponsorul"
          value={selectedProvider}
          handleChangeValue={setSelectedProvider}
          providers={providers}
          otherStyles="mb-2"
        />
      )}
      {machine?.stock > 0 && (
        <NumberSelector
          title="Cate sticle vrei sa achizitionezi ?"
          value={selectedNumber}
          handleChangeValue={setSelectedNumber}
          stock={
            providerStock && providerStock < machine?.stock
              ? providerStock
              : machine?.stock
          }
          otherStyles="mb-2"
        />
      )}
      {showPayment ? (
        <Payment newOrder={newOrder} onPaymentSuccess={handlePaymentSuccess} />
      ) : (
        <CustomButton
          title={machine?.stock > 0 ? "Cumpara" : "Stoc indisponibil"}
          containerStyles="mt-2 bg-green-400 border-4 border-green-800"
          textStyles="text-green-800"
          isLoading={machine?.stock <= 0}
          handlePress={handleCreateOrder} // Create order and show payment component
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    backgroundColor: "#FDE68A", // yellow-500
    position: "absolute",
    bottom: 0,
    padding: 16,
    right: 8,
    left: 8,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: "#1E3A8A", // blue-900
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  title: {
    fontFamily: "Poppins-Bold",
    fontSize: 20,
  },
  stock: {
    fontFamily: "Poppins-SemiBold",
    fontSize: 18,
  },
  separator: {
    height: 1,
    backgroundColor: "#1E3A8A", // blue-900
    marginVertical: 8,
  },
  address: {
    fontFamily: "Poppins-Regular",
  },
  addressLabel: {
    fontFamily: "Poppins-SemiBold",
  },
});

export default VendingMachineDetails;
