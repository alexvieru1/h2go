import React from "react";
import { Stack } from "expo-router";

const MapLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="explore" options={{headerShown:false}}/>
      </Stack>
    </>
  );
};

export default MapLayout;