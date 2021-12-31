import { extractWordsFromUrl } from "lib/data";
import { insertSpaceBetweenWords } from "lib/middleware";
import { detectParticle, getCoda, getNucleus, getOnset } from "lib/word";

export default {
    words: {
        getOnset: getOnset,
        getNucleus: getNucleus,
        getCoda: getCoda,
        detectParticle: detectParticle
    },
    data: {
        extractWordsFromUrl: extractWordsFromUrl
    },
    middlewares: {
        insertSpaceBetweenWords: insertSpaceBetweenWords
    }
}
