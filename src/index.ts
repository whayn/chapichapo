import tmi from "tmi.js";
import { existsSync, writeFileSync, readFileSync } from "fs";
import path from "path";

const client = new tmi.Client({
	options: { debug: false },
	identity: {
		username: "xxXChapLoverXxx",
		password: "oauth:e0q5bo74y1k12t7cogzqzr4tvlf6nh",
	},
	channels: ["chap_gg"],
});

client.connect();

const MAX_CACHE_SIZE = 100; // Maximum number of messages to cache

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

client.on("message", async (channel, tags, message, self) => {
	console.log(`<${tags["display-name"]}>: ${message}`);

	if (self) return;

	onMessageReceived(message, client, channel);

	if (/^\s*👇.*👇\s*$/gm.test(message)) {
		const phrasesPath = path.join(__dirname, "../phrases.json");
		if (existsSync(phrasesPath)) {
			await wait(Math.floor(Math.random() * 3000 + 1000));
			const phrases: Array<string> = JSON.parse(
				readFileSync(phrasesPath, "utf8"),
			);
			if (phrases.includes(message.trim())) return;
			phrases.push(message);
			writeFileSync(phrasesPath, JSON.stringify(phrases));
		}
		if (Math.floor(Math.random() * 100) <= 75) {
			client.say(channel, "i");
		}
	}
	if (/(?:(?:[\wÀ-ÿ'"-,;]+\s*)+(?:(?:\p{Emoji}\s*){2,})){2,}/gu.test(message)) {
		wait(Math.floor(Math.random() * 5000) + 1000);
		client.say(channel, message);
	}
});
