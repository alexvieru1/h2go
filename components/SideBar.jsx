import React from "react";
import { View, Text, TouchableOpacity, Image, Animated } from "react-native";
import { Link, useRouter } from "expo-router";
import { Octicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

const SideBar = ({ user, isSidebarOpen, sidebarAnimation, closeSidebar }) => {
  const router = useRouter();

  return (
    <>
      {isSidebarOpen && (
        <TouchableOpacity
          className="absolute w-full h-full z-10"
          onPress={closeSidebar}
          activeOpacity={1}
        >
          <View className="absolute w-full h-full bg-transparent" />
        </TouchableOpacity>
      )}
      <Animated.View
        style={{
          transform: [{ translateX: sidebarAnimation }],
        }}
        className="absolute left-0 top-0 bottom-0 mt-12 w-64 bg-[#134A71] rounded-tr-lg rounded-br-lg p-5 z-20"
      >
        {/* Sidebar content */}
        <View className="flex-row justify-between">
          <View className="flex-col">
            <Text className="text-white font-pmedium text-xl">
              {user.firstName}
            </Text>
            <Link
              href="/profile"
              className="text-blue-500 underline font-pmedium text-sm"
            >
              Edit profile
            </Link>
          </View>
          <View className="w-10 h-10 rounded-full flex justify-center items-center">
            <Image
              source={{ uri: user?.avatar }}
              className="w-[90%] h-[90%] rounded-full"
              resizeMode="cover"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            router.push("/purchases");
          }}
          activeOpacity={0.7}
          className="flex-row mt-16 items-center"
        >
          <Octicons name="checklist" size={24} color="white" />
          <Text className="text-white text-lg font-pregular ml-2">
            Comenzile mele
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push("/support");
          }}
          activeOpacity={0.7}
          className="flex-row mt-6 items-center"
        >
          <AntDesign name="customerservice" size={24} color="white" />
          <Text className="text-white text-lg font-pregular ml-2">Suport</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            router.push("/about");
          }}
          activeOpacity={0.7}
          className="flex-row mt-6 items-center"
        >
          <Feather name="info" size={24} color="white" />
          <Text className="text-white text-lg font-pregular ml-2">Despre</Text>
        </TouchableOpacity>
        {user.role === "ROLE_ADMIN" && (
          <View>
            <TouchableOpacity
              onPress={() => {
                router.push("/add-provider");
              }}
              activeOpacity={0.7}
              className="flex-row mt-6 items-center"
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={24}
                color="white"
              />
              <Text className="text-white text-lg font-pregular ml-2">
                Adauga sponsor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/update-provider");
              }}
              activeOpacity={0.7}
              className="flex-row mt-6 items-center"
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={24}
                color="white"
              />
              <Text className="text-white text-lg font-pregular ml-2">
                Update stoc sponsor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/delete-provider");
              }}
              activeOpacity={0.7}
              className="flex-row mt-6 items-center"
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={24}
                color="white"
              />
              <Text className="text-white text-lg font-pregular ml-2">
                Sterge sponsor
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("/update-stock");
              }}
              activeOpacity={0.7}
              className="flex-row mt-6 items-center"
            >
              <MaterialIcons
                name="admin-panel-settings"
                size={24}
                color="white"
              />
              <Text className="text-white text-lg font-pregular ml-2">
                Update stoc tonomat
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </>
  );
};

export default SideBar;
