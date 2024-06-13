import React, { useState, useRef, useEffect } from "react";
import { View, Animated, Text, Alert } from "react-native";
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
import MapViewDirections from "react-native-maps-directions";

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
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [time, setTime] = useState(null);
  const [destination, setDestination] = useState(null);

  const router = useRouter();
  const GOOGLE_MAPS_APIKEY = 'AIzaSyBr5biKuVQxxFXscwgKks3wzSGjXO8wy5A';

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (deg) => deg * (Math.PI / 180);
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in kilometers
    return distance;
  };

  useEffect(() => {
    const fetchLocationAndVendingMachines = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          throw new Error("User not authenticated");
        }

        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permission to access location was denied");
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };
        setInitialRegion(region);
        setUserLocation(location.coords);

        const machines = await getVendingMachines();
        if (Array.isArray(machines)) {
          setVendingMachines(machines);
        } else {
          console.error("Expected an array of vending machines but got:", machines);
          setVendingMachines([]);
        }

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
    if (userLocation) {
      const distance = getDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(machine.latitude),
        parseFloat(machine.longitude)
      );
      console.log(`Distance: ${distance.toFixed(2)} km`); // Log distance to the console
      setDistance(distance.toFixed(2)); // Round to 2 decimal places
    }
    setSelectedMachine(machine);
    setDestination({
      latitude: parseFloat(machine.latitude),
      longitude: parseFloat(machine.longitude),
    });
    setIsPressed(true);
  };

  const clearSelectionPress = () => {
    setSelectedMachine(null);
    setIsPressed(false);
    setDestination(null);
  };

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

              {destination && userLocation && (
                <MapViewDirections
                  origin={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  destination={destination}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={6}
                  strokeColor="blue"
                  onReady={result => {
                    setDistance(result.distance.toFixed(2))
                    setTime(Math.round(result.duration.toFixed(2)))
                  }}
                />
              )}
            </MapView>
            {selectedMachine && (
              <VendingMachineDetails machine={selectedMachine} duration={time} distance={distance} />
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
