import {
  Client,
  Account,
  Avatars,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  projectId: "663e23930008dc6117cf",
  databaseId: "663e2625002293d0498b",
  userCollectionId: "663e42410039cb090418",
  vendingMachinesCollectionId: "663e42540031fd4b1737",
  ordersCollectionId: "663e4545002b797511e5",
  providersCollectionId: "665f032100063ef7b27c",
  supportTicketsCollectionId: "666d980c0001f4e34779",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);


export const createUser = async (
  email,
  firstName,
  lastName,
  password,
  phoneNumber
) => {
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
        role: "ROLE_CLIENT",
      }
    );

    return newUser;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const deleteUser = async () => {
  try {
    // Step 1: Get the current user's account details
    const currentAccount = await account.get();
    
    if (!currentAccount) {
      throw new Error("User account not found");
    }

    const userId = currentAccount.$id;

    // Step 2: Delete the user's document from the user collection
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    console.log(`User document with ID: ${userId} deleted`);

    // Step 3: Sign out the user
    await account.deleteSession("current");
    console.log("User signed out");

  } catch (error) {
    console.error("Failed to delete user account and sign out:", error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getAccount = async () => {
  try {
    const currentAccount = await account.get();
    console.log(currentAccount);
    return currentAccount;
  } catch (error) {
    throw new Error(error);
  }
};

export const getUserDetails = async (userId) => {
  try {
    const userDetails = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    return userDetails;
  } catch (error) {
    console.error("Failed to fetch user details:", error);
    throw error;
  }
};

export const getCurrentUser = async () => {
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
};

export const getVendingMachines = async () => {
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
};

export const updateVendingMachineStock = async (vendingMachineId, stock) => {
  try {
    // Fetch the vending machine document
    const vendingMachines = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vendingMachinesCollectionId,
      [Query.equal("vendingMachineId", vendingMachineId)]
    );

    if (vendingMachines.documents.length === 0) {
      throw new Error("Vending machine not found");
    }

    const vendingMachine = vendingMachines.documents[0];

    // Update the vending machine stock
    const updatedVendingMachine = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.vendingMachinesCollectionId,
      vendingMachine.$id,
      { stock: stock }
    );

    console.log(`Vending machine stock updated for ID: ${vendingMachine.$id}`);
    return updatedVendingMachine;
  } catch (error) {
    console.error("Failed to update vending machine stock:", error);
    throw error;
  }
};

export const createOrderAndAddToUserList = async (
  orderData,
  userId,
  vendingMachineId,
  quantity
) => {
  try {
    // Step 1: Create the order document
    const order = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      ID.unique(),
      orderData
    );

    console.log(`Order created with ID: ${order.$id}`);

    // Step 2: Update the user's orders list
    const userDocument = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );

    console.log(`User document retrieved with ID: ${userDocument.$id}`);

    const updatedOrdersList = userDocument.ordersList
      ? [...userDocument.ordersList, order.$id]
      : [order.$id];

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId,
      { ordersList: updatedOrdersList }
    );

    console.log(`User document updated with new order list`);

    // Step 3: Update the vending machine's stock
    const vendingMachines = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.vendingMachinesCollectionId,
      [Query.equal("vendingMachineId", vendingMachineId)]
    );

    if (vendingMachines.documents.length === 0) {
      throw new Error("Vending machine not found");
    }

    const vendingMachine = vendingMachines.documents[0];
    console.log(
      `Vending machine document retrieved with ID: ${vendingMachine.$id}`
    );

    const updatedStock = vendingMachine.stock - quantity;
    if (updatedStock < 0) throw new Error("Insufficient stock");

    await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.vendingMachinesCollectionId,
      vendingMachine.$id,
      { stock: updatedStock }
    );

    console.log(`Vending machine document updated with new stock`);

    // Step 4: Update the provider's stock
    const providerId = orderData.providerId;
    const providerDocument = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.providersCollectionId,
      providerId
    );

    if (!providerDocument) {
      throw new Error("Provider not found");
    }

    const updatedProvidedStock = providerDocument.providedStock - quantity;
    if (updatedProvidedStock < 0)
      throw new Error("Insufficient provider stock");

    if (updatedProvidedStock === 0) {
      // Remove provider from all associated vending machines
      for (const vendingMachineId of providerDocument.vendingMachinesIds) {
        const vendingMachines = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.vendingMachinesCollectionId,
          [Query.equal("vendingMachineId", vendingMachineId)]
        );

        if (vendingMachines.documents.length === 0) {
          console.error(
            `Vending machine with vendingMachineId: ${vendingMachineId} not found`
          );
          continue;
        }

        const vendingMachine = vendingMachines.documents[0];

        const updatedAvailableSponsors =
          vendingMachine.availableSponsors.filter((id) => id !== providerId);

        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.vendingMachinesCollectionId,
          vendingMachine.$id,
          { availableSponsors: updatedAvailableSponsors }
        );

        console.log(
          `Vending machine with ID: ${vendingMachine.$id} updated, removed sponsor ${providerId}`
        );
      }

      // Delete the provider document
      await databases.deleteDocument(
        appwriteConfig.databaseId,
        appwriteConfig.providersCollectionId,
        providerId
      );

      console.log(`Provider with ID: ${providerId} deleted`);
    } else {
      // Update the provider's stock
      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.providersCollectionId,
        providerId,
        { providedStock: updatedProvidedStock }
      );

      console.log(`Provider document updated with new stock`);
    }

    return order;
  } catch (error) {
    console.error(
      "Error creating order and updating user, vending machine, or provider:",
      error
    );
    throw error;
  }
};

