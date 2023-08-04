#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const showdown_1 = __importDefault(require("showdown"));
const commander_1 = require("commander");
dotenv.config();
const program = new commander_1.Command();
program.version('1.0.0').description('a great markdown-reader, to you know... read markdown').option('-p, --port [value]', 'choose which port the program should use, otherwise using port 8080').parse(process.argv);
const options = program.opts();
const app = (0, express_1.default)();
const PORT = parseInt(options.port) || 8080;
const css = `<style>@import url('https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'); * {font-family: 'Roboto', sans-serif}</style>`;
const markdownFiles = fs_1.default.readdirSync('./').filter(file => file.endsWith('.md'));
if (markdownFiles.length === 0) {
    console.log(`Couldn't find any markdown files`);
    process.exit();
}
const markdownConverter = new showdown_1.default.Converter();
app.get('/', (req, res) => {
    const header = '<h1>Available Files:</h1>';
    const list = `<ul>${markdownFiles.map(file => `<li><a href="./${file}">${file}</a></li>`)}</ul>`;
    const html = css + header + list;
    res.send(html);
});
app.get('/:file', (req, res) => {
    const file = req.params.file;
    if (!markdownFiles.includes(file)) {
        res.send('file does not exist');
        return;
    }
    const markdown = fs_1.default.readFileSync(file).toString();
    const html = css + markdownConverter.makeHtml(markdown);
    res.send(html);
});
app.listen(PORT, () => console.log(`See your markdowns at http://localhost:${PORT} 🤓`));
