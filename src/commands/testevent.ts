import { ChatUserstate } from "tmi.js";
import { client } from "../client";

export default {
  name: "testevent",
  description: "Testet Events (z.B. !testevent sub @username oder !testevent cheer @username 500)",
  userLevel: "Wachhunde/Mods",
  execute: async (channel: string, tags: ChatUserstate, args: string[]) => {
    if (
      !tags.mod &&
      tags.username?.toLowerCase() !== channel.replace("#", "")
    ) {
      return `@${tags["display-name"]} Du hast keine Berechtigung, Events zu testen!`;
    }

    if (args.length < 1) {
      return `@${tags["display-name"]} Verwendung: !testevent [sub|subgift|raid|cheer] @username [zusätzliche parameter]`;
    }

    const eventType = args[0].toLowerCase();
    const username = args[1]?.replace("@", "") || "TestUser";

    try {
      switch (eventType) {
        case "sub": {
          const methods = {
            plan: "1000" as "Prime" | "1000" | "2000" | "3000" | undefined,
            prime: false
          };
          const userstate = {
            "msg-param-cumulative-months": "1",
            "display-name": username
          };
          
          client.emit("subscription", channel, username, methods, "", userstate);
          return `@${tags["display-name"]} Subscription Event für ${username} wurde getestet!`;
        }

        case "subgift": {
          const recipient = args[2]?.replace("@", "") || "TestRecipient";
          const methods = {
            plan: "1000" as "Prime" | "1000" | "2000" | "3000" | undefined
          };
          const userstate = {
            "display-name": username,
            "msg-param-origin-id": "test-origin-id"
          };
          
          client.emit("subgift", channel, username, 0, recipient, methods, userstate);
          return `@${tags["display-name"]} Subgift Event von ${username} an ${recipient} wurde getestet!`;
        }

        case "raid": {
          const viewers = parseInt(args[2]) || 10;
          
          client.emit("raided", channel, username, viewers);
          return `@${tags["display-name"]} Raid Event von ${username} mit ${viewers} Zuschauern wurde getestet!`;
        }

        case "cheer": {
          const bits = args[2] || "100";
          const userstate = {
            bits: bits,
            "display-name": username,
            username: username
          };
          
          client.emit("cheer", channel, userstate, `Cheer${bits} Test message!`);
          return `@${tags["display-name"]} Cheer Event für ${username} mit ${bits} Bits wurde getestet!`;
        }

        default:
          return `@${tags["display-name"]} Unbekannter Event-Typ. Verfügbare Events: sub, subgift, raid, cheer`;
      }
    } catch (error) {
      console.error("Error testing event:", error);
      return `@${tags["display-name"]} Fehler beim Testen des Events.`;
    }
  },
};