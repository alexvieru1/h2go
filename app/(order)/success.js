import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, useRouter } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import qrCode from "../../assets/images/QR.png";
import CustomButton from "../../components/CustomButton";

const success = () => {
    const router = useRouter();
  return (
    <SafeAreaView className="bg-slate-200 0 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col justify-center items-center mt-10">
            <FontAwesome5 name="check-circle" size={60} color="green" />
            <Text className="my-5 text-2xl text-center font-pregular">
              Comanda realizata cu succes !
            </Text>
            <Image
              source={qrCode}
              className="w-[400px] h-[400px]"
              resizeMode="contain"
            />
          </View>
          <CustomButton
            title="Inapoi la harta"
            containerStyles="mt-7 bg-blue-400"
            textStyles="text-white"
            handlePress={()=>router.replace("/explore")}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default success;
