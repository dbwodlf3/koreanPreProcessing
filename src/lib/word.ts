interface ParticleFilter {
    regex: string;
    condition?: "isCoda"|"isNotCoda";
    exception?: any;
}

type Word = string;
type Character = string;

export function detectParticle(word: Word){
    const subject_particle: ParticleFilter[] = [
        {
            regex:"은",
            condition:"isCoda"
        },
        {
            regex:"는",
            condition:"isNotCoda"
        },
        {
            regex:"이",
            condition:"isCoda"
        },
        {
            regex:"가",
            condition:"isNotCoda"
        }
    ];

    const objective_particle: ParticleFilter[] = [
        {
            regex:"을",
            condition:"isCoda"
        },
        {
            regex:"를",
            condition:"isNotCoda"
        },
        {
            regex:"으로",
            condition:"isCoda"
        },
        {
            regex:"로",
            condition:"isNotCoda"
        },
        {
            regex:"에",
            condition:"isCoda"
        },
        {
            regex:"에게"
        }
    ];

    const extra_particle: ParticleFilter[] = [
        {
            regex:"의",
        },
        {
            regex:"와",
            condition:"isNotCoda"
        },
        {
            regex:"과",
            condition:"isCoda"
        }
    ];

    for(const regex of [...subject_particle, ...objective_particle,
         ...extra_particle, ]) 
    {
        const match = word.match(regex.regex);
        if(match) {
            const postWord = word.substr(0, match.index);
            if(!postWord) continue;
            
            if(regex.condition == "isCoda") {
                const lastWord = postWord.substr(postWord.length-1, 
                    postWord.length
                );
                const coda = getCoda(lastWord);
                if(coda) {
                    return {word: postWord, particle: regex.regex, index: match.index};
                }
            }
            else if(regex.condition == "isNotCoda") {
                const lastWord = postWord.substr(postWord.length-1, 
                    postWord.length
                );
                const coda = getCoda(lastWord);
                if(!coda) {
                    return {word: postWord, particle: regex.regex, index: match.index};
                }
            }
            else {
                return {word: postWord, particle: regex.regex, index: match.index};
            }
        }
    }
}

export function detectConjunction(){

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
            words.push(result?.word+result.particle);
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
