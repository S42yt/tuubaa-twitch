import { ChatUserstate } from "tmi.js";
import { client } from "../client";

export default {
  name: "cheer",
  description: "Handles bits cheering in the chat",
  execute: (channel: string, userstate: ChatUserstate, message: string) => {
    if (!userstate.bits) return;

    const bits = parseInt(userstate.bits);
    const username = userstate["display-name"] || userstate.username;

    let response = `Vielen Dank für die ${bits} Bits, ${username}! 🎉`;

    switch (true) {
      case bits >= 10000:
        response = `WOW! Vielen herzlichen Dank für die unglaublichen ${bits} Bits, ${username}! Das ist wirklich großzügig! 🎉🎉🎉`;
        break;
      case bits >= 5000:
        response = `Wahnsinn! Vielen Dank für die großzügigen ${bits} Bits, ${username}! 🎉🎉`;
        break;
      case bits >= 1000:
        response = `Fantastisch! Vielen Dank für die tollen ${bits} Bits, ${username}! 🎉`;
        break;
    }

    client.say(channel, response);
  },
};
