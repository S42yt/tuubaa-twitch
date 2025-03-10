import { ChatUserstate } from "tmi.js";
import { client } from "../client";

export default {
  name: "ban",
  description:
    "Bannt einen Nutzer permanent aus dem Kanal (z.B. !ban @nutzer Grund)",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod &&
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return `@${tags["display-name"]} Du hast keine Berechtigung, diese Aktion durchzuführen!`;
    }

    if (args.length < 1) {
      return `@${tags["display-name"]} Verwendung: !ban @nutzername [grund]`;
    }

    const targetUser = args[0].replace("@", "");
    const reason = args.slice(1).join(" ") || "Kein Grund angegeben";

    try {
      if (targetUser.toLowerCase() === channel.replace("#", "").toLowerCase()) {
        return `@${tags["display-name"]} Du kannst den Streamer nicht bannen.`;
      }

      if (targetUser.toLowerCase() === tags.username?.toLowerCase()) {
        return `@${tags["display-name"]} Du kannst dich nicht selbst bannen.`;
      }

      await client.ban(channel, targetUser, reason);
      return `@${tags["display-name"]} ${targetUser} wurde permanent gebannt. Grund: ${reason}`;
    } catch (error) {
      console.error("Ban error:", error);

      if (error instanceof Error) {
        if (error.message.includes("no permission")) {
          return `@${tags["display-name"]} Der Bot hat keine Berechtigung, diese Aktion durchzuführen.`;
        } else if (error.message.includes("not found")) {
          return `@${tags["display-name"]} Der Nutzer ${targetUser} wurde nicht gefunden.`;
        }
      }

      return `@${tags["display-name"]} Fehler beim Bannen. Überprüfe, ob der Nutzername korrekt ist und der Bot die nötigen Berechtigungen hat. Erro: ${error}`;
    }
  },
};
