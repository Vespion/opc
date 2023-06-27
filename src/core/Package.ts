import { Err, Result } from "ts-results";
import { ErrorResult } from "../types";
import { Part } from "./Part";

export abstract class Package {
	protected abstract getPartCore(name: string): Promise<Result<Part, ErrorResult>>;

	protected abstract deletePartCore(name: string): Promise<Result<void, ErrorResult>>;

	protected abstract partExistsCore(name: string): Promise<Result<boolean, ErrorResult>>;

	public async getPart(name: string): Promise<Result<Part, ErrorResult>> {
		const existsResult = await this.partExistsCore(name);

		if (existsResult.err) {
			return Err(existsResult.val);
		} else {
			if (!existsResult.val) {
				return Err({
					Category: "PART",
					Code: "NOT_FOUND"
				} as ErrorResult);
			}
		}

		return await this.getPartCore(name);
	}

	public async deletePart(name: string): Promise<Result<void, ErrorResult>> {
		const existsResult = await this.partExistsCore(name);

		if (existsResult.err) {
			return Err(existsResult.val);
		} else {
			if (!existsResult.val) {
				return Err({
					Category: "PART",
					Code: "NOT_FOUND"
				} as ErrorResult);
			}
		}

		return await this.deletePartCore(name);
	}

	public partExists(name: string): Promise<Result<boolean, ErrorResult>> {
		return this.partExistsCore(name);
	}
}
