import { spawn } from "child_process"
import common from "./common";

spawn(`cd ${common.projectRoot} && npx mocha -r ts-node/register -r tsconfig-paths/register test/**/*.ts`, {
     shell: true, stdio: 'inherit'
});