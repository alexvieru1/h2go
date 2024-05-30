import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/FormField";
import HtoGo from "../../components/HtoGo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomButton from "../../components/CustomButton";
import { Link, useRouter } from "expo-router";
import { createUser } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (
      !form.email ||
      !form.firstName ||
      !form.lastName ||
      !form.password ||
      !form.phoneNumber
    ) {
      Alert.alert("Error", "Completati toate campurile");
      return;
    }
    if (form.phoneNumber.length !== 10) {
      Alert.alert(
        "Error",
        "Numarul de telefon trebuie sa fie in formatul 07XXXXXXXX."
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await createUser(
        form.email,
        form.firstName,
        form.lastName,
        form.password,
        form.phoneNumber
      );
      setUser(result);
      setIsLoggedIn(true);

      router.replace("/explore");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-slate-200 dark:bg-slate-900 h-full">
      <KeyboardAwareScrollView
        enableAutomaticScroll={true}
        enableOnAndroid={true}
        extraHeight={130}
        keyboardOpeningTime={0}
        className="flex-1"
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4">
            <View className="flex flex-col items-center justify-center mt-5">
              <HtoGo />
              <Text className="text-lg font-psemibold">Creeaza un cont</Text>
            </View>
            <FormField
              title="Nume"
              value={form.lastName}
              handleChangeText={(e) => setForm({ ...form, lastName: e })}
              placeholder="Numele complet"
              otherStyles="mt-1"
              keyboardType="default"
            />
            <FormField
              title="Prenume"
              value={form.firstName}
              handleChangeText={(e) => setForm({ ...form, firstName: e })}
              placeholder="Prenumele complet"
              otherStyles="mt-7"
              keyboardType="default"
            />
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              placeholder="Adresa de email"
              otherStyles="mt-7"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FormField
              title="Telefon"
              value={form.phoneNumber}
              handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
              placeholder="07XXXXXXXX"
              otherStyles="mt-7"
              keyboardType="phone-pad"
            />
            <FormField
              title="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              placeholder="Parola contului H2GO"
              otherStyles="mt-7"
              keyboardType="default"
              autoCapitalize="none"
            />
            <CustomButton
              title="Sign Up"
              handlePress={submit}
              containerStyles="mt-7 bg-blue-400"
              textStyles="text-slate-200"
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="font-pregular">Ai deja un cont ?</Text>
              <Link href="/sign-in" className="text-blue-600 font-psemibold">
                Logheaza-te
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
