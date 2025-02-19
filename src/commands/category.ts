import { ChatUserstate } from "tmi.js";
import { client } from "../client";

export default {
  name: "category",
  description: "Change the channel category/game (Mods only)",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod &&
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return ` ${tags.username} You don't have permission to use this command!`;
    }

    if (args.length < 1) {
      return ` ${tags.username} Usage: !category <game name>`;
    }

    const categoryName = args.join(" ");
    const channelName = channel.replace("#", "");

    try {
      await client.say(channel, `/game ${categoryName}`);
      return ` ${tags.username} Successfully changed category to: ${categoryName}`;
    } catch (error) {
      console.error("Category change error:", error);
      return ` ${tags.username} Failed to change category. Make sure the bot has the necessary permissions.`;
    }
  },
};
