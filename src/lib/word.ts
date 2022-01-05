import HashMap from "hashmap";
import { db, getWord } from "./db";

interface ParticleFilter {
    regex: RegExp;
    condition?: "isCoda"|"isNotCoda";
    exception?: HashMap<string, number>;
}

type Word = string;
type Character = string;

/** Detect particles. '오늘은 보는사람이 많으니 다음에 합시다.'
 * -> [ '은', '이', '에']
*/
export function detectParticle(inputWord: Word){
    const subject_particle: ParticleFilter[] = [
        {
            regex:/은/,
            condition:"isCoda"
        },
        {
            regex:/는/,
            condition:"isNotCoda"
        },
        {
            regex:/이/,
            condition:"isCoda"
        },
        {
            regex:/가/,
            condition:"isNotCoda",
            exception: (()=>{
                const hashmap = new HashMap<string, number>();
                hashmap.set("추가", 1);
                hashmap.set("가기", 1);
                hashmap.set("바로가기", 1);
                return hashmap;
            })()
        }
    ];

    const objective_particle: ParticleFilter[] = [
        {
            regex:/을/,
            condition:"isCoda"
        },
        {
            regex:/를/,
            condition:"isNotCoda"
        },
        {
            regex:/으로/,
            condition:"isCoda"
        },
        {
            regex:/로/,
            condition:"isNotCoda",
            exception: (()=>{
                const hashmap = new HashMap<string, number>();
                hashmap.set("프로", 1);
                hashmap.set("바로", 1);
                hashmap.set("바로가기", 1);
                hashmap.set("크로스", 1);
                return hashmap;
            })()
        },
        {
            regex:/에/,
            condition:"isCoda",
            exception: (()=>{
                const hashmap = new HashMap<string, number>();
                hashmap.set("에게", 1);
                return hashmap;
            })()
        },
        {
            regex:/에게/
        }
    ];

    const extra_particle: ParticleFilter[] = [
        {
            regex:/의/,
        },
        {
            regex:/와/,
            condition:"isNotCoda"
        },
        {
            regex:/과/,
            condition:"isCoda"
        }
    ];

    for(const regex of [...subject_particle, ...objective_particle,
         ...extra_particle, ]) 
    {
        const match = inputWord.match(regex.regex);

        if(match) {
            const preWord = inputWord.substr(0, match.index);
            const postWord = inputWord.substr(match.index!+1, inputWord.length);

            if(!preWord) continue;
            
            let word = (preWord + regex.regex).replace(/[^가-힣]*/g, "");
            let word2 = (preWord + regex.regex + postWord[0]).replace(/[^가-힣]*/g, "");
            let word3 = (preWord + regex.regex + postWord[0] + postWord[1]).replace(/[^가-힣]*/g, "");
            let word4 = (regex.regex + postWord[0]).replace(/[^가-힣]*/g, "");
    
            if(regex.exception?.has(word4)) continue;
            if(regex.exception?.has(word3)) continue;
            if(regex.exception?.has(word2)) continue;
            if(regex.exception?.has(word)) continue;

            // Check Condition
            if(regex.condition == "isCoda") {
                const lastWord = preWord.substr(preWord.length-1, 
                    preWord.length
                );
                const coda = getCoda(lastWord);
                if(coda) {
                    return {word: preWord, particle: regex.regex, index: match.index};
                }

            }
            else if(regex.condition == "isNotCoda") {
                const lastWord = preWord.substr(preWord.length-1, 
                    preWord.length
                );
                const coda = getCoda(lastWord);
                if(!coda) {
                    return {word: preWord, particle: regex.regex, index: match.index};
                }
            }
            else {
                return {word: preWord, particle: regex.regex, index: match.index};
            }
        }
    }
}

/** Detect conjunction. '음식의 모양이 예쁘지는 않았다. 그래도 맛은 있었다.'
 *  -> '그래도'
 */
export function detectConjunction(){
    const conjunctions = ["그리고", "또", "이렇게", "그런데", "그러나", "그래도",
        "그래서", "게다가", "따라서", "때문에", "아니면", "왜냐하면", "오히려"
    ];

    return {}
}

/** Detect compound noun. '마른풀' -> ['마른', '풀']*/
export async function detectCompoundNoun2(inputWord: Word): Promise<string[]|undefined>{
    if(detectParticle(inputWord)) return;
    if(inputWord.match(/\s/)) return;

    for(let i =0; i < inputWord.length; i++) {
        let pre_text = inputWord.substring(0, i);
        let post_text = inputWord.substring(i);
        const pre_word = await getWord(pre_text, "명사");
        const post_word = await getWord(post_text, "명사");

        if( pre_word.length && post_word.length) {
            return [pre_text, post_text];
        }
    }
    return;
}

export async function detectCompoundNoun3(inputWord: Word): Promise<string[]|undefined>{
    if(detectParticle(inputWord)) return;
    if(inputWord.match(/\s/)) return;

    let pre_text = '', post_text = '', last_text = '';

    for(let i = 0; i < inputWord.length; i++) {
        for(let j = i+1; j < inputWord.length; j++) {
            pre_text = inputWord.substring(0, i);
            post_text = inputWord.substring(i, j);
            last_text = inputWord.substring(j);

            const pre_word = await getWord(pre_text, "명사");
            const post_word = await getWord(post_text, "명사");
            const last_word = await getWord(last_text, "명사");
    
    
            if( pre_word.length && post_word.length && last_word.length) {
                return [pre_text, post_text, last_text];
            }
        }
    }
    return;
}

/** Get a onset from korean. '집'->'ㅈ' */
export function getOnset(character: Character){
    const uni_char = character.charCodeAt(0);
    if(uni_char>(588+0xAC00)) {
        return String.fromCharCode(0x1100 + Math.floor((uni_char - 0xAC00)/588));
    }
    else {
        return undefined;
    }
}

/** Get a nucleus from korean. '집'->'ㅣ' */
export function getNucleus(character: Character){
    const uni_char = character.charCodeAt(0);
    const no_oneset = (uni_char - 0xAC00) % 588;
    const nucleus_order = no_oneset/28;
    if(uni_char>(588+0xAC00)) {
        return String.fromCharCode(0x1161 + nucleus_order);
    }
    else {
        return undefined;
    }
}

/** Get a nucleus from korean. '집'->'ㅂ' */
export function getCoda(character: Character){
    const uni_char = character.charCodeAt(0);
    const coda_order = (uni_char-0xAC00)%28;
    if(uni_char>=0xAC00 && uni_char<=0xD7A3 && coda_order>0) {
        return String.fromCharCode(0x11A7+coda_order);
    }
    else {
        return undefined;
    }
}
