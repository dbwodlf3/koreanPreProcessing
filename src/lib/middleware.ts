import { detectParticle } from "./word";

export async function insertSpaceBetweenWords(text: string){
    const words = [];
    let condition = true;

    while(condition) {
        const result = await detectParticle(text);
        if(result) {
            let word = result?.word+result.particle;
            word = word.replace(/[^가-힣]*/g, "");
            words.push(word);
            text = text.substr(result.index!+1, text.length+1);
        }
        else {
            words.push(text);
            condition = false;
        }
    }

    return words;
}

export function detectTypo(){
    return {}
}

export function insertSpaceNouns(word: string){
    
}
