import { ScrollView, Text, View, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import {
  getAllSupportTickets,
  updateSupportTicketStatus,
  getUserDetails,
} from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";

const SupportTickets = () => {
  const { user } = useGlobalContext();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});

  if (user == null) return <Redirect href="/" />;

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const allTickets = await getAllSupportTickets();
        const userDetailsMap = {};

        for (const ticket of allTickets) {
          if (!userDetailsMap[ticket.userId]) {
            const details = await getUserDetails(ticket.userId);
            userDetailsMap[ticket.userId] = {
              name: `${details.firstName} ${details.lastName}`,
              phoneNumber: details.phoneNumber,
            };
          }
        }

        setUserDetails(userDetailsMap);
        setTickets(allTickets);
      } catch (error) {
        console.error("Error fetching all support tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (loading) {
    return <Loading />;
  }

  const ticketRequest = async (phoneNumber) => {
    const url = `tel:${phoneNumber}`;
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Nu se poate efectua apelul. Verificati daca telefonul poate efectua apeluri.");
      }
    } catch (error) {
      console.error("Error opening dialer:", error);
      alert("Failed to open the dialer. Please try again.");
    }
  };

  const resolveTicket = async (ticketId) => {
    try {
      await updateSupportTicketStatus(ticketId);
      setTickets(
        tickets.map((ticket) =>
          ticket.$id === ticketId ? { ...ticket, isResolved: true } : ticket
        )
      );
      alert("Tichet inchis cu succes!");
    } catch (error) {
      console.error("Error resolving support ticket:", error);
      alert("Failed to resolve support ticket. Please try again.");
    }
  };

  return (
    <SafeAreaView className="bg-slate-200 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
            <Text className="text-2xl font-pregular">Tichete suport</Text>
            <View className="mt-10 mb-5">
              <HtoGo />
            </View>
            {tickets.length > 0 ? (
              tickets.map(
                (ticket, index) =>
                  !ticket.isResolved && (
                    <View
                      key={index}
                      className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
                    >
                      <Text className="text-xl font-pbold">
                        Order ID: <Text className="font-pregular">{ticket.orderId}</Text>
                      </Text>
                      <Text className="text-xl font-pbold">
                        Utilizator: <Text className="font-pregular">{userDetails[ticket.userId]?.name || 'Loading...'}</Text>
                      </Text>
                      <Text className="text-xl font-pbold">
                        Creat in: <Text className="font-pregular">{new Date(ticket.createdAt).toLocaleDateString()}</Text>
                      </Text>
                      <Text className="text-xl font-pbold">
                        Mesaj: <Text className="font-pregular">{ticket.message}</Text>
                      </Text>
                      <CustomButton
                        title="Contacteaza utilizator"
                        handlePress={() => ticketRequest(userDetails[ticket.userId]?.phoneNumber)}
                        containerStyles="mt-4 border-2 border-green-700"
                        textStyles="text-green-700"
                      />
                      <CustomButton
                        title="Inchide tichet"
                        handlePress={() => resolveTicket(ticket.$id)}
                        containerStyles="mt-4 border-2 border-blue-700"
                        textStyles="text-blue-700"
                      />
                    </View>
                  )
              )
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

export default SupportTickets;
