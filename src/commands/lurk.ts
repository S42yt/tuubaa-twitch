import { ChatUserstate } from "tmi.js";

export const lurkers = new Set<string>();

export default {
  name: "lurk",
  description: "Zeigt an, dass du gerade lurkst",
  userLevel: "Jeder",
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    const username = tags.username;
    if (!username) return "";

    if (!lurkers.has(username)) {
      lurkers.add(username);
      return `${tags["display-name"]} schläft im stream ein!`;
    }

    return `${tags["display-name"]}, du schläfst bereits!`;
  },
};
