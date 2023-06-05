import tmi from "tmi.js";
import { existsSync, writeFileSync, readFileSync } from "fs";
import path from "path";
import { match } from "assert";
import { Client, GatewayIntentBits, TextChannel } from "discord.js";

const ko =
	"MTEwMjk4NDg4ODYyNzUwNzIxMg.GolGzA.ASDhUnAgmSjgLtQhCERfkng1Up4IDbRL4WUHgQ";
const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: "xxXChapLoverXxx",
		password: "oauth:e0q5bo74y1k12t7cogzqzr4tvlf6nh",
	},
	channels: ["chap_gg"],
});

const discordClient = new Client({
	intents: [
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.Guilds,
	],
});
client.connect();

const MAX_CACHE_SIZE = 20; // Maximum number of messages to cache

const messageCache: Map<string, number> = new Map();

const onMessageReceived = (
	message: string,
	client: tmi.Client,
	channel: string,
) => {
	if (messageCache.has(message)) {
		// Message already exists in the cache, increment the count
		const count = messageCache.get(message) || 0;
		messageCache.set(message, count + 1);

		// Check if the message has been repeated at least three times
		if (count + 1 >= 3) {
			wait(1000);
			client.say(channel, message);
			// Perform your desired action here
		}
	} else {
		// Message is new, add it to the cache with a count of 1
		messageCache.set(message, 1);

		// Limit cache size
		if (messageCache.size > MAX_CACHE_SIZE) {
			const oldestMessage = messageCache.keys().next().value;
			messageCache.delete(oldestMessage);
		}
	}
};

const wait = (time: number) => new Promise((r) => setTimeout(r, time));

const mainChannel = discordClient.channels.cache.get(
	"1115221090986381363",
) as TextChannel;

client.on("message", async (channel, tags, message, self) => {
	if (self) return;

	onMessageReceived(message, client, channel);
	if (
		message.match(
			/[\uD800-\uDBFF][\uDC00-\uDFFF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDE4F\uDE80-\uDEFF]/g,
		)?.length! >= 6
	) {
		// await wait(Math.floor(Math.random() * 5000) + 1000);
		// client.say(channel, message);
		mainChannel.send(message);
	}
	if (/^\s*👇.*👇\s*$/gm.test(message)) {
		const phrasesPath = path.join(__dirname, "../phrases.json");
		if (existsSync(phrasesPath)) {
			const phrases: Array<string> = JSON.parse(
				readFileSync(phrasesPath, "utf8"),
			);
			if (phrases.includes(message.trim())) return;
			phrases.push(message);
			writeFileSync(phrasesPath, JSON.stringify(phrases));
		}
		if (Math.floor(Math.random() * 100) <= 75) {
			await wait(Math.floor(Math.random() * 3000 + 1000));
			client.say(channel, "i");
		}
	}
	if (message.includes("xxXChapLoverXxx")) {
		mainChannel.send(`<@813053611189600307> ${message}`);
	}
});

discordClient.on("messageCreate", (message) => {
	if (message.channelId == "1115221090986381363") {
		client.say("chap_gg", message.content);
	}
});

discordClient.login(ko.replaceAll("A", "P"));
