import { ChatUserstate } from "tmi.js";
import fs from "fs";
import path from "path";

interface Command {
  name: string;
  description: string;
  execute: (
    channel: string,
    tags: ChatUserstate,
    args: string[],
    handler: CommandHandler
  ) => string | Promise<string>;
}

class CommandHandler {
  private commands: Map<string, Command>;
  private prefix: string;

  constructor(prefix: string = "!") {
    this.commands = new Map();
    this.prefix = prefix;
    this.loadCommands();
  }

  private async loadCommands() {
    const commandsPath = path.join(__dirname, "..", "commands");

    try {
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

      for (const file of commandFiles) {
        const command = (await import(path.join(commandsPath, file))).default;
        this.commands.set(command.name, command);
        console.log(`Loaded command: ${command.name}`);
      }
    } catch (error) {
      console.error("Error loading commands:", error);
    }
  }

  public async handleMessage(
    channel: string,
    tags: ChatUserstate,
    message: string,
  ) {
    if (!message.startsWith(this.prefix)) return;

    const args = message.slice(this.prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();

    if (!commandName) return;

    const command = this.commands.get(commandName);
    if (!command) return;

    try {
      const response = await command.execute(channel, tags, args, this);
      return response;
    } catch (error) {
      console.error(`Error executing command ${commandName}:`, error);
      return "An error occurred while executing the command.";
    }
  }

  public getCommands(): Map<string, Command> {
    return this.commands;
  }
}

export default CommandHandler;
