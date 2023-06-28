/* eslint-disable security/detect-object-injection */
import { ErrorResult, Package, Part } from "../../../src";
import { Volume } from "memfs";
import { Err, Ok, Result } from "ts-results";
// eslint-disable-next-line ava/no-import-test-files
import { MockPart } from "./MockPart";

export class MockPackage extends Package {
	filesystem;
	mimes: Record<string, string> = {};

	configuredPartErrors: Record<
		string,
		{
			e: ErrorResult;
			operation: ("DELETE" | "EXIST" | "GET")[];
		}
	> = {};

	constructor() {
		super();
		this.filesystem = Volume.fromJSON({});
	}

	protected deletePartCore(name: string): Promise<Result<void, ErrorResult>> {
		if (this.configuredPartErrors[name]?.operation.includes("DELETE")) {
			return Promise.resolve(Err(this.configuredPartErrors[name].e));
		}

		delete this.mimes[name];
		this.filesystem.unlinkSync(name);

		return Promise.resolve(Ok.EMPTY);
	}

	protected getPartCore(name: string): Promise<Result<Part, ErrorResult>> {
		if (this.configuredPartErrors[name]?.operation.includes("GET")) {
			return Promise.resolve(Err(this.configuredPartErrors[name].e));
		}

		return Promise.resolve(Ok<Part>(new MockPart(this, name, this.mimes[name])));
	}

	protected partExistsCore(name: string): Promise<Result<boolean, ErrorResult>> {
		if (this.configuredPartErrors[name]?.operation.includes("EXIST")) {
			return Promise.resolve(Err(this.configuredPartErrors[name].e));
		}
		return Promise.resolve(Ok(this.filesystem.existsSync(name)));
	}
}
