import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import common from "./common";

const child = spawn(`cd ${common.projectRoot} && npx tsc --project ${common.projectRoot}/tsconfig.json`, {
    shell: true, stdio: 'inherit'
});

child.on('close', ()=>{
    !fs.existsSync(path.join(common.projectRoot, "dest/src/data")) &&
    fs.mkdirSync(path.join(common.projectRoot, "dest/src/data"))
;

    fs.copyFile(path.join(common.projectRoot, "src/data/database.sqlite3"),
        path.join(common.projectRoot, "dest/src/data/database.sqlite3"),
        ()=>{}
    );
});
