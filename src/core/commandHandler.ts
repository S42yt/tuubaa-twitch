import { ChatUserstate } from "tmi.js";
import fs from "fs";
import path from "path";

interface Command {
  name: string;
  description: string;
  aliases?: string[];
  execute: (
    channel: string,
    tags: ChatUserstate,
    args: string[],
    handler: CommandHandler,
  ) => string | Promise<string>;
}

class CommandHandler {
  private commands: Map<string, Command>;
  private aliases: Map<string, string>;
  private prefix: string;

  constructor(prefix: string = "!") {
    this.commands = new Map();
    this.aliases = new Map();
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

        if (command.aliases && Array.isArray(command.aliases)) {
          for (const alias of command.aliases) {
            this.aliases.set(alias.toLowerCase(), command.name);
            console.log(`Registered alias: ${alias} -> ${command.name}`);
          }
        }

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

    let command = this.commands.get(commandName);

    if (!command) {
      const mainCommandName = this.aliases.get(commandName);
      if (mainCommandName) {
        command = this.commands.get(mainCommandName);
      }
    }

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

  public getCommandWithAliases(commandName: string): Command | undefined {
    return this.commands.get(commandName);
  }

  public getAliases(): Map<string, string> {
    return this.aliases;
  }
}

export default CommandHandler;
