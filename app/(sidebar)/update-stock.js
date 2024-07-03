import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { Redirect } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import {
  getVendingMachines,
  updateVendingMachineStock,
} from "../../lib/appwrite";
import FormField from "../../components/FormField";

const UpdateVendingMachineStock = () => {
  const { user } = useGlobalContext();
  if (user == null) return <Redirect href="/" />;

  const [vendingMachines, setVendingMachines] = useState([]);
  const [stockUpdates, setStockUpdates] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchVendingMachines = async () => {
      try {
        const machines = await getVendingMachines();
        if (Array.isArray(machines)) {
          setVendingMachines(machines);
        } else {
          console.error(
            "Expected an array of vending machines but got:",
            machines
          );
          setVendingMachines([]);
        }
      } catch (error) {
        console.error("Failed to fetch vending machines:", error);
      }
    };
    fetchVendingMachines();
  }, []);

  const handleStockUpdate = async (vendingMachineId) => {
    const newStock = stockUpdates[vendingMachineId];
    if (newStock === undefined || newStock === "") {
      console.error("No new stock value provided");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateVendingMachineStock(vendingMachineId, parseInt(newStock, 10));
      console.log(
        `Vending machine ${vendingMachineId} stock updated to ${newStock}`
      );
      setVendingMachines((prevVendingMachines) =>
        prevVendingMachines.map((machine) =>
          machine.vendingMachineId === vendingMachineId
            ? { ...machine, stock: newStock }
            : machine
        )
      );
      setStockUpdates((prevStocks) => ({
        ...prevStocks,
        [vendingMachineId]: "",
      }));
      Alert.alert("Success", "Vending machine stock updated successfully.");
    } catch (error) {
      console.error("Failed to update vending machine stock:", error);
      Alert.alert("Error", "Failed to update vending machine stock.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeStock = (vendingMachineId, value) => {
    setStockUpdates((prevStocks) => ({
      ...prevStocks,
      [vendingMachineId]: value,
    }));
  };

  return (
    <SafeAreaView className="bg-slate-200 ">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
            <Text className="text-2xl font-pregular">
              Update stoc tonomat
            </Text>
            <View className="mt-10">
              <HtoGo />
            </View>
            <Text className="text-lg font-pmedium text-center mt-10">
              Selectati un tonomat pentru a actualiza stocul
            </Text>
            {vendingMachines.length > 0 &&
              vendingMachines.map((machine) => (
                <View
                  key={machine.$id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg bg-white "
                >
                  <Text className="text-xl font-pbold">
                    Vending Machine: {machine.vendingMachineId}
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-psemibold">Stoc actual:</Text>{" "}
                    {machine.stock}
                  </Text>
                  <FormField
                    title="Stoc nou"
                    value={stockUpdates[machine.vendingMachineId] || ""}
                    handleChangeText={(e) =>
                      handleChangeStock(machine.vendingMachineId, e)
                    }
                    placeholder="Scrieti valoarea totala a stocului nou"
                    otherStyles="mt-7"
                    keyboardType="phone-pad"
                  />
                  <CustomButton
                    title="Update Stoc"
                    handlePress={() =>
                      handleStockUpdate(machine.vendingMachineId)
                    }
                    containerStyles="mt-7 bg-blue-400"
                    textStyles="text-white"
                    isLoading={isSubmitting}
                  />
                </View>
              ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdateVendingMachineStock;
