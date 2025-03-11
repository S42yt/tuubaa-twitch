import { ChatUserstate } from "tmi.js";
import dotenv from "dotenv";

dotenv.config();

const DISCORD_INVITE = "https://discord.gg/tuubaa";

export default {
  name: "discord",
  description: "Zeigt den Link zum Discord-Server",
  aliases: ["dc", "community"],
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    const username = tags["display-name"] || tags.username;

    const channelName = channel.replace("#", "");

    let response = `Hey ${username}! schau vorbei in tuubaas goldenem Van: ${DISCORD_INVITE}`;

    return response;
  },
};
