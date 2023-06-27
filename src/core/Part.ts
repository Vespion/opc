import { Result } from "ts-results";
import { ErrorResult } from "../types/Errors";
import { IHaveRelationships } from "../types/IHaveRelationships";
import MIMEType from "whatwg-mimetype";
import { Readable, Writable } from "stream";

export interface Part {
	readonly mediaType: MIMEType;

	readonly name: string;

	setMediaType(type: MIMEType): Promise<Result<void, ErrorResult>>;

	getReadable(): Promise<Result<Readable, ErrorResult>>;

	getWritable(): Promise<Result<Writable, ErrorResult>>;
}
