import { ErrorResult, Package, Part } from "../../src/types";
import { Volume } from "memfs";
import { Err, Ok, Result } from "ts-results";
// eslint-disable-next-line ava/no-import-test-files
import { MockPart } from "./MockPart";

export class MockPackage extends Package {
	filesystem;
	mimes: Record<string, string> = {};

	constructor() {
		super();
		this.filesystem = Volume.fromJSON({});
	}

	protected deletePartCore(name: string): Promise<Result<void, ErrorResult>> {
		try {
			delete this.mimes[name];
			this.filesystem.unlinkSync(name);
		} catch (e) {
			return Promise.resolve(
				Err({
					Category: "PART",
					Code: "INTERNAL",
					Error: e
				} as ErrorResult)
			);
		}

		return Promise.resolve(Ok.EMPTY);
	}

	protected getPartCore(name: string): Promise<Result<Part, ErrorResult>> {
		return Promise.resolve(Ok<Part>(new MockPart(this, name, this.mimes[name])));
	}

	protected partExistsCore(name: string): Promise<Result<boolean, ErrorResult>> {
		return Promise.resolve(Ok(this.filesystem.existsSync(name)));
	}
}
