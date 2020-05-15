import { createMochaRunner } from "./e2e.mocha";
import { resolve } from "path";

const testsRoot = resolve(__dirname, '..');
export const run = createMochaRunner(testsRoot);
