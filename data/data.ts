import fs from "fs";
import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();
const db = new sqlite.Database("database.sqlite3");

db.serialize(()=>{
    db.run(`
        CREATE TABLE Word(
            word TEXT,
            type TEXT
        );
        CREATE INDEX wordIndex ON Word (word);
        CREATE INDEX wordIndex ON Word (type);
    `);

    const data = fs.readFileSync("../test_result/kr_data", "utf-8");
    let words:any = data.match(/.*\n/g);
    if(!words) throw new Error("Doesn't exist words");
    words = words.map((x:string)=>{return x.replace('\n', '')})

    db.exec(`BEGIN TRANSACTION`);
    for(const word of words) {
        db.run(`INSERT INTO Word(word, type) VALUES(?, "명사")`, word);
    }
    db.exec(`END TRANSACTION`);
})
