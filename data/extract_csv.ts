import fs from "fs";
import path from "path";
import common from "../scripts/common"

const filePath = "...";
const file = fs.createWriteStream(path.join(common.projectRoot, 'test_result/kr_data'));

fs.readFile(filePath, 'utf-8', (err, data)=>{
    data = data.replace(/-/g, '');
    const words = (data.match(/.*\n/g));
    let noun_words = [];

    if(!words) return;

    for(let word of words) {
        word = word.slice(0, -1);
        let [text, type] = word.split(',');
        if(type == "명사") {
            noun_words.push(`${text}\n`);
        }
    }

    noun_words = [...new Set(noun_words)];

    file.write(noun_words.join(''));
    file.end();
})
