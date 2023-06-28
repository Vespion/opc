/* eslint-disable security/detect-object-injection */
import { describe, expect } from "@jest/globals";
import { testProp, fc } from "@fast-check/jest";
import { isAbsolute } from "path";
import { MockPackage } from "../utils/MockFsPackage/MockPackage";
import { partName, streamToString } from "../utils/Helpers";
import { ErrorResult } from "../../src";
import { Result } from "ts-results";

function generateErrorPropagationTest(
	section: "DELETE" | "EXIST" | "GET",
	partOperation: (pkg: MockPackage, path: string) => Promise<Result<unknown, ErrorResult>>
) {
	return testProp(
		"propagates errors from concrete implementations",
		[
			partName,
			fc.base64String({
				minLength: 64
			}),
			fc.asciiString(),
			fc.asciiString(),
			fc.asciiString(),
			fc.option(fc.asciiString())
		],
		async (path, data, resultMsg, errMsg, errName, errStack) => {
			const pkg = new MockPackage();

			pkg.mimes[path] = "application/octet-stream+text";
			await pkg.filesystem.promises.writeFile(path, data);

			const e = new Error(errMsg);
			e.name = errName;
			e.stack = errStack ?? undefined;

			pkg.configuredPartErrors[path] = {
				operation: [section],
				e: {
					Error: e,
					Category: "PART",
					Code: "INTERNAL",
					Message: resultMsg
				}
			};

			const res = await partOperation(pkg, path);

			expect(res.err).toBe(true);

			const error = res.val as ErrorResult;

			expect(error.Category).toBe("PART");
			expect(error.Code).toBe("INTERNAL");
			expect(error.Error?.message).toBe(errMsg);
			expect(error.Error?.stack).toBe(errStack ?? undefined);
			expect(error.Error?.name).toBe(errName);
			expect(error.Message).toBe(resultMsg);
		}
	);
}

function generateNonExistentPartTest(genFunc: (pkg: MockPackage, p: string) => Promise<Result<unknown, ErrorResult>>) {
	return testProp("returns error result for non-existent parts", [partName], async path => {
		const pkg = new MockPackage();

		const res = await genFunc(pkg, path);

		expect(res.err).toBe(true);

		const error = res.val as ErrorResult;

		expect(error.Category).toBe("PART");
		expect(error.Code).toBe("NOT_FOUND");
		expect(error.Error).toBeFalsy();
		expect(error.Message).toBeFalsy();
	});
}
describe("part existence", () => {
	generateErrorPropagationTest("EXIST", (pkg, p) => pkg.partExists(p));

	testProp(
		"finds existing part",
		[
			fc
				.webPath()
				.filter(isAbsolute)
				.filter(s => !s.endsWith("/"))
				.filter(s => !s.endsWith("."))
		],
		async path => {
			const pkg = new MockPackage();

			await pkg.filesystem.promises.writeFile(path, "test data");

			const exists = (await pkg.partExists(path)).unwrap();

			expect(exists).toBe(true);
		}
	);

	testProp(
		"does not find non existing part",
		[
			fc
				.webPath()
				.filter(isAbsolute)
				.filter(s => !s.endsWith("/"))
				.filter(s => !s.endsWith("."))
		],
		async path => {
			const pkg = new MockPackage();

			const exists = (await pkg.partExists(path)).unwrap();

			expect(exists).toBe(false);
		}
	);
});

describe("reading parts", () => {
	generateErrorPropagationTest("GET", (pkg, p) => pkg.getPart(p));
	generateErrorPropagationTest("EXIST", (pkg, p) => pkg.getPart(p));

	generateNonExistentPartTest(async (pkg, path) => await pkg.getPart(path));

	testProp(
		"reads part already in package",
		[
			partName,
			fc.base64String({
				minLength: 64
			})
		],
		async (path, data) => {
			const pkg = new MockPackage();

			pkg.mimes[path] = "application/octet-stream+text";
			await pkg.filesystem.promises.writeFile(path, data);

			const part = (await pkg.getPart(path)).unwrap();

			const partStream = (await part.getReadable()).unwrap();

			const partData = await streamToString(partStream);

			expect(partData).toBe(data);
		}
	);
});

describe("deleting parts", () => {
	generateErrorPropagationTest("DELETE", (pkg, p) => pkg.deletePart(p));
	generateErrorPropagationTest("EXIST", (pkg, p) => pkg.deletePart(p));

	generateNonExistentPartTest(async (pkg, path) => await pkg.deletePart(path));

	testProp("deletes part already in package", [partName], async path => {
		const pkg = new MockPackage();

		pkg.mimes[path] = "text/plain";
		await pkg.filesystem.promises.writeFile(path, "test data");

		(await pkg.deletePart(path)).unwrap();
	});

	testProp("deleted parts do not exist", [partName], async path => {
		const pkg = new MockPackage();

		pkg.mimes[path] = "text/plain";
		await pkg.filesystem.promises.writeFile(path, "test data");

		await pkg.deletePart(path);

		const exists = (await pkg.partExists(path)).unwrap();

		expect(exists).toBe(false);
	});
});
