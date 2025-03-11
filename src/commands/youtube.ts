import { ChatUserstate } from "tmi.js";
import dotenv from "dotenv";

dotenv.config();

const YOUTUBE_LINK = "https://www.youtube.com/@tuubaa";

export default {
  name: "youtube",
  description: "Zeigt den Link zu dem YouTube Kanal",
  aliases: ["yt", "videos"],
  execute: (channel: string, tags: ChatUserstate, args: string[]) => {
    const username = tags["display-name"] || tags.username;

    const channelName = channel.replace("#", "");

    let response = `Hey ${username}! Du willst mehr von tuubaa sehen? schau gerne auf ihrem YT vorbei: ${YOUTUBE_LINK}`;

    return response;
  },
};
