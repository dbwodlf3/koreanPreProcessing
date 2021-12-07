import path from "path";

const projectRoot = path.resolve(path.dirname(__dirname))

export default {
    projectRoot: projectRoot,
    scriptDir: path.resolve(path.join(projectRoot, "scripts")),
    srcDir: path.resolve(path.join(projectRoot, "src"))
}