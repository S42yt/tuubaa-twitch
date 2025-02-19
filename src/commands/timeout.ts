import { ChatUserstate } from "tmi.js";
import { parseDuration, formatDuration } from "../utils/durationHelper";
import { client } from "../client";

export default {
  name: "timeout",
  description:
    "Timeout a user for specified duration (e.g. !timeout @user 1h30m)",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod &&
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return "You don't have permission to use this command!";
    }

    if (args.length < 2) {
      return "Usage: !timeout @username <duration> (e.g. 1h30m, 2d, 30s)";
    }

    const targetUser = args[0].replace("@", "");
    const durationStr = args[1];

    const duration = parseDuration(durationStr);

    if (!duration) {
      return "Invalid duration format. Use combinations of d (days), h (hours), m (minutes), s (seconds)";
    }

    try {
      const seconds = Math.floor(duration / 1000);
      await client.timeout(
        channel,
        targetUser,
        seconds,
        args.slice(2).join(" ") || "No reason specified",
      );

      return `${targetUser} has been timed out for ${formatDuration(duration)}`;
    } catch (error) {
      console.error("Timeout error:", error);
      return "Failed to timeout user. Make sure the username is correct and the bot has necessary permissions.";
    }
  },
};
