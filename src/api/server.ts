import fastify, { FastifyInstance } from "fastify";
import fastifyCors from "@fastify/cors";
import fs from "fs";
import path from "path";

interface CommandMetadata {
  command: string;
  aliases?: string[];
  user: string;
  description: string;
}

async function buildServer(): Promise<FastifyInstance> {
  const app = fastify({ logger: true });

  await app.register(fastifyCors, {
    origin: [
      "https://tuubaa.de",
      "http://localhost:3000",
      "https://*.vercel.app", 
      /\.tuubaa\.de$/, 
    ],
    methods: ["GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Accept"],
    credentials: true,
    maxAge: 86400,
  });

  const loadCommandsMetadata = (): Record<string, CommandMetadata> => {
    const commandsPath = path.join(__dirname, "..", "commands");
    const commands: Record<string, CommandMetadata> = {};

    try {
      const commandFiles = fs
        .readdirSync(commandsPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

      for (const file of commandFiles) {
        const commandModule = require(path.join(commandsPath, file)).default;

        let userLevel = "Everyone";
        switch (file) {
          case "ban.ts":
          case "timeout.ts":
          case "mod.ts":
          case "unban.ts":
          case "nuke.ts":
          case "title.ts":
          case "category.ts":
            userLevel = "Wachhunde/Mods";
            break;
          case "token.ts":
            userLevel = "Broadcaster only";
            break;
        }

        commands[commandModule.name] = {
          command: `!${commandModule.name}`,
          aliases: commandModule.aliases
            ? commandModule.aliases.map((a: string) => `!${a}`)
            : undefined,
          user: userLevel,
          description: commandModule.description,
        };
      }

      return commands;
    } catch (error) {
      console.error("Error loading commands metadata:", error);
      return {};
    }
  };

  const commandsMetadata = loadCommandsMetadata();

  app.get("/commands", async (request, reply) => {
    const sortedCommands = Object.values(commandsMetadata).sort((a, b) => {
      if (a.aliases?.length && !b.aliases?.length) return -1;
      if (!a.aliases?.length && b.aliases?.length) return 1;

      if (a.aliases?.length && b.aliases?.length) {
        return b.aliases.length - a.aliases.length;
      }

      return a.command.localeCompare(b.command);
    });

    return sortedCommands;
  });

  app.get("/commands/:commandName", async (request, reply) => {
    const { commandName } = request.params as { commandName: string };

    if (commandsMetadata[commandName]) {
      return commandsMetadata[commandName];
    }

    const nameWithoutPrefix = commandName.startsWith("!")
      ? commandName.slice(1)
      : commandName;
    if (commandsMetadata[nameWithoutPrefix]) {
      return commandsMetadata[nameWithoutPrefix];
    }

    for (const cmd of Object.values(commandsMetadata)) {
      if (
        cmd.aliases &&
        (cmd.aliases.includes(`!${nameWithoutPrefix}`) ||
          cmd.aliases.includes(commandName))
      ) {
        return cmd;
      }
    }

    reply.code(404);
    return { error: `Command ${commandName} not found` };
  });

  return app;
}

const startServer = async () => {
  const server = await buildServer();
  try {
    const PORT = process.env.PORT || 4000;
    await server.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`API server running on port ${PORT}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

export { buildServer };
