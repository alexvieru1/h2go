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
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const submit = async () => {
    // Ensure both email and password are provided
    if (!form.email || !form.password) {
      Alert.alert("Error", "Completati ambele campuri");
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the signIn function to authenticate the user
      const session = await signIn(form.email, form.password);

      if (session) {
        // Navigate to the home screen or another page on successful login
        const result = await getCurrentUser();
        setUser(result);
        setIsLoggedIn(true);
        router.replace("/explore");
      }
    } catch (error) {
      // Show an error message if sign-in fails
      Alert.alert("Sign In Failed", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-slate-200 dark:bg-slate-900 h-full">
      <KeyboardAwareScrollView
        enableAutomaticScroll={true}
        enableOnAndroid={true}
        extraHeight={200}
        keyboardOpeningTime={0}
        className="flex-1"
      >
        <ScrollView>
          <View className="w-full justify-center min-h-[85vh] px-4">
            <View className="flex flex-col items-center justify-center">
              <HtoGo />
              <Text className="text-lg font-psemibold">Logheaza-te</Text>
            </View>
            <FormField
              title="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              placeholder="Adresa de email"
              otherStyles="mt-6"
              keyboardType="email-address"
              autoCapitalize="none"
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
              title="Sign In"
              handlePress={submit}
              containerStyles="mt-7 bg-blue-400"
              textStyles="text-slate-200"
              isLoading={isSubmitting}
            />
            <View className="justify-center pt-5 flex-row gap-2">
              <Text className="font-pregular">Nu ai cont ?</Text>
              <Link href="/sign-up" className="text-blue-600 font-psemibold">
                Fa unul acum
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
