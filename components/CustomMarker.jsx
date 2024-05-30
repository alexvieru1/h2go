import React from 'react';
import { Marker } from 'react-native-maps';
import { Image, View } from 'react-native';

const CustomMarker = ({ coordinate, onPress, isPressed }) => {
  return (
    <Marker coordinate={coordinate} onPress={onPress}>
      <View className={` ${isPressed ? ("w-14 h-14 bg-yellow-500 justify-center items-center rounded-full border-blue-500 border-2") : ('')}`}>
        <View className='w-10 h-10 justify-center items-center'>
          <Image
            source={require('../assets/icons/vending-machine.png')}
            className='w-10 h-10'
            resizeMode="contain"
          />
        </View>
      </View>
    </Marker>
  );
};

export default CustomMarker;
