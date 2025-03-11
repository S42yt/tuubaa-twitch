import { ChatUserstate } from "tmi.js";

export default {
  name: "ping",
  description: "Zeigt wie schnell der Bot ist!",
  userLevel: "Jeder",
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    const latency = Math.round(Date.now() - Number(tags["tmi-sent-ts"]));
    return `Pong! Latency: ${latency}ms`;
  },
};
