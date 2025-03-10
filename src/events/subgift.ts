import { ChatUserstate } from "tmi.js";
import { client } from "../client";

export default {
  name: "subgift",
  description: "Handles subscription gifts",
  execute: (
    channel: string,
    username: string,
    streakMonths: number,
    recipient: string,
    methods: any,
    userstate: ChatUserstate,
  ) => {
    const senderDispName = userstate["display-name"] || username;
    const plan = methods.plan || "1000";
    let tierName = "Tier 1";

    if (plan === "2000") tierName = "Tier 2";
    if (plan === "3000") tierName = "Tier 3";

    const response = `${senderDispName} hat ${recipient} ein ${tierName} Sub geschenkt! Vielen Dank für deine Großzügigkeit! 🎁`;

    client.say(channel, response);
  },
};
