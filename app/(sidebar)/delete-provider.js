import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { Redirect } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import { fetchAllProviders, deleteProvider } from "../../lib/appwrite";

const DeleteProvider = () => {
  const { user } = useGlobalContext();
  if (user == null) return <Redirect href="/" />;

  const [providers, setProviders] = useState([]);
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

  const handleDeleteProvider = async (providerId) => {
    setIsSubmitting(true);
    try {
      await deleteProvider(providerId);
      console.log(`Provider ${providerId} deleted`);
      setProviders((prevProviders) =>
        prevProviders.filter((provider) => provider.$id !== providerId)
      );
      Alert.alert("Success", "Provider deleted successfully.");
    } catch (error) {
      console.error("Failed to delete provider:", error);
      Alert.alert("Error", "Failed to delete provider.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-slate-200 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
            <Text className="text-2xl font-pregular">Sterge sponsor</Text>
            <View className="mt-10">
              <HtoGo />
            </View>
            <Text className="text-lg font-pmedium text-center mt-10">
              Selectati un sponsor pentru a fi sters.
            </Text>
            {providers.length > 0 &&
              providers.map((provider) => (
                <View
                  key={provider.$id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
                >
                  <Text className="text-xl font-pbold">
                    Sponsor: {provider.providerName}
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-psemibold">Current Stock:</Text>{" "}
                    {provider.providedStock}
                  </Text>
                  <CustomButton
                    title="Sterge sponsor"
                    handlePress={() => handleDeleteProvider(provider.$id)}
                    containerStyles="mt-7 bg-red-400"
                    textStyles="text-slate-200"
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

export default DeleteProvider;
