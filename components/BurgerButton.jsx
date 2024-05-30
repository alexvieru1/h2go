import { View, TouchableOpacity } from "react-native";
import { Entypo } from "@expo/vector-icons";

export default function BurgerButton({ handlePress }) {
  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View className="flex flex-row px-2 w-12 items-center justify-start">
        <Entypo name="menu" size={35} color="black" />
      </View>
    </TouchableOpacity>
  );
}
