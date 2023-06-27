import { testProp, fc } from "@fast-check/ava";
import { isAbsolute } from "path";
// eslint-disable-next-line ava/no-import-test-files
import { MockPackage } from "../MockFsPackage/MockPackage";

testProp(
	"unit/package/part_existence/does_not_find_non_existing_part",
	[
		fc
			.webPath()
			.filter(isAbsolute)
			.filter(s => !s.endsWith("/"))
			.filter(s => !s.endsWith("."))
	],
	async (t, path) => {
		const pkg = new MockPackage();

		const exists = (await pkg.partExists(path)).unwrap();

		t.false(exists);
	}
);

testProp(
	"unit/package/part_existence/finds_existing_part",
	[
		fc
			.webPath()
			.filter(isAbsolute)
			.filter(s => !s.endsWith("/"))
			.filter(s => !s.endsWith("."))
	],
	async (t, path) => {
		const pkg = new MockPackage();

		await pkg.filesystem.promises.writeFile(path, "test data");

		const exists = (await pkg.partExists(path)).unwrap();

		t.true(exists);
	}
);
