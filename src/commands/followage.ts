import { ChatUserstate } from "tmi.js";
import axios from "axios";

export default {
  name: "followage",
  description: "Zeigt wie lange du dem Kanal folgst",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    const targetUser = tags.username;  
    const channelName = channel.replace("#", "");

    try {
      const clientId = process.env.TWITCH_CLIENT_ID;
      const oauthToken = process.env.TWITCH_OAUTH_TOKEN?.replace("oauth:", "");

      if (!clientId || !oauthToken) {
        return ` ${tags.username} Fehler: Twitch API Anmeldedaten fehlen`;
      }

      const headers = {
        'Client-ID': clientId,
        'Authorization': `Bearer ${oauthToken}`
      };

      const [userResponse, channelResponse] = await Promise.all([
        axios.get(`https://api.twitch.tv/helix/users?login=${targetUser}`, { headers }),
        axios.get(`https://api.twitch.tv/helix/users?login=${channelName}`, { headers })
      ]);

      if (!userResponse.data.data[0] || !channelResponse.data.data[0]) {
        return `/w ${tags.username} Fehler: User oder Kanal nicht gefunden`;
      }

      const followResponse = await axios.get(
        `https://api.twitch.tv/helix/users/follows?from_id=${userResponse.data.data[0].id}&to_id=${channelResponse.data.data[0].id}`,
        { headers }
      );

      if (!followResponse.data.data.length) {
        return `Du folgst ${channelName} nicht`;
      }

      const followDate = new Date(followResponse.data.data[0].followed_at);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - followDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const germanDate = followDate.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });

      return `Du folgst ${channelName} seit ${diffDays} ${diffDays === 1 ? 'Tag' : 'Tagen'} (seit dem ${germanDate})`;

    } catch (error) {
      console.error("Followage error:", error);
      return ` ${tags.username} Fehler beim Abrufen der Followage-Information`;
    }
  }
};