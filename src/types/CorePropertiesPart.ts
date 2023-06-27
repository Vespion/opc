import { Part } from "../core/Part";

import { CoreProperties } from "./CoreProperties";
import { Result } from "ts-results";
import { ErrorResult } from "./Errors";

export interface CorePropertiesPart extends CoreProperties, Part {
	save(): Promise<Result<void, ErrorResult>>;

	reload(): Promise<Result<void, ErrorResult>>;
}
