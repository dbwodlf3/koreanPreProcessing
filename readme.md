# Readme
This is for Korean Preprocessing.

# Usage
## Library
```ts
import kpp from "kpp"

// ㅇㅏㄴ
console.log(
	kpp.words.getOnset("안"), 
	kpp.words.getNucleus("안"),
	kpp.words.getCoda("안")
);
```

## Middlewares
```ts
import kpp from "kpp"

// 띄어쓰기가 제대로 되지 않은 문장
console.log(kpp.middlewares.insertSpaceBetweenWords(
	"띄어쓰기가제대로되지않은문장"
	)
);
```

## Data
```ts
import kpp from "kpp"

// [ ... ]
console.log(kpp.data.extractWordsFromUrl("www.naver.com"))
```
