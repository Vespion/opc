import { LocalisedString } from "./LocalisedString";

export interface CoreProperties {
	category?: string;

	contentStatus?: string;

	created?: Date;

	creator?: string;

	description?: string;

	identifier?: string;

	keywords?: LocalisedString[];

	language?: string;

	lastModifiedBy?: string;

	lastPrinted?: Date;

	modified?: Date;

	revision?: string;

	subject?: string;

	title?: string;

	version?: string;
}
