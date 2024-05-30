import {
  ScrollView,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { Redirect, useRouter } from "expo-router";
import { signOut } from "../../lib/appwrite";
import { useGlobalContext } from "../../context/GlobalProvider";
import { Fontisto } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const router = useRouter();
  if (user==null) return <Redirect href="/" />;
  const logOut = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/");
  };
  const succesNavigate = async () => {
    router.replace("/success")
  }

  return (
    <SafeAreaView className="bg-slate-200 dark:bg-slate-900 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
              <Text className="text-2xl font-pregular">Profil</Text>
              <View className="flex items-center">
                <View className="w-20 h-20 rounded-full flex justify-center items-center">
                  <Image
                    source={{ uri: user?.avatar }}
                    className="w-[90%] h-[90%] rounded-full"
                    resizeMode="cover"
                  />
                </View>
                <Text className="text-2xl mt-4 font-plight">{user.firstName}</Text>
                <Text className="text-sm font-plight">+4{user.phoneNumber}</Text>
              </View>
              <View className="flex mt-16 px-2">
                <View className="flex-row items-center">
                  <Fontisto name="email" size={34} color="black" />
                  <Text className="ml-4 text-lg font-pregular">{user.email}</Text>
                </View>
              </View>
              <View className="flex px-2 mt-16">
                <View className="flex-row items-center">
                  <SimpleLineIcons name="globe" size={34} color="black" />
                  <View className="flex-col">
                    <Text className="ml-4 text-sm font-pregular">Limba:</Text>
                    <Text className="ml-4 text-sm font-pregular">Romana - RO</Text>
                  </View>
                </View>
              </View>
          </View>
          <View className="flex flex-col">
              <CustomButton title="Delogheaza-te" handlePress={logOut} containerStyles="border-2 border-[#DC143C]" textStyles="text-[#DC143C]"/>
              <CustomButton title="Sterge cont" handlePress={succesNavigate} containerStyles="bg-[#DC143C] mt-6" textStyles="text-slate-200"/>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
