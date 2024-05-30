import { Client, Account, Avatars, Databases, ID, Query } from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "663e23930008dc6117cf",
  databaseId: "663e2625002293d0498b",
  userCollectionId: "663e42410039cb090418",
  vendingMachinesCollectionId: "663e42540031fd4b1737",
  ordersCollectionId: "663e4545002b797511e5",
  googleWebClientId: "1007442589595-abebii5f079cqp7gike1prq3g7gpm6ac.apps.googleusercontent.com",
  googleAndroidClientId: "1007442589595-t2af7qcla20p4jf1gmu1u5v0kv4um7c2.apps.googleusercontent.com",
  googleIosClientId:"1007442589595-c8mtflv1tuhi1e77lpt5v68901tm7rof.apps.googleusercontent.com"
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, firstName, lastName, password, phoneNumber) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password);
    if (!newAccount) throw Error;

    const fullName = `${firstName} ${lastName}`;
    const avatarUrl = avatars.getInitials(fullName);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        userId: newAccount.$id,
        email,
        firstName,
        lastName,
        phoneNumber,
        avatar: avatarUrl,
        ordersList: [],
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export async function signIn(email, password) {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function signOut() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getAccount() {
  try {
    const currentAccount = await account.get();
    console.log(currentAccount);
    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("userId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getVendingMachines() {
  try {
    const vendingMachines = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vendingMachinesCollectionId
    );

    console.log(vendingMachines.documents);
    return vendingMachines.documents;
  } catch (error) {
    console.error("Failed to fetch vending machines:", error);
    throw new Error(error);
  }
}

export async function createOrderAndAddToUserList(orderData, userId, vendingMachineId, quantity) {
  try {
    const order = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      ID.unique(),
      orderData
    );

    console.log(`Order created with ID: ${order.$id}`);

    const userDocument = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    console.log(`User document retrieved with ID: ${userDocument.$id}`);

    const updatedOrdersList = userDocument.ordersList ? [...userDocument.ordersList, order.$id] : [order.$id];

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { ordersList: updatedOrdersList }
    );

    console.log(`User document updated with new order list`);

    const vendingMachines = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vendingMachinesCollectionId,
      [Query.equal('vendingMachineId', vendingMachineId)]
    );

    if (vendingMachines.documents.length === 0) {
      throw new Error('Vending machine not found');
    }

    const vendingMachine = vendingMachines.documents[0];
    console.log(`Vending machine document retrieved with ID: ${vendingMachine.$id}`);

    const updatedStock = vendingMachine.stock - quantity;
    if (updatedStock < 0) throw new Error("Insufficient stock");

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.vendingMachinesCollectionId,
      vendingMachine.$id,
      { stock: updatedStock }
    );

    console.log(`Vending machine document updated with new stock`);

    return order;
  } catch (error) {
    console.error("Error creating order and updating user order list:", error);
    throw error;
  }
}

export async function getOrdersByUser(userId) {
  try {
    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      [Query.equal('userId', userId)]
    );

    return orders.documents;
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    throw error;
  }
}
