import React from "react";
import { Stack } from "expo-router";

const SidebarLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="purchases" options={{ headerShown: false }} />
        <Stack.Screen name="support" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
        <Stack.Screen name="add-provider" options={{ headerShown: false }} />
        <Stack.Screen name="update-provider" options={{ headerShown: false }} />
        <Stack.Screen name="delete-provider" options={{ headerShown: false }} />
        <Stack.Screen name="update-stock" options={{ headerShown: false }} />
        <Stack.Screen name="support-tickets" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default SidebarLayout;
