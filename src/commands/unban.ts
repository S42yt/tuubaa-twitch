import { ChatUserstate } from "tmi.js";
import { client } from "../client";

export default {
  name: "unban",
  description: "Entbannt einen Nutzer aus dem Kanal (z.B. !unban @nutzer)",
  aliases: ["pardon"],
  userLevel: "Wachhunde/Mods",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod &&
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return `@${tags["display-name"]} Du hast keine Berechtigung, diese Aktion durchzuführen!`;
    }

    if (args.length < 1) {
      return `@${tags["display-name"]} Verwendung: !unban @nutzername`;
    }

    const targetUser = args[0].replace("@", "");

    try {
      await client.unban(channel, targetUser);
      return `@${tags["display-name"]} ${targetUser} wurde entbannt.`;
    } catch (error) {
      console.error("Unban error:", error);

      if (error instanceof Error) {
        if (error.message.includes("no permission")) {
          return `@${tags["display-name"]} Der Bot hat keine Berechtigung, diese Aktion durchzuführen.`;
        } else if (error.message.includes("not found")) {
          return `@${tags["display-name"]} Der Nutzer ${targetUser} wurde nicht gefunden oder ist nicht gebannt.`;
        }
      }

      return `@${tags["display-name"]} Fehler beim Entbannen. Überprüfe, ob der Nutzername korrekt ist und der Bot die nötigen Berechtigungen hat.`;
    }
  },
};
