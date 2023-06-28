import { Readable } from "stream";
import { fc } from "@fast-check/jest";
import { isAbsolute } from "path";

export function streamToString(stream: Readable): Promise<string> {
	const chunks: Buffer[] = [];
	return new Promise((resolve, reject) => {
		stream.on("data", chunk => chunks.push(Buffer.from(chunk)));
		stream.on("error", err => reject(err));
		stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
	});
}

export const partName = fc
	.webPath()
	.filter(isAbsolute)
	.filter(s => !s.endsWith("/"))
	.filter(s => !s.endsWith("."));
