import { client, connectClient } from "./client";
import CommandHandler from "./core/commandHandler";
import { buildServer } from "./api/server";

const commandHandler = new CommandHandler("!");

client.on("message", async (channel, tags, message, self) => {
  if (self) return;

  const response = await commandHandler.handleMessage(channel, tags, message);
  if (response) {
    client.say(channel, response);
  }
});

const startBot = async () => {
  try {
    await connectClient();
    console.log(`\x1b[35m
    ╔════════════════════════════╗
    ║       TUUBAAS NAVI         ║
    ╚════════════════════════════╝

  Version 1.0.0
    \x1b[0m`);

    const server = await buildServer();
    const PORT = process.env.PORT || 3000;
    await server.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log("\x1b[36m API server is running on port " + PORT + " \x1b[0m");
  } catch (error) {
    console.error("Bot konnte nicht gestartet werden:", error);
    process.exit(1);
  }
};

startBot();
