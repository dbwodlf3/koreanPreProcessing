import chai from "chai";
import kpp from "../";
import { detectCompoundNoun2, detectCompoundNoun3} from "../src/lib/word";

import {getWord} from "../src/lib/db"

describe("util", ()=>{
    it("Detect Particles", async ()=>{
        const test_cases: any = [
            ["김치는", "김치"], ["하늘은", "하늘"], ["하늘이", "하늘"],
            ["김치가", "김치"], ["김치를","김치"], ["하늘을", "하늘"],
            ["땅으로", "땅"], ["김치로", "김치"], ["하늘에", "하늘"],
            ["하늘에게", "하늘"], ["김치의", "김치"], ["김치와", "김치"],
            ["하늘과", "하늘"], ["하늘", undefined]
        ];

        for(const test_case of test_cases) {
            const result = await kpp.words.detectParticle(test_case[0]);
            if( result?.word != test_case[1]) {
                chai.expect.fail("Failed to detect particle.");
            }
        }

    })

    it("Detect Compound Noun", async ()=>{
        const test_cases: any = [
            ["복합명사", ["복합", "명사"]], ["볶음김치", ["볶음", "김치"]], 
            ["강력살충제", ["강력", "살충제"]], ["전문투자", ["전문", "투자"]],
            ["초보기사", ["초보", "기사"]], ["개미떼", ["개미", "떼"]],
            ["띄어쓰기잘못", ["띄어쓰기", "잘못"]], ["띄어쓰기가잘못됨", undefined], 
            ["해와달", undefined], ["아마추어", undefined]
        ];

        for(const test_case of test_cases) {
            const result = await kpp.words.detectCompoundNoun2(test_case[0]);

            if( JSON.stringify(result) != JSON.stringify(test_case[1])) {
                chai.expect.fail("Failed to detect compound noun.");
            }
        }
    })

//     it("Detect Spacing", ()=>{
//         const test_cases: any = [
//             ["띄어쓰기를잘합시다", "띄어쓰기를 잘합시다"],
//             ["띄어쓰기가잘안되요", "띄어쓰기가 잘안되요"],
//             ["하늘이아름답다", "하늘이 아름답다"]
//         ];

//         for(const test_case of test_cases) {
//             const result = kpp.middlewares.insertSpaceBetweenWords(test_case[0]);
//             const fixed_text = result.join(" ");
            
//             if(fixed_text != test_case[1]) {
//                 console.log(fixed_text, " != ",test_case[1]);
//                 chai.expect.fail("Failed to split spacing.");
//             }
//         }
//     })

    it("Get Data", async function(){
        this.timeout(60000);

        const url = "www.naver.com"
        const htmls = await kpp.data.extractWordsFromUrl("www.naver.com", 0);
    })

    it("Filtered Words", async function(){
        this.timeout(3000);

        // const url = "naver.com"
        // const words = await kpp.data.extractWordsFromUrl(url, 1);
        // const filtered_word = [];

        // for(const word of words) {
        //     const tmp = kpp.words.detectParticle(word)
        //     if(tmp) {
        //         filtered_word.push(tmp.word);
        //     }
        //     else {
        //         filtered_word.push(word);
        //     }
        // }

        // if(!fs.existsSync("test_result")){
            // fs.mkdirSync("test_result");   
        // }
        // fs.writeFile("test_result/words.json", JSON.stringify(filtered_word), ()=>{});
    })

})