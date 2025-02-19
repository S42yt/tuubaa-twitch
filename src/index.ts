import { client, connectClient } from './client';
import CommandHandler from './core/commandHandler';

const commandHandler = new CommandHandler('!');

client.on('message', async (channel, tags, message, self) => {
  if (self) return;

  const response = await commandHandler.handleMessage(channel, tags, message);
  if (response) {
    client.say(channel, response);
  }
});

const startBot = async () => {
  try {
    await connectClient();
  } catch (error) {
    console.error('Failed to start bot:', error);
    process.exit(1);
  }
};

startBot();