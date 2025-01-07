import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/CustomButton";
import { Redirect, useRouter } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import {
  deleteSupportTicket,
  getSupportTicketsByUser,
  getUserDetails,
  updateSupportTicketStatus,
} from "../../lib/appwrite";
import Loading from "../../components/Loading";

const Purchases = () => {
  const { user } = useGlobalContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  if (user == null) return <Redirect href="/" />;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const userTickets = await getSupportTicketsByUser(user.$id);
        const details = await getUserDetails(user.$id);
        setUserDetails(details);
        setTickets(userTickets);
      } catch (error) {
        console.error("Error fetching support tickets for user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const removeTicket = async (ticketId) => {
    try {
      await deleteSupportTicket(ticketId);
      setTickets(tickets.filter(ticket => ticket.$id !== ticketId));
      alert("Tichet sters cu succes!");
    } catch (error) {
      console.error("Error deleting support ticket:", error);
      alert("Failed to delete support ticket. Please try again.");
    }
  };

  return (
    <SafeAreaView className="bg-slate-200 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
            <Text className="text-2xl font-pregular">Suport</Text>
            <View className="mt-10">
              <HtoGo />
            </View>
            <Text className="text-lg font-pmedium text-center mt-10">
              Tichetele mele
            </Text>
            {tickets.length > 0 ? (
              tickets.map((ticket, index) => (
                <View
                  key={index}
                  className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
                >
                  <Text className="text-xl font-pbold">
                    Order ID: {ticket.orderId}
                  </Text>
                  <Text className="text-xl font-pbold">
                    Status: {ticket.isResolved ? "Rezolvat" : "Deschis"}
                  </Text>
                  <CustomButton
                        title="Sterge tichet"
                        handlePress={() => removeTicket(ticket.$id)}
                        containerStyles="mt-4 border-2 border-red-700"
                        textStyles="text-red-700"
                      />
                </View>
              ))
            ) : (
              <Text className="text-lg font-pmedium italic text-center mt-10">
                Nu aveti nici un tichet deschis.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Purchases;
