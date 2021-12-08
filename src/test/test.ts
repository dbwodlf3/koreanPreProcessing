import chai from "chai";
import fs from "fs";
import { extractWord, getRecursiveHTML } from "lib/data";
import { detectParticle, spacingWords } from "lib/word";

describe("util", ()=>{
    it("Detect Particles", ()=>{
        const test_cases: any = [
            ["김치는", "김치"], ["하늘은", "하늘"], ["하늘이", "하늘"],
            ["김치가", "김치"], ["김치를","김치"], ["하늘을", "하늘"],
            ["땅으로", "땅"], ["김치로", "김치"], ["하늘에", "하늘"],
            ["하늘에게", "하늘"], ["김치의", "김치"], ["김치와", "김치"],
            ["하늘과", "하늘"], ["하늘", undefined]
        ];

        for(const test_case of test_cases) {
            const result = detectParticle(test_case[0]);
            if( result?.word != test_case[1]) {
                chai.expect.fail("Failed to detect particle.");
            }
        }

    })

    it("Detect Spacing", ()=>{
        const test_cases: any = [
            ["띄어쓰기를잘합시다", "띄어쓰기를 잘합시다"],
            ["띄어쓰기가잘안되요", "띄어쓰기가 잘안되요"],
            ["하늘이아름답다", "하늘이 아름답다"]
        ];

        for(const test_case of test_cases) {
            const result = spacingWords(test_case[0]);
            const fixed_text = result.join(" ");
            
            if(fixed_text != test_case[1]) {
                console.log(fixed_text, " != ",test_case[1]);
                chai.expect.fail("Failed to split spacing.");
            }
        }
    })

    it("Get Data", async function(){
        this.timeout(60000);

        const url = "www.naver.com"
        const htmls = await getRecursiveHTML("www.naver.com", 0);
    })

    it("Filtered Words", async function(){
        this.timeout(60000);

        const url = "naver.com"
        const words = await extractWord(url, 1);
        const filtered_word = [];

        for(const word of words) {
            const tmp = detectParticle(word)
            if(tmp) {
                filtered_word.push(tmp.word);
            }
            else {
                filtered_word.push(word);
            }
        }

        if(!fs.existsSync("test_result")){
            fs.mkdirSync("test_result");   
        }
        fs.writeFile("test_result/words.json", JSON.stringify(filtered_word), ()=>{});
    })
})