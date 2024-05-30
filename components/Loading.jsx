import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const Loading = () => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      rotateAnim.setValue(0);
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => animate());
    };

    animate();
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.circle}>
        <Animated.View style={[styles.wave, { transform: [{ rotate: spin }] }]}>
          <View style={styles.waveBefore}></View>
          <View style={styles.waveAfter}></View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  circle: {
    width: 150,
    height: 150,
    backgroundColor: '#ccc',
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#fff',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4973ff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  wave: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4973ff',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  waveBefore: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: 0,
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -112.5 }], // Numerical values instead of percentages
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 300, // Adjusted to match visual effect
  },
  waveAfter: {
    position: 'absolute',
    width: '200%',
    height: '200%',
    top: 0,
    left: '50%',
    transform: [{ translateX: -75 }, { translateY: -112.5 }], // Numerical values instead of percentages
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 300, // Adjusted to match visual effect
  },
});

export default Loading;
