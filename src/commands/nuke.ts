import { ChatUserstate } from "tmi.js";
import { client } from "../client";

export default {
  name: "nuke",
  description:
    "Löscht eine bestimmte Anzahl an Nachrichten im Chat (nur für Moderatoren)",
  aliases: ["clear", "purge"],
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    const username = tags.username?.toLowerCase();
    const channelName = channel.replace("#", "");

    if (!tags.mod && username !== channelName) {
      return `@${tags["display-name"]} Du hast keine Berechtigung, den Chat zu löschen!`;
    }

    try {
      const messageCount = args[0] ? Math.min(parseInt(args[0], 10), 100) : 50;
      const nukeLine = "⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀".repeat(1000);

      await client.say(channel, nukeLine);

      for (let i = 0; i < messageCount; i++) {
        await client.say(channel, nukeLine);

        if (i % 5 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }

      return;
    } catch (error) {
      console.error("Fehler beim Nuken des Chats:", error);
      return `@${tags["display-name"]} Fehler beim Nuken des Chats. Der Bot muss ein Moderator sein.`;
    }
  },
};
