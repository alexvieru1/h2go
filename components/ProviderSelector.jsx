import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Picker } from '@react-native-picker/picker';

const ProviderSelector = ({ title, value, handleChangeValue, otherStyles, providers }) => {
  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value}
          onValueChange={(itemValue, itemIndex) => handleChangeValue(itemValue)}
          style={styles.picker}
        >
          {providers.map(provider => (
            <Picker.Item key={provider.$id} label={provider.providerName} value={provider.$id} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#000',
  },
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

export default ProviderSelector;
