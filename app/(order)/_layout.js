import React from "react";
import { Stack } from "expo-router";

const OrderLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="success/[selectedProvider]" options={{headerShown:false}}/>
      </Stack>
    </>
  );
};

export default OrderLayout;