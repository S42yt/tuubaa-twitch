import { client } from "../client";

export default {
  name: "raided",
  description: "Handles incoming raids",
  execute: (channel: string, username: string, viewers: number) => {
    const response =
      viewers > 1
        ? `Vielen Dank für den Raid mit ${viewers} Zuschauern, ${username}! Herzlich willkommen alle zusammen! 🎉`
        : `Vielen Dank für den Raid, ${username}! Herzlich willkommen! 🎉`;

    client.say(channel, response);
  },
};
