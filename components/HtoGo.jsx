import { View, Text, Image } from "react-native";
import React from "react";
import logo from "../assets/images/h2go-logo@200px.png";

export default function HtoGo() {
  return (
    <View className={`flex justify-center items-center`}>
      <Image
        source={logo}
        className={`w-[100px] h-[100px]`}
        resizeMode="cover"
      />
    </View>
  );
}
