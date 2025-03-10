import { ChatUserstate } from "tmi.js";
import CommandHandler from "../core/commandHandler";

let commandHandler: CommandHandler | null = null;

export default {
  name: "commands",
  description: "Zeigt alle verfügbaren Befehle an",
  aliases: ["cmds", "hilfe", "befehle"],
  execute: (channel: string, tags: ChatUserstate, args: string[], handler?: CommandHandler) => {
    if (handler) {
      commandHandler = handler;
    }

    if (!commandHandler) {
      return `@${tags.username} Fehler: Command Handler wurde nicht initialisiert`;
    }

    const commands = commandHandler.getCommands();
    const commandList = Array.from(commands.values())
      .filter(cmd => cmd.name !== 'undefined' && cmd.description !== 'undefined')
      .map(cmd => `!${cmd.name} (${cmd.description})`)
      .join('\n\n');

    return `@${tags.username}\nVerfügbare Befehle:\n\n${commandList}`;
  },
};