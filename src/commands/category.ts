import { ChatUserstate } from "tmi.js";
import axios from "axios";
import dotenv from "dotenv";
import {
  getChannelToken,
  getChannelInfo,
  searchGame,
  updateChannelCategory,
} from "../utils/broadcastFetcher";

dotenv.config();

if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_OAUTH_TOKEN) {
  console.error("Missing required environment variables for category command");
}

export default {
  name: "category",
  description:
    "Ändert die Kategorie des Streams oder zeigt die aktuelle an (nur Mods)",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod &&
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return `@${tags["display-name"]} Du hast keine Berechtigung, die Kategorie zu ändern!`;
    }

    const channelName = channel.replace("#", "");

    const channelToken = getChannelToken(channelName);
    if (!channelToken) {
      return `@${tags["display-name"]} Um die Kategorie zu ändern, muss der Streamer erst einen Token einrichten mit !settoken`;
    }

    if (args.length === 0) {
      try {
        const channelInfo = await getChannelInfo(channelName);
        return `@${tags["display-name"]} Aktuelle Kategorie: "${channelInfo.game_name}"`;
      } catch (error) {
        console.error("Error fetching category:", error);
        return `@${tags["display-name"]} Fehler beim Abrufen der aktuellen Kategorie.`;
      }
    }

    const categoryName = args.join(" ");

    try {
      const gameInfo = await searchGame(categoryName);

      if (!gameInfo) {
        return `@${tags["display-name"]} Kategorie "${categoryName}" wurde nicht gefunden.`;
      }

      await updateChannelCategory(channelName, gameInfo.id, channelToken);
      return `@${tags["display-name"]} Die Stream-Kategorie wurde erfolgreich zu "${gameInfo.name}" geändert!`;
    } catch (error) {
      console.error("Error changing category:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return `@${tags["display-name"]} Token abgelaufen oder ungültig. Der Streamer muss einen neuen Token einrichten mit !settoken`;
      }
      return `@${tags["display-name"]} Fehler beim Ändern der Kategorie. Bitte überprüfe die Bot-Berechtigungen.`;
    }
  },
};
