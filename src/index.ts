#! /usr/bin/env node
import express, { Application, Request, Response } from 'express';
import fs from 'fs';
import showdown from 'showdown';
import { Command } from 'commander';

const program = new Command()

program.version('1.0.0').description('a great markdown-reader, to you know... read markdown').option('-p, --port [value]', 'choose which port the program should use, otherwise using port 8080').parse(process.argv)

const options = program.opts();

const app: Application = express();

const PORT: number = parseInt(options.port) || 8080;
const htmlHead = `<title>markdown files</title><link rel="stylesheet"
      type="text/css"
      href="https://cdn.rawgit.com/FabrizioMusacchio/GitHub_Flavor_Markdown_CSS/master/GitHub%20Flavor.css"
/>`

const markdownFiles: string[] = fs.readdirSync('./').filter(file => file.endsWith('.md'))

if (markdownFiles.length === 0) {
	console.log(`Couldn't find any markdown files`)
	process.exit()
}

const markdownConverter = new showdown.Converter();

app.get('/', (req: Request, res: Response) => {
	const header = '<h1>Available Files:</h1>'
	const list = `<ul>${markdownFiles.map(file => `<li><a href="./${file}">${file}</a></li>`)}</ul>`
	const html = htmlHead + header + list;

	res.send(html)
})

app.get('/:file', (req: Request, res: Response) => {
	const file = req.params.file;
	if (!markdownFiles.includes(file)) {
		res.send('file does not exist');
		return;
	}
	const markdown = fs.readFileSync(file).toString();
	const html = htmlHead + markdownConverter.makeHtml(markdown);
	res.send(html);
})

app.listen(PORT, () => console.log(`See your markdowns at http://localhost:${PORT} 🤓`))
