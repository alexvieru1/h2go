import { View, Text } from 'react-native'
import React from 'react'
import { TextLoader } from 'react-native-indicator'

const RippleLoader = () => {
  return (
    <View>
      <RippleLoader/>
      <TextLoader text="Loading..."/>
    </View>
  )
}

export default RippleLoader