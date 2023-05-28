import tmi from "tmi.js";
import { existsSync, writeFileSync, readFileSync } from "fs";
import path from "path";

const client = new tmi.Client({
	options: { debug: true },
	identity: {
		username: "xxXChapLoverXxx",
		password: "oauth:e0q5bo74y1k12t7cogzqzr4tvlf6nh",
	},
	channels: ["chap_gg"],
});

client.connect();

const wait = (time: number) => new Promise((r) => setTimeout(r, time));

client.on("message", async (channel, tags, message, self) => {
	if (self) return;

	if (/^\s*👇.*👇\s*$/gm.test(message)) {
		const phrasesPath = path.join(__dirname, "../phrases.json");
		if (existsSync(phrasesPath)) {
			await wait(Math.floor(Math.random() * 3000));
			const phrases = JSON.parse(readFileSync(phrasesPath, "utf8"));
			phrases.push(message);
			writeFileSync(phrasesPath, JSON.stringify(phrases));
		}
		client.say(channel, "i");
	}
});
