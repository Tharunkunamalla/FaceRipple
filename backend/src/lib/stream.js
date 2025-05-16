import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error("STREAM_API_KEY and STREAM_API_SECRET must be set");
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

// get user data and create a user in stream chat
export const upsertStreamUser = async (userData) => {
  //upsertUser: means to create a new user or update an existing user
  if (!userData.id) {
    console.error("Stream user ID is missing:", userData);
    throw new Error("Stream user ID is required");
  }

  try {
    await streamClient.upsertUser(userData); // <-- pass single user, not array
    return userData;
  } catch (error) {
    console.error("Error creating/updating user in Stream:", error);
    throw new Error("Failed to create/update user in Stream");
  }
};

export const generateStreamToken = (userId) => {
  try {
    // ensure userId is a string
    const userIdStr = userId.toString();
    return streamClient.createToken(userIdStr);
  } catch (error) {
    console.error("Error generating Stream token:", error);
    throw new Error("Failed to generate Stream token");
  }
};
