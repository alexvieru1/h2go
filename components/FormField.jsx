import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import icons from "../constants/icons";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  keyboardType,
  autoCapitalize,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base font-pmedium text-gray-500">{title}</Text>
      <View className="border-2 border-slate-300 w-full h-16 px-4 rounded-xl bg-slate-300 dark:bg-slate-800 focus:border-blue-700 items-center flex-row">
        <TextInput
          className="flex-1 text-slate-800 dark:text-slate-300 font-psemibold text-base"
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor="#1e5884"
          secureTextEntry={title === "Password" && !showPassword}
          autoCapitalize={autoCapitalize}
          keyboardType={keyboardType}
        />

        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
