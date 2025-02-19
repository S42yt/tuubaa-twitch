import { ChatUserstate } from "tmi.js";
import { client } from "../client";

export default {
  name: "ban",
  description:
    "Permanently ban a user from the channel (e.g. !ban @user reason)",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod &&
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return ` ${tags.username} You don't have permission to use this command!`;
    }

    if (args.length < 1) {
      return ` ${tags.username} Usage: !ban @username [reason]`;
    }

    const targetUser = args[0].replace("@", "");
    const reason = args.slice(1).join(" ") || "No reason specified";

    try {
      await client.ban(channel, targetUser, reason);
      return ` ${tags.username} Successfully banned ${targetUser} (Reason: ${reason})`;
    } catch (error) {
      console.error("Ban error:", error);
      return ` ${tags.username} Failed to ban user. Make sure the username is correct and the bot has necessary permissions.`;
    }
  },
};
