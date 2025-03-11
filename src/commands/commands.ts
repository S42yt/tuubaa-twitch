import { ChatUserstate } from "tmi.js";
import dotenv from "dotenv";

dotenv.config();

const COMMANDS_LINK = "https://tuubaa.de/commands";

export default {
  name: "commands",
  description: "Zeigt den Link zu den Befehlen",
  aliases: ["cmd", "cmds", "help", "befehle", "hilfe"],
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    const username = tags["display-name"] || tags.username;

    const channelName = channel.replace("#", "");

    let response = `Hey ${username}! Wenn du alle Commands sehen willst geh auf: ${COMMANDS_LINK}`;

    return response;
  },
};
