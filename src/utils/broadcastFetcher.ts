import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID;
const TWITCH_OAUTH_TOKEN = process.env.TWITCH_OAUTH_TOKEN;
const TOKENS_FILE = path.join(__dirname, "../../tokens.json");

interface TokenData {
  [channelName: string]: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  };
}

interface ChannelInfo {
  broadcaster_id: string;
  broadcaster_login: string;
  broadcaster_name: string;
  game_id: string;
  game_name: string;
  title: string;
  delay: number;
  tags: string[];
  content_classification_labels: string[];
  is_branded_content: boolean;
}

interface Game {
  id: string;
  name: string;
  box_art_url: string;
}

export function getChannelToken(channelName: string): string | null {
  try {
    if (fs.existsSync(TOKENS_FILE)) {
      const data = fs.readFileSync(TOKENS_FILE, "utf8");
      const tokens: TokenData = JSON.parse(data);
      if (tokens[channelName]) {
        return tokens[channelName].access_token;
      }
    }
  } catch (error) {
    console.error("Error reading tokens file:", error);
  }
  return null;
}

export async function getBroadcasterId(channelName: string): Promise<string> {
  const userResponse = await axios.get(`https://api.twitch.tv/helix/users?login=${channelName}`, {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${TWITCH_OAUTH_TOKEN}`
    }
  });
  
  const broadcasterId = userResponse.data.data[0]?.id;
  
  if (!broadcasterId) {
    throw new Error(`Channel ${channelName} not found`);
  }
  
  return broadcasterId;
}


export async function getChannelInfo(channelName: string): Promise<ChannelInfo> {
  const broadcasterId = await getBroadcasterId(channelName);
  
  const channelResponse = await axios.get(`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`, {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${TWITCH_OAUTH_TOKEN}`
    }
  });
  
  return channelResponse.data.data[0];
}

export async function searchGame(gameName: string): Promise<Game | null> {
  const response = await axios.get(`https://api.twitch.tv/helix/games?name=${encodeURIComponent(gameName)}`, {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${TWITCH_OAUTH_TOKEN}`
    }
  });
  
  if (response.data.data.length === 0) {
    const searchResponse = await axios.get(`https://api.twitch.tv/helix/search/categories?query=${encodeURIComponent(gameName)}&first=1`, {
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${TWITCH_OAUTH_TOKEN}`
      }
    });
    
    if (searchResponse.data.data.length === 0) {
      return null;
    }
    
    return searchResponse.data.data[0];
  }
  
  return response.data.data[0];
}

export async function updateChannelTitle(channelName: string, newTitle: string, channelToken: string): Promise<void> {
  const broadcasterId = await getBroadcasterId(channelName);
  
  await axios.patch(`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`, {
    title: newTitle
  }, {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${channelToken}`,
      "Content-Type": "application/json"
    }
  });
}

export async function updateChannelCategory(channelName: string, gameId: string, channelToken: string): Promise<void> {
  const broadcasterId = await getBroadcasterId(channelName);
  
  await axios.patch(`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`, {
    game_id: gameId
  }, {
    headers: {
      "Client-ID": TWITCH_CLIENT_ID,
      "Authorization": `Bearer ${channelToken}`,
      "Content-Type": "application/json"
    }
  });
}


export async function updateChannelInfo(
  channelName: string, 
  updates: { title?: string; gameId?: string }, 
  channelToken: string
): Promise<void> {
  const broadcasterId = await getBroadcasterId(channelName);
  
  const payload: Record<string, string> = {};
  if (updates.title) payload.title = updates.title;
  if (updates.gameId) payload.game_id = updates.gameId;
  
  if (Object.keys(payload).length > 0) {
    await axios.patch(`https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`, payload, {
      headers: {
        "Client-ID": TWITCH_CLIENT_ID,
        "Authorization": `Bearer ${channelToken}`,
        "Content-Type": "application/json"
      }
    });
  }
}