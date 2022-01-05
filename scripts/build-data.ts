import { spawn } from "child_process";
import common from "./common";

spawn(`cd ${common.projectRoot}/data && ts-node data.ts`, {
    shell: true, stdio: 'inherit'
});
