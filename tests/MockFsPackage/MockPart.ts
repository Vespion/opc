import { ErrorResult, Part } from "../../src/types";
import MIMEType from "whatwg-mimetype";
import { Ok, Result } from "ts-results";
import { Readable, Writable } from "stream";
import { MockPackage } from "./MockPackage";

export class MockPart implements Part {
	get mediaType(): MIMEType {
		return this._mediaType;
	}

	package: MockPackage;

	constructor(pkg: MockPackage, name: string, mime: string) {
		this.package = pkg;
		this._mediaType = new MIMEType(mime);
		this.name = name;
	}

	private _mediaType: MIMEType;
	readonly name: string;

	getReadable(): Promise<Result<Readable, ErrorResult>> {
		return Promise.resolve(Ok(this.package.filesystem.createReadStream(this.name)));
	}

	getWritable(): Promise<Result<Writable, ErrorResult>> {
		return Promise.resolve(Ok(this.package.filesystem.createWriteStream(this.name)));
	}

	setMediaType(type: MIMEType): Promise<Result<void, ErrorResult>> {
		this.package.mimes[this.name] = type.toString();
		this._mediaType = type;
		return Promise.resolve(Ok.EMPTY);
	}
}
