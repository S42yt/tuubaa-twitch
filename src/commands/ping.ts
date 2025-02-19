import { ChatUserstate } from 'tmi.js';

export default {
  name: 'ping',
  description: 'Replies with pong!',
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    return 'Pong!';
  }
};