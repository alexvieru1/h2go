import { View, Text } from "react-native";
import React, { useState } from "react";
import CustomButton from "./CustomButton";
import NumberSelector from "./NumberSelector";
import { useGlobalContext } from "../context/GlobalProvider";
import { createOrderAndAddToUserList } from "../lib/appwrite";
import { ID } from "react-native-appwrite";
import { useRouter } from "expo-router";

const VendingMachineDetails = ({ machine }) => {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const { user } = useGlobalContext();
  const router = useRouter();

  const handleCreateOrder = async () => {
    const newOrder = {
      orderId: ID.unique(),
      vendingMachineId: machine.vendingMachineId,
      userId: user.$id,
      datetime: new Date().toISOString(),
      vendingMachineAddress: machine.address,
      quantity: selectedNumber,
    };

    try {
      const createdOrder = await createOrderAndAddToUserList(newOrder, user.$id, machine.vendingMachineId, selectedNumber);
      console.log('Order created and added to user list:', createdOrder);
      router.replace("/success")
      // Optionally, navigate to an order confirmation screen or display a success message
      // router.push('/order-confirmation'); // Example navigation
    } catch (error) {
      console.error('Error creating order:', error);
      // Optionally, display an error message to the user
    }
  };

  return (
    <View className="bg-yellow-500 absolute bottom-0 p-4 right-2 left-2 border-t-4 border-l-4 border-r-4 border-blue-900 rounded-tr-2xl rounded-tl-2xl">
      <Text className="font-pbold text-xl">
        Vending Machine - #{machine?.vendingMachineId}
      </Text>
      <Text className="font-psemibold text-lg">
        Sticle disponibile: {machine?.stock}
      </Text>
      <View className="h-1 bg-blue-900 my-2"></View>
      <Text className="font-pregular">
        <Text className="font-psemibold">Adresa:</Text> {machine?.address}
      </Text>
      {machine?.stock > 0 && (
        <NumberSelector
          title="Cate sticle vrei sa achizitionezi ?"
          value={selectedNumber}
          handleChangeValue={setSelectedNumber}
          stock={machine?.stock}
          otherStyles="mb-2"
        />
      )}
      <CustomButton
        title={machine?.stock > 0 ? "Cumpara" : "Stoc indisponibil"}
        containerStyles="mt-2 bg-green-400 border-4 border-green-800"
        textStyles="text-green-800"
        isLoading={machine?.stock <= 0}
        handlePress={handleCreateOrder} // Add the onPress handler
      />
    </View>
  );
};

export default VendingMachineDetails;
