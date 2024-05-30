import React, { useState, useRef } from "react";
import { ScrollView, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { Link, Redirect, useRouter } from "expo-router";
import { signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Fontisto } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import HtoGo from "../../components/HtoGo";
import FormField from "../../components/FormField";

const Purchases = () => {
  const { user } = useGlobalContext();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (user == null) return <Redirect href="/" />;

  const [form, setForm] = useState({
    subject:"",
    email:"",
    message: "",
  });

  const submit = () => {

  }

  return (
    <SafeAreaView className="bg-slate-200 dark:bg-slate-900 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
            <Text className="text-2xl font-pregular">Suport</Text>
            <View className="mt-10">
              <HtoGo />
            </View>
            <Text className="text-lg font-pmedium text-center mt-10">
              Ati avut vreo problema legata de o comanda recenta sau un
              distribuitor automat de apa ?
            </Text>
            <Text className="text-sm font-pregular text-center mt-4">
              Scrie-ne mai jos si vom reveni catre tine in cel mai scurt timp
              posibil
            </Text>
            <FormField
              title="Subiect"
              value={form.subject}
              handleChangeText={(e) => setForm({ ...form, subject: e })}
              placeholder="Subiectul mesajului dumneavoastra"
              otherStyles="mt-7"
            />
            <FormField
              title="Email-ul pe care va v-om contacta"
              value={user.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              otherStyles="mt-7"
              disabled
            />
            <FormField
              title="Mesaj"
              value={form.message}
              handleChangeText={(e) => setForm({ ...form, message: e })}
              placeholder="Ce s-a intamplat ?"
              otherStyles="mt-7"
            />
            <CustomButton
              title="Trimite"
              handlePress={submit}
              containerStyles="mt-7 bg-blue-400"
              textStyles="text-slate-200"
              isLoading={isSubmitting}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Purchases;
