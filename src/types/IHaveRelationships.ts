import { Result } from "ts-results";
import { ErrorResult, Relationship } from "../core";

export interface IHaveRelationships {
	getRelationships(): AsyncIterator<Result<Relationship, ErrorResult>>;

	addRelationship(type: string, target?: string): Promise<Result<Relationship, ErrorResult>>;

	removeRelationship(relationship: Relationship): Promise<Result<void, ErrorResult>>;
}
