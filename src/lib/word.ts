import HashMap from "hashmap";

interface ParticleFilter {
    regex: RegExp;
    condition?: "isCoda"|"isNotCoda";
    exception?: HashMap<string, number>;
}

type Word = string;
type Character = string;

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

export function detectConjunction(){
    const conjunctions = ["그리고", "또", "이렇게", "그런데", "그러나", "그래도",
        "그래서", "게다가", "따라서", "때문에", "아니면", "왜냐하면", "오히려"
    ];

    return {}
}

export function detectTypo(){
    return {}
}

export function spacingWords(text: string){
    const words = [];
    let condition = true;

    while(condition) {
        const result = detectParticle(text);
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

export function getOnset(character: Character){
    const uni_char = character.charCodeAt(0);
    if(uni_char>(588+0xAC00)) {
        return String.fromCharCode(0x1100 + Math.floor((uni_char - 0xAC00)/588));
    }
    else {
        return undefined;
    }
}

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
