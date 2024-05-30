import React from "react";
import { Stack } from "expo-router";

const SidebarLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="profile" options={{headerShown:false}}/>
        <Stack.Screen name="purchases" options={{headerShown:false}}/>
        <Stack.Screen name="support" options={{headerShown:false}}/>
        <Stack.Screen name="about" options={{headerShown:false}}/>
      </Stack>
    </>
  );
};

export default SidebarLayout;