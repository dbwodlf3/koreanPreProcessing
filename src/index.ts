import { extractWordsFromUrl } from "./lib/data";
import { insertSpaceBetweenWords } from "./lib/middleware";
import { detectCompoundNoun3, detectCompoundNoun2, detectParticle, getCoda, getNucleus, getOnset } from "./lib/word";

export default {
    words: {
        getOnset: getOnset,
        getNucleus: getNucleus,
        getCoda: getCoda,
        detectParticle: detectParticle,
        detectCompoundNoun2: detectCompoundNoun2,
        detectCompoundNoun3: detectCompoundNoun3
    },
    data: {
        extractWordsFromUrl: extractWordsFromUrl
    },
    middlewares: {
        insertSpaceBetweenWords: insertSpaceBetweenWords
    }
}
