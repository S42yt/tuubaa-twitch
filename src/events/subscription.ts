import { client } from "../client";

export default {
  name: "subscription",
  description: "Handles new subscriptions",
  execute: (
    channel: string,
    username: string,
    methods: any,
    message: string,
    userstate: any,
  ) => {
    const plan = methods.plan || "1000";
    let tierName = "Tier 1";

    if (plan === "2000") tierName = "Tier 2";
    if (plan === "3000") tierName = "Tier 3";

    const isPrime = methods.prime;
    const subType = isPrime ? "Prime" : tierName;

    let response = `Vielen Dank für dein ${subType} Sub, ${username}! 🎉`;

    if (userstate["msg-param-cumulative-months"] > 1) {
      const months = userstate["msg-param-cumulative-months"];
      response = `Vielen Dank für ${months} Monate Unterstützung mit deinem ${subType} Sub, ${username}! 🎉`;
    }

    client.say(channel, response);
  },
};
