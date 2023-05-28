"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tmi_js_1 = __importDefault(require("tmi.js"));
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const client = new tmi_js_1.default.Client({
    options: { debug: true },
    identity: {
        username: "xxXChapLoverXxx",
        password: "oauth:e0q5bo74y1k12t7cogzqzr4tvlf6nh",
    },
    channels: ["chap_gg"],
});
client.connect();
const wait = (time) => { };
client.on("message", (channel, tags, message, self) => {
    if (self)
        return;
    if (/^\s*👇.*👇\s*$/gm.test(message)) {
        const phrasesPath = path_1.default.join(__dirname, "../phrases.json");
        if ((0, fs_1.existsSync)(phrasesPath)) {
            const phrases = JSON.parse((0, fs_1.readFileSync)(phrasesPath, "utf8"));
            phrases.push(message);
            (0, fs_1.writeFileSync)(phrasesPath, JSON.stringify(phrases));
        }
        client.say(channel, "i");
    }
});
