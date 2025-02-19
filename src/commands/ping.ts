import { ChatUserstate } from "tmi.js";

export default {
  name: "ping",
  description: "Replies with pong and latency!",
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    const latency = Math.round(Date.now() - Number(tags["tmi-sent-ts"]));
    return `Pong! Latency: ${latency}ms`;
  },
};
