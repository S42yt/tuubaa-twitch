import { ChatUserstate } from "tmi.js";
import { lurkers } from "./lurk";

export default {
  name: "unlurk",
  description: "Beendet deinen Lurk-Modus",
  userLevel: "Jeder",
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    const username = tags.username;
    if (!username) return "";

    if (lurkers.has(username)) {
      lurkers.delete(username);
      return `Wilkommen zurück zum Stream, ${tags["display-name"]} 👋`;
    }

    return `${tags["display-name"]}, wie wachst du auf, ohne zu schlafen?`;
  },
};
