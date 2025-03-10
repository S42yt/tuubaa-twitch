import fs from "fs";
import path from "path";
import { Client, Events } from "tmi.js";

interface TwitchEvent {
  name: keyof Events;
  description: string;
  execute: (...args: any[]) => void | Promise<void>;
}

class EventHandler {
  private events: Map<string, TwitchEvent>;
  private client: Client;

  constructor(client: Client) {
    this.events = new Map();
    this.client = client;
    this.loadEvents();
  }

  private async loadEvents() {
    const eventsPath = path.join(__dirname, "..", "events");

    if (!fs.existsSync(eventsPath)) {
      fs.mkdirSync(eventsPath);
      console.log("Created events directory");
    }

    try {
      const eventFiles = fs
        .readdirSync(eventsPath)
        .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

      for (const file of eventFiles) {
        const event = (await import(path.join(eventsPath, file))).default;
        this.registerEvent(event);
        console.log(`Loaded event: ${event.name}`);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    }
  }

  public registerEvent(event: TwitchEvent) {
    if (!event.name || !event.execute) {
      console.error("Invalid event structure:", event);
      return;
    }

    this.events.set(event.name, event);
    this.client.on(event.name, (...args: any[]) => {
      try {
        event.execute(...args);
      } catch (error) {
        console.error(`Error executing event ${event.name}:`, error);
      }
    });
  }

  public triggerEvent(eventName: string, ...args: any[]) {
    const event = this.events.get(eventName);
    if (event) {
      try {
        event.execute(...args);
      } catch (error) {
        console.error(`Error manually triggering event ${eventName}:`, error);
      }
    } else {
      console.warn(`Event ${eventName} not found`);
    }
  }

  public getEvents(): Map<string, TwitchEvent> {
    return this.events;
  }
}

export default EventHandler;