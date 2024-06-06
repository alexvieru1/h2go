import React, { useState } from "react";
import { View, Text, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { Redirect, useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import FormField from "../../components/FormField";
import { MultipleSelectList } from "react-native-dropdown-select-list";
import { createProvider } from "../../lib/appwrite";

const AddProvider = () => {
  const { user } = useGlobalContext();
  if (user == null) return <Redirect href="/" />;
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedProviders, setSelectedProviders] = useState([]);

  const data = [
    { key: "001", value: "VM#001" },
    { key: "002", value: "VM#002" },
    { key: "003", value: "VM#003" },
    { key: "004", value: "VM#004" },
    { key: "005", value: "VM#005" },
    { key: "006", value: "VM#006" },
    { key: "007", value: "VM#007" },
    { key: "008", value: "VM#008" },
    { key: "009", value: "VM#009" },
    { key: "010", value: "VM#010" },
  ];
  const [form, setForm] = useState({
    providerName: "",
    stock: "",
  });

  const submit = async () => {
    console.log(selectedProviders);
    if (!form.providerName || !form.stock || !selectedProviders) {
      Alert.alert("Error", "Completati toate campurile");
    } else {
      setIsSubmitting(true);
      try {
        const stock = parseInt(form.stock, 10);

        await createProvider(form.providerName, selectedProviders, stock);

        Alert.alert("Success", "Sponsor adaugat !");
        // Optionally navigate to another screen or reset the form here
        router.replace("/explore"); // Adjust the path if you want to navigate after submission
      } catch (error) {
        Alert.alert("Error", "Failed to add provider: " + error.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const renderContent = () => (
    <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
      <View className="flex flex-col">
        <Text className="text-2xl font-pregular">Adauga sponsor</Text>
        <View className="mt-10">
          <HtoGo />
        </View>
        <Text className="text-lg font-pmedium text-center mt-10">
          Te rugam sa completezi campurile de mai jos pentru a inregistra un
          sponsor nou.
        </Text>
        <FormField
          title="Denumire"
          value={form.providerName}
          handleChangeText={(e) => setForm({ ...form, providerName: e })}
          placeholder="Denumirea sponsorului"
          otherStyles="mt-7"
        />
        <FormField
          title="Sticle suplinite"
          value={form.stock}
          handleChangeText={(e) => setForm({ ...form, stock: e })}
          placeholder="Numarul de sticle sponsorizate"
          otherStyles="mt-7"
          keyboardType="numeric"
        />
        <View className="space-y-2 mt-7">
          <Text className="text-base font-pmedium text-gray-500">
            Selecteaza tonomatele
          </Text>
          <MultipleSelectList
            placeholder="Selecteaza tonomatele"
            label="Tonomate selectate"
            setSelected={(val) => setSelectedProviders(val)}
            data={data}
            save="key"
            fontFamily="Poppins-SemiBold"
            boxStyles={{
              backgroundColor: "#d1d5db",
              borderWidth: 2,
              borderColor: "#d1d5db",
              width: "100%",
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: "#d1d5db",
              display: "flex",
              alignItems: "center",
            }}
            inputStyles={{ color: "#6b7280" }}
          />
        </View>
        <CustomButton
          title="Inregistreaza"
          handlePress={submit}
          containerStyles="mt-7 bg-blue-400"
          textStyles="text-white"
          isLoading={isSubmitting}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="bg-slate-200  flex-1">
      <FlatList
        data={[{ key: "form" }]}
        renderItem={renderContent}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </SafeAreaView>
  );
};

export default AddProvider;
