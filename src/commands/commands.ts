import { ChatUserstate } from "tmi.js";
import CommandHandler from "../core/commandHandler";

export default {
  name: "commands",
  description: "Shows all available commands",
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    const handler = new CommandHandler();
    const commands = handler.getCommands();

    const commandList = Array.from(commands.values())
      .map((cmd) => `${cmd.name}: ${cmd.description}`)
      .join(" | ");

    return ` ${tags.username} Available commands: ${commandList}`;
  },
};
