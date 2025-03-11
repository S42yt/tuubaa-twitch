import { ChatUserstate } from "tmi.js";
import { client } from "../client";
import { parseDuration, formatDuration } from "../utils/durationHelper";

export default {
  name: "timeout",
  description: "Timeout einen Nutzer für eine bestimmte Zeit (z.B. !timeout @nutzer 10m Spam)",
  aliases: ["to"],
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod && 
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return `@${tags["display-name"]} Du hast keine Berechtigung, diese Aktion durchzuführen!`;
    }

    if (args.length < 2) {
      return `@${tags["display-name"]} Verwendung: !timeout @nutzername <dauer> [grund]`;
    }

    const targetUser = args[0].replace("@", "");
    const durationStr = args[1];
    const reason = args.slice(2).join(" ") || "Kein Grund angegeben";

    if (targetUser.toLowerCase() === channel.replace("#", "").toLowerCase()) {
      return `@${tags["display-name"]} Du kannst den Streamer nicht timeouten.`;
    }

    if (targetUser.toLowerCase() === tags.username?.toLowerCase()) {
      return `@${tags["display-name"]} Du kannst dich nicht selbst timeouten.`;
    }

    try {
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
    } catch (error) {
      console.error("Timeout error:", error);

      if (error instanceof Error) {
        if (error.message.includes("no permission")) {
          return `@${tags["display-name"]} Der Bot hat keine Berechtigung, diese Aktion durchzuführen.`;
        } else if (error.message.includes("not found")) {
          return `@${tags["display-name"]} Der Nutzer ${targetUser} wurde nicht gefunden.`;
        } else if (error.message.includes("bad timeout duration")) {
          return `@${tags["display-name"]} Ungültige Timeout-Dauer. Die maximale Dauer beträgt 2 Wochen.`;
        }
      }

      return `@${tags["display-name"]} Fehler beim Timeout. Überprüfe, ob der Nutzername korrekt ist und der Bot die nötigen Berechtigungen hat.`;
    }
  },
};