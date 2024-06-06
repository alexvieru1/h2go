import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect} from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import HtoGo from "../../components/HtoGo";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { getOrdersByUser } from "../../lib/appwrite";

const Purchases = () => {
  const { user } = useGlobalContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  if (user == null) return <Redirect href="/" />;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getOrdersByUser(user.$id);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <Loading/>;
  }

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
                <View key={order.$id} className="mb-4 p-4 border border-gray-300 rounded-lg bg-white">
                  <Text className="text-xl font-pbold">Order ID: {order.orderId}</Text>
                  <Text className="text-lg"><Text className="font-psemibold">Data:</Text> {new Date(order.datetime).toLocaleString()}</Text>
                  <Text className="text-lg"><Text className="font-psemibold">Cantitate:</Text> {order.quantity}</Text>
                  <Text className="text-lg"><Text className="font-psemibold">Total:</Text> {0.5*order.quantity} RON</Text>
                  <Text className="text-lg"><Text className="font-psemibold">Adresa aparatului:</Text> {order.vendingMachineAddress}</Text>
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
