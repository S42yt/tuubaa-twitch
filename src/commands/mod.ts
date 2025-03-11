import { ChatUserstate } from "tmi.js";
import { parseDuration, formatDuration } from "../utils/durationHelper";
import { client } from "../client";

export default {
  name: "mod",
  description: "Moderations-Tool: !mod [timeout|ban|unban] @nutzer [dauer] [grund]",
  aliases: ["moderation"],
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod &&
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return `@${tags["display-name"]} Du hast keine Berechtigung, diese Aktion durchzuführen!`;
    }

    if (args.length < 2) {
      return `@${tags["display-name"]} Verwendung: !mod [timeout|ban|unban] @nutzername [dauer für timeout] [grund]`;
    }

    const action = args[0].toLowerCase();
    const targetUser = args[1].replace("@", "");

    if (targetUser.toLowerCase() === channel.replace("#", "").toLowerCase()) {
      return `@${tags["display-name"]} Du kannst keine Moderationsaktionen gegen den Streamer durchführen.`;
    }

    if (targetUser.toLowerCase() === tags.username?.toLowerCase()) {
      return `@${tags["display-name"]} Du kannst keine Moderationsaktionen gegen dich selbst durchführen.`;
    }

    try {
      switch (action) {
        case "timeout": {
          if (args.length < 3) {
            return `@${tags["display-name"]} Für Timeout wird eine Dauer benötigt: !mod timeout @nutzername <dauer> [grund]`;
          }

          const durationStr = args[2];
          const reason = args.slice(3).join(" ") || "Kein Grund angegeben";
          const duration = parseDuration(durationStr);

          if (!duration) {
            return `@${tags["display-name"]} Ungültiges Zeitformat. Verwende Kombinationen aus d (Tage), h (Stunden), m (Minuten), s (Sekunden)`;
          }

          const seconds = Math.floor(duration / 1000);

          if (seconds < 1) {
            return `@${tags["display-name"]} Die Timeout-Dauer muss mindestens 1 Sekunde betragen.`;
          }
          if (seconds > 1209600) {
            return `@${tags["display-name"]} Die maximale Timeout-Dauer beträgt 2 Wochen.`;
          }

          await client.timeout(channel, targetUser, seconds, reason);
          return `@${tags["display-name"]} ${targetUser} wurde für ${formatDuration(duration)} in Timeout gesetzt. Grund: ${reason}`;
        }

        case "ban": {
          const reason = args.slice(2).join(" ") || "Kein Grund angegeben";
          await client.ban(channel, targetUser, reason);
          return `@${tags["display-name"]} ${targetUser} wurde permanent gebannt. Grund: ${reason}`;
        }

        case "unban": {
          await client.unban(channel, targetUser);
          return `@${tags["display-name"]} ${targetUser} wurde entbannt.`;
        }

        case "help": {
          return `@${tags["display-name"]} Verfügbare Befehle: !mod timeout @nutzer <dauer> [grund], !mod ban @nutzer [grund], !mod unban @nutzer, !timeout @nutzer <dauer> [grund], !ban @nutzer [grund], !unban @nutzer`;
        }

        default:
          return `@${tags["display-name"]} Ungültige Aktion. Verfügbare Aktionen: timeout, ban, unban, help`;
      }
    } catch (error) {
      console.error("Moderation error:", error);

      if (error instanceof Error) {
        if (error.message.includes("no permission")) {
          return `@${tags["display-name"]} Der Bot hat keine Berechtigung, diese Aktion durchzuführen.`;
        } else if (error.message.includes("not found")) {
          return `@${tags["display-name"]} Der Nutzer ${targetUser} wurde nicht gefunden.`;
        } else if (error.message.includes("bad timeout duration")) {
          return `@${tags["display-name"]} Ungültige Timeout-Dauer. Die maximale Dauer beträgt 2 Wochen.`;
        }
      }

      return `@${tags["display-name"]} Fehler bei der Moderation. Überprüfe, ob der Nutzername korrekt ist und der Bot die nötigen Berechtigungen hat.`;
    }
  },
};