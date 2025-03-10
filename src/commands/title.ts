import { ChatUserstate } from "tmi.js";
import axios from "axios";
import dotenv from "dotenv";
import { getChannelToken, getChannelInfo, updateChannelTitle } from "../utils/broadcastFetcher";

dotenv.config();

if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_OAUTH_TOKEN) {
  console.error("Missing required environment variables for title command");
}

export default {
  name: "title",
  description: "Ändert den Titel des Streams (nur Mods)",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    
    if (!tags.mod && tags.username?.toLowerCase() !== channel.replace("#", "")) {
      return `@${tags["display-name"]} Du hast keine Berechtigung, den Titel zu ändern!`;
    }

    const channelName = channel.replace("#", "");
    
    
    const channelToken = getChannelToken(channelName);
    if (!channelToken) {
      return `@${tags["display-name"]} Um den Titel zu ändern, muss der Streamer erst einen Token einrichten mit !settoken`;
    }

    
    if (args.length === 0) {
      try {
        const channelInfo = await getChannelInfo(channelName);
        return `@${tags["display-name"]} Aktueller Titel: "${channelInfo.title}"`;
      } catch (error) {
        console.error("Error fetching title:", error);
        return `@${tags["display-name"]} Fehler beim Abrufen des aktuellen Titels.`;
      }
    }

    const newTitle = args.join(" ");

    try {
      await updateChannelTitle(channelName, newTitle, channelToken);
      return `@${tags["display-name"]} Der Stream-Titel wurde erfolgreich zu "${newTitle}" geändert!`;
    } catch (error) {
      console.error("Error changing title:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return `@${tags["display-name"]} Token abgelaufen oder ungültig. Der Streamer muss einen neuen Token einrichten mit !settoken`;
      }
      return `@${tags["display-name"]} Fehler beim Ändern des Titels. Bitte überprüfe die Bot-Berechtigungen.`;
    }
  },
};