import { View, Text, StyleSheet } from "react-native";
import React from "react";
import { Picker } from '@react-native-picker/picker';

const NumberSelector = ({ title, value, handleChangeValue, otherStyles, stock }) => {
  const numbers = Array.from({ length: stock }, (_, i) => i + 1);
//   console.log("number:", numbers);

  return (
    <View className={`mt-4 ${otherStyles}`}>
      <Text className="text-lg font-pmedium text-black">{title}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue, itemIndex) => handleChangeValue(itemValue)}
          style={styles.picker}
        >
          {numbers.map(number => (
            <Picker.Item key={number} label={`${number}`} value={number} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#94a3b8', // Slate-300 color
    width: '100%',
    height: 64, // h-16
    paddingHorizontal: 16, // px-4
    borderRadius: 20, // rounded-xl
    backgroundColor: '#93c5fd', // Blue-300 color
    justifyContent: 'center',
  },
  picker: {
    height: 64, // Ensure picker takes full height
  },
});

export default NumberSelector;