export const getOrdersByUser = async (userId) => {
  try {
    const orders = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.ordersCollectionId,
      [Query.equal("userId", userId)]
    );

    return orders.documents;
  } catch (error) {
    console.error("Error fetching orders for user:", error);
    throw error;
  }
};

export const createProvider = async (
  providerName,
  vendingMachinesIds,
  providedStock
) => {
  try {
    // Generate a unique providerId
    const providerId = ID.unique();

    // Step 1: Create the provider document
    const newProvider = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.providersCollectionId,
      providerId,
      {
        providerId,
        providerName,
        vendingMachinesIds,
        providedStock,
      }
    );

    console.log(`Provider created with ID: ${newProvider.$id}`);

    // Step 2: Update the specified vending machines
    for (const vendingMachineId of vendingMachinesIds) {
      console.log(`Fetching vending machine with ID: ${vendingMachineId}`);

      try {
        const vendingMachines = await databases.listDocuments(
          appwriteConfig.databaseId,
          appwriteConfig.vendingMachinesCollectionId,
          [Query.equal("vendingMachineId", vendingMachineId)]
        );

        if (vendingMachines.total === 0) {
          console.error(
            `Vending machine with vendingMachineId: ${vendingMachineId} not found`
          );
          continue;
        }

        const vendingMachine = vendingMachines.documents[0];

        const updatedAvailableSponsors = vendingMachine.availableSponsors
          ? [...vendingMachine.availableSponsors, providerId]
          : [providerId];

        await databases.updateDocument(
          appwriteConfig.databaseId,
          appwriteConfig.vendingMachinesCollectionId,
          vendingMachine.$id,
          { availableSponsors: updatedAvailableSponsors }
        );

        console.log(
          `Vending machine with ID: ${vendingMachine.$id} updated with new sponsor`
        );
      } catch (error) {
        console.error(
          `Failed to fetch or update vending machine with vendingMachineId: ${vendingMachineId}`,
          error
        );
      }
    }

    return newProvider;
  } catch (error) {
    console.error(
      "Failed to create provider and update vending machines:",
      error
    );
    throw new Error(error);
  }
};

export const fetchProviders = async (providerIds) => {
  try {
    const providerPromises = providerIds.map((id) =>
      databases.getDocument(
        appwriteConfig.databaseId,
        appwriteConfig.providersCollectionId,
        id
      )
    );
    const providers = await Promise.all(providerPromises);
    return providers;
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    throw error;
  }
};

