import React, { useState, useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BurgerButton from "../../components/BurgerButton";
import { Redirect, useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import Loading from "../../components/Loading";
import SideBar from "../../components/SideBar";
import CustomMarker from "../../components/CustomMarker";
import { getCurrentUser, getVendingMachines } from "../../lib/appwrite";
import VendingMachineDetails from "../../components/VendingMachineDetails";

const Explore = () => {
  const { user } = useGlobalContext();

  if (user == null) return <Redirect href="/" />;

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarWidth = 256;
  const sidebarAnimation = useRef(new Animated.Value(-sidebarWidth)).current;

  const [initialRegion, setInitialRegion] = useState(null);
  const [vendingMachines, setVendingMachines] = useState([]);
  const mapRef = useRef(null);

  const [selectedMachine, setSelectedMachine] = useState(null);
  const [isPressed, setIsPressed] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchLocationAndVendingMachines = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          throw new Error("User not authenticated");
        }
        
        // Request location permission
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        // Fetch current location
        let location = await Location.getCurrentPositionAsync({});
        const region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(region);

        // Fetch vending machines
        const machines = await getVendingMachines();
        if (Array.isArray(machines)) {
          setVendingMachines(machines);
        } else {
          console.error("Expected an array of vending machines but got:", machines);
          setVendingMachines([]);
        }

        // console.log(machines);

        const validCoordinates = machines
          .filter((machine) => machine.latitude && machine.longitude)
          .map((machine) => ({
            latitude: parseFloat(machine.latitude),
            longitude: parseFloat(machine.longitude),
          }));

        if (mapRef.current && validCoordinates.length > 0) {
          mapRef.current.fitToCoordinates(validCoordinates, {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          });
        }
      } catch (error) {
        console.error("Error fetching location or vending machines:", error);
      }
    };

    fetchLocationAndVendingMachines();
  }, [isSidebarOpen]);

  const clearSession = async () => {
    await signOut();
    router.replace("/");
  };

  const toggleSidebar = () => {
    if (isSidebarOpen) {
      closeSidebar();
    } else {
      openSidebar();
    }
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    Animated.timing(sidebarAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarAnimation, {
      toValue: -sidebarWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setSidebarOpen(false));
  };

  const markerPress = (machine) => {
    setSelectedMachine(machine);
    setIsPressed(true);
  };

  const clearSelectionPress = () => {
    setSelectedMachine(null);
    setIsPressed(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#E5E7EB" }}>
      <SideBar
        user={user}
        isSidebarOpen={isSidebarOpen}
        sidebarAnimation={sidebarAnimation}
        closeSidebar={closeSidebar}
      />
      <View style={{ flex: 1 }}>
        {initialRegion ? (
          <View style={{ flex: 1 }}>
            <MapView
              ref={mapRef}
              style={{ flex: 1 }}
              initialRegion={initialRegion}
              showsUserLocation
              onPress={clearSelectionPress}
            >
              {Array.isArray(vendingMachines) && vendingMachines
                .filter((machine) => machine.latitude && machine.longitude)
                .map((machine, index) => (
                  <CustomMarker
                    key={index}
                    coordinate={{
                      latitude: parseFloat(machine.latitude),
                      longitude: parseFloat(machine.longitude),
                    }}
                    onPress={() => markerPress(machine)}
                    isPressed={isPressed && selectedMachine?.vendingMachineId === machine.vendingMachineId}
                  />
                ))}
            </MapView>
            {selectedMachine && (
              <VendingMachineDetails machine={selectedMachine} />
            )}
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Loading />
          </View>
        )}
        {!isSidebarOpen && (
          <View style={{ position: "absolute", top: 10, left: 10, zIndex: 20 }}>
            <BurgerButton handlePress={toggleSidebar} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Explore;
