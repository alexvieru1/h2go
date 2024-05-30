import React from "react";
import { Stack } from "expo-router";

const OrderLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="success" options={{headerShown:false}}/>
      </Stack>
    </>
  );
};

export default OrderLayout;