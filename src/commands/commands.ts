import { ChatUserstate } from "tmi.js";
import CommandHandler from "../core/commandHandler";

let commandHandler: CommandHandler | null = null;

export default {
  name: "commands",
  description: "Shows all available commands",
  execute: (channel: string, tags: ChatUserstate, args: string[], handler?: CommandHandler) => {
    if (handler) {
      commandHandler = handler;
    }

    if (!commandHandler) {
      return `/w ${tags.username} Error: Command handler not initialized`;
    }

    const commands = commandHandler.getCommands();
    const commandList = Array.from(commands.values())
      .map(cmd => `${cmd.name}: ${cmd.description}`)
      .join(" | ");

    return ` ${tags.username} Available commands: ${commandList}`;
  },
};