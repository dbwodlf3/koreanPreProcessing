import path from "path";
import sqlite3 from "sqlite3";

const sqlite = sqlite3.verbose();
export const db = new sqlite.Database(path.resolve(path.join(__dirname,"../data/database.sqlite3")), (err)=>{
});

// console.log(db);

export function getWord(word: string, type: string): Promise<any[]>{
    return new Promise((resolve, reject)=>{
        db.serialize(()=>{
            db.all(`SELECT * FROM Word WHERE word=(?) AND type=(?)`, [word, type], (err, rows)=>{
                resolve(rows);
            });
        })
    })
}
 