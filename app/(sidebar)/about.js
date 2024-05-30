import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect} from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const About = () => {
  const { user} = useGlobalContext();
  if (user == null) return <Redirect href="/" />;

  return (
    <SafeAreaView className="bg-slate-200 dark:bg-slate-900 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
            <Text className="text-2xl font-pregular">Despre</Text>
            <View className="flex items-center">
              <HtoGo />
              <Text className="font-pregular text-center text-sm mt-4">
                H2GO este aplicația care îți permite să cumperi apă proaspătă și
                răcoritoare direct de la distribuitoare automate, folosind doar
                telefonul tău mobil. Cu un design intuitiv și ușor de folosit,
                H2GO îți oferă posibilitatea să localizezi cel mai apropiat
                distribuitor de apă, să navighezi către acesta, să alegi
                cantitatea dorită și să plătești rapid prin metode de plată
                securizate. Fie că ești în drum spre muncă, la sala de sport sau
                pur și simplu te plimbi prin oraș, H2GO îți asigură accesul la
                hidratare fără efort, contribuind în același timp la reducerea
                deșeurilor de plastic.
              </Text>
            </View>
            <View className="flex mt-16 px-2">
              <View className="flex-row items-center">
                <Ionicons name="logo-apple-ar" size={34} color="black" />
                <Text className="ml-4 text-lg font-pregular">v 1.0.0</Text>
              </View>
            </View>
            <View className="flex mt-16 px-2">
              <View className="flex-row items-center">
                <MaterialIcons name="star" size={34} color="black" />
                <Text className="ml-4 text-lg font-pregular">Da-ne un rating</Text>
              </View>
            </View>
            <View className="flex mt-16 px-2">
              <View className="flex-row items-center">
                <AntDesign name="like1" size={34} color="black" />
                <Text className="ml-4 text-lg font-pregular">
                  Da-ne un like pe Facebook
                </Text>
              </View>
            </View>
            <View className="flex mt-16 px-2">
              <View className="flex-row items-center">
                <Ionicons
                  name="document-text-outline"
                  size={34}
                  color="black"
                />
                <Text className="ml-4 text-lg font-pregular">
                  Termeni si conditii
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default About;
