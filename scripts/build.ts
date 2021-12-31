import { spawn } from "child_process";
import common from "./common";

spawn(`cd ${common.projectRoot} && npx tsc --project ${common.projectRoot}/tsconfig.json`, {
    shell: true, stdio: 'inherit'
});
