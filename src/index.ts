import { YoutubeTranscript } from "youtube-transcript";

import { writeFile } from "fs/promises";
import * as yargs from "yargs";

interface Arguments {
	url: string;
}

const { url } = yargs.options({
	url: { type: "string", demandOption: true },
}).argv as Arguments;

(async function () {
	const videoId = getVideoId(url);

	const transcript = await YoutubeTranscript.fetchTranscript(url);
	const filename = `${videoId}.txt`;

	const transcriptText = transcript.map((t) => t.text).join("\n");

	await writeFile(filename, transcriptText);
	console.log(`Transcript saved to ${filename}`);
})();

function getVideoId(url: string): string {
	const regex = /(?:v=|\/)([0-9A-Za-z_-]{11}).*/;
	const match = url.match(regex);
	if (match) {
		return match[1];
	} else {
		throw new Error("Invalid YouTube video URL");
	}
}
