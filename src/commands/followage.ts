import { ChatUserstate } from "tmi.js";
import axios from "axios";
import dotenv from "dotenv";
import { formatDuration } from "../utils/durationHelper";
import { getBroadcasterId } from "../utils/broadcastFetcher";

dotenv.config();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_OAUTH_TOKEN = process.env.TWITCH_OAUTH_TOKEN;

export default {
  name: "followage",
  description: "Zeigt an, wie lange du einem Kanal bereits folgst",
  aliases: ["following", "folgt"],
  userLevel: "Jeder",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    const channelName = channel.replace("#", "");
    const username = args[0]?.replace("@", "") || tags.username;

    if (!username) {
      return `@${tags["display-name"]} Es konnte kein Benutzername gefunden werden.`;
    }

    try {
      const broadcasterId = await getBroadcasterId(channelName);

      const userResponse = await axios.get(
        `https://api.twitch.tv/helix/users?login=${username}`,
        {
          headers: {
            "Client-ID": TWITCH_CLIENT_ID,
            Authorization: `Bearer ${TWITCH_OAUTH_TOKEN}`,
          },
        },
      );

      if (!userResponse.data.data.length) {
        return `@${tags["display-name"]} Der Benutzer "${username}" konnte nicht gefunden werden.`;
      }

      const userId = userResponse.data.data[0].id;

      const followResponse = await axios.get(
        `https://api.twitch.tv/helix/channels/followers?broadcaster_id=${broadcasterId}&user_id=${userId}`,
        {
          headers: {
            "Client-ID": TWITCH_CLIENT_ID,
            Authorization: `Bearer ${TWITCH_OAUTH_TOKEN}`,
          },
        },
      );

      if (!followResponse.data.data.length) {
        if (username.toLowerCase() === tags.username?.toLowerCase()) {
          return `@${tags["display-name"]} Du folgst ${channelName} noch nicht.`;
        } else {
          return `@${tags["display-name"]} ${username} folgt ${channelName} noch nicht.`;
        }
      }

      const followedAt = new Date(followResponse.data.data[0].followed_at);
      const now = new Date();
      const followDuration = now.getTime() - followedAt.getTime();
      const formattedDuration = formatDuration(followDuration);
      const followDate = followedAt.toLocaleDateString("de-DE");

      if (username.toLowerCase() === tags.username?.toLowerCase()) {
        return `@${tags["display-name"]} Du folgst ${channelName} seit ${formattedDuration} (seit dem ${followDate}).`;
      } else {
        return `@${tags["display-name"]} ${username} folgt ${channelName} seit ${formattedDuration} (seit dem ${followDate}).`;
      }
    } catch (error) {
      console.error("Error in followage command:", error);

      if (axios.isAxiosError(error) && error.response?.status === 401) {
        return `@${tags["display-name"]} OAuth-Token ist ungültig oder abgelaufen.`;
      }
      return `@${tags["display-name"]} Fehler beim Abrufen der Follow-Informationen.`;
    }
  },
};
