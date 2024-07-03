import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import {
  checkOpenSupportTickets,
  createSupportTicket,
  getOrdersByUser,
} from "../../lib/appwrite";
import CustomButton from "../../components/CustomButton";
import FormField from "../../components/FormField";

const Purchases = () => {
  const { user } = useGlobalContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pressedButtons, setPressedButtons] = useState({});
  const [messages, setMessages] = useState({});

  if (user == null) return <Redirect href="/" />;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getOrdersByUser(user.$id);
        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <Loading />;
  }

  const ticketRequest = async (orderId) => {
    try {
      const hasOpenTickets = await checkOpenSupportTickets(orderId);
      if (hasOpenTickets) {
        alert("Deja este un tichet deschis pentru aceasta comanda.");
        return;
      }
      const datetime = new Date().toISOString();
      const message = messages[orderId] || "";

      if (message.trim() === "") {
        alert("Completati campul cu mesajul");
        return;
      }

      await createSupportTicket(user.$id, orderId, message, datetime);
      alert("Tichet deschis cu succes!");
    } catch (error) {
      console.error("Error creating support ticket:", error);
      alert("Failed to create support ticket. Please try again.");
    }
  };

  const handlePress = (orderId) => {
    setPressedButtons((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }));
  };

  const handleChangeMessage = (orderId, text) => {
    setMessages((prevState) => ({
      ...prevState,
      [orderId]: text,
    }));
  };

  return (
    <SafeAreaView className="bg-slate-200 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="min-h-[93vh] w-full flex flex-col justify-between px-4 mt-10">
          <View className="flex flex-col">
            <Text className="text-2xl font-pregular">Comenzile mele</Text>
            <View className="mt-10 mb-5">
              <HtoGo />
            </View>
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <View
                  key={order.$id}
                  className="mb-4 p-4 border border-gray-300 rounded-lg bg-white"
                >
                  <Text className="text-xl font-pbold">
                    Order ID: {order.orderId}
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-psemibold">Data:</Text>{" "}
                    {new Date(order.datetime).toLocaleString()}
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-psemibold">Cantitate:</Text>{" "}
                    {order.quantity}
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-psemibold">Total:</Text>{" "}
                    {0.5 * order.quantity} RON
                  </Text>
                  <Text className="text-lg">
                    <Text className="font-psemibold">Adresa aparatului:</Text>{" "}
                    {order.vendingMachineAddress}
                  </Text>
                  {pressedButtons[order.$id] && (
                    <FormField
                      title="Mesaj"
                      value={messages[order.$id] || ""}
                      handleChangeText={(text) =>
                        handleChangeMessage(order.$id, text)
                      }
                      placeholder="Ce s-a intamplat, pe scurt ?"
                      otherStyles="my-2"
                      keyboardType="default"
                    />
                  )}
                  {pressedButtons[order.$id] ? (
                    <CustomButton
                      title="Trimite raportul"
                      handlePress={() => ticketRequest(order.$id)}
                      containerStyles="border-2 border-blue-700"
                      textStyles="text-blue-700"
                    />
                  ) : (
                    <CustomButton
                      title="Raporteaza problema comanda"
                      handlePress={() => handlePress(order.$id)}
                      containerStyles="border-2 border-blue-700"
                      textStyles="text-blue-700"
                    />
                  )}
                </View>
              ))
            ) : (
              <Text className="text-lg font-pmedium italic text-center mt-10">
                Nu aveti nici o comanda plasata.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Purchases;
