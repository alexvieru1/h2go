import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { Redirect } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import { fetchAllProviders, updateProviderStock } from "../../lib/appwrite";
import FormField from "../../components/FormField";

const UpdateProvider = () => {
  const { user } = useGlobalContext();
  if (user == null) return <Redirect href="/" />;

  const [providers, setProviders] = useState([]);
  const [providedStocks, setProvidedStocks] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const getProviders = async () => {
      try {
        const providersFetched = await fetchAllProviders();
        setProviders(providersFetched.documents);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      }
    };
    getProviders();
  }, []);

  const handleStockUpdate = async (providerId) => {
    const newStock = providedStocks[providerId];
    if (newStock === undefined || newStock === "") {
      console.error("No new stock value provided");
      return;
    }

    setIsSubmitting(true);

    try {
      await updateProviderStock(providerId, parseInt(newStock, 10));
      console.log(`Provider ${providerId} stock updated to ${newStock}`);
      setProviders((prevProviders) =>
        prevProviders.map((provider) =>
          provider.$id === providerId
            ? { ...provider, providedStock: newStock }
            : provider
        )
      );
      setProvidedStocks((prevStocks) => ({ ...prevStocks, [providerId]: "" }));
    } catch (error) {
      console.error("Failed to update provider stock:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangeStock = (providerId, value) => {
    setProvidedStocks((prevStocks) => ({ ...prevStocks, [providerId]: value }));
  };

  return (
    <SafeAreaView className="bg-slate-200 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
            <Text className="text-2xl font-pregular">Update stoc sponsor</Text>
            <View className="mt-10">
              <HtoGo />
            </View>
            <Text className="text-lg font-pmedium text-center mt-10">
              Te rugam sa selectezi sponsorul al carui stoc necesita update.
            </Text>
            {providers.length > 0 &&
              providers.map((provider) => (
                <View
                  key={provider.$id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg bg-white "
                >
                  <Text className="text-xl font-pbold">
                    Sponsor: {provider.providerName}
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-psemibold">Stoc actual:</Text>{" "}
                    {provider.providedStock}
                  </Text>
                  <FormField
                    title="Stoc nou"
                    value={providedStocks[provider.$id] || ""}
                    handleChangeText={(e) => handleChangeStock(provider.$id, e)}
                    placeholder="Introduceti numarul de sticle"
                    otherStyles="mt-7"
                    keyboardType="phone-pad"
                  />
                  <CustomButton
                    title="Update stoc"
                    handlePress={() => handleStockUpdate(provider.$id)}
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

export default UpdateProvider;