export const fetchAllProviders = async () => {
  try {
    const allProviders = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.providersCollectionId
    );
    return allProviders;
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    throw error;
  }
};

export const fetchProvider = async (providerId) => {
  try {
    const provider = databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.providersCollectionId,
      providerId
    );
    return provider;
  } catch (error) {
    console.error("Failed to fetch provider:", error);
    throw error;
  }
};

export const updateProviderStock = async (providerId, stock) => {
  try {
    const provider = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.providersCollectionId,
      providerId,
      { providedStock: stock }
    );
    return provider;
  } catch (error) {
    console.error("Failed to update provider stock:", error);
    throw error;
  }
};

export const deleteProvider = async (providerId) => {
  try {
    // Step 1: Fetch the provider document to get the list of associated vending machines
    const provider = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.providersCollectionId,
      providerId
    );

    if (!provider) {
      throw new Error("Provider not found");
    }

    // Step 2: Remove the provider from each associated vending machine
    for (const vendingMachineId of provider.vendingMachinesIds) {
      const vendingMachines = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.vendingMachinesCollectionId,
        [Query.equal("vendingMachineId", vendingMachineId)]
      );

      if (vendingMachines.documents.length === 0) {
        console.error(
          `Vending machine with vendingMachineId: ${vendingMachineId} not found`
        );
        continue;
      }

      const vendingMachine = vendingMachines.documents[0];

      const updatedAvailableSponsors = vendingMachine.availableSponsors.filter(
        (id) => id !== providerId
      );

      await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.vendingMachinesCollectionId,
        vendingMachine.$id,
        { availableSponsors: updatedAvailableSponsors }
      );

      console.log(
        `Vending machine with ID: ${vendingMachine.$id} updated, removed sponsor ${providerId}`
      );
    }

    // Step 3: Delete the provider document
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.providersCollectionId,
      providerId
    );

    console.log(`Provider with ID: ${providerId} deleted`);
  } catch (error) {
    console.error("Failed to delete provider:", error);
    throw error;
  }
};

export const createSupportTicket = async (userId, orderId, message, datetime) => {
  try {
    // Create the support ticket document
    const supportTicket = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.supportTicketsCollectionId,
      ID.unique(),
      {
        userId,
        orderId,
        isResolved: false,
        message: message,
        createdAt: datetime
      }
    );

    console.log(`Support ticket created with ID: ${supportTicket.$id}`);
    return supportTicket;
  } catch (error) {
    console.error("Failed to create support ticket:", error);
    throw new Error(error);
  }
};

export const checkOpenSupportTickets = async (orderId) => {
  try {
    const supportTickets = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.supportTicketsCollectionId,
      [Query.equal("orderId", orderId), Query.equal("isResolved", false)]
    );

    return supportTickets.documents.length > 0;
  } catch (error) {
    console.error("Failed to check for open support tickets:", error);
    throw error;
  }
};

export const getAllSupportTickets = async () => {
  try {
    const supportTickets = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.supportTicketsCollectionId
    );
    return supportTickets.documents;
  } catch (error) {
    console.error("Failed to fetch all support tickets:", error);
    throw error;
  }
};

export const updateSupportTicketStatus = async (ticketId) => {
  try {
    const updatedTicket = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.supportTicketsCollectionId,
      ticketId,
      { isResolved: true }
    );
    return updatedTicket;
  } catch (error) {
    console.error("Failed to update support ticket status:", error);
    throw error;
  }
};

export const getSupportTicketsByUser = async (userId) => {
  try {
    const tickets = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.supportTicketsCollectionId,
      [Query.equal("userId", userId)]
    );
    return tickets.documents;
  } catch (error) {
    console.error("Failed to fetch support tickets by user:", error);
    throw error;
  }
};

export const deleteSupportTicket = async (ticketId) => {
  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.supportTicketsCollectionId,
      ticketId
    );
    console.log(`Support ticket with ID: ${ticketId} deleted successfully`);
  } catch (error) {
    console.error("Failed to delete support ticket:", error);
    throw error;
  }
};