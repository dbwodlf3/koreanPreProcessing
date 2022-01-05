import iconv from "iconv-lite";
import { http } from "follow-redirects"
import { parse, HTMLElement} from "node-html-parser"
import { HTMLParserData } from "./interface";

/**
 * Extract words from url.
*/
export  async function extractWordsFromUrl(originalUrl: string, depth: number=0, items= 100) { 
    const words: string[] = []
    const htmls = await extractWordsFromUrlRecursviely(originalUrl, depth, items);

    for(const html of htmls) {
        words.push(...getWords(html.innerText))
    }

    return words;
}

/**
 * Extract words from url Recursively
*/
async function extractWordsFromUrlRecursviely(originUrl: string, depth: number = 0, items= 100) {

    const htmls: HTMLElement[] = [];
    const urls: string[] = []
    let html;
    let html_binary;
    let html_string;

    try {
        html_binary = await getHTML(originUrl);
        html_string = html_binary.toString("utf-8");
        html = parse(html_string);
    }
    catch {
        return []
    }

    const meta_tags = html.getElementsByTagName("meta");
    const a_tags = html.getElementsByTagName("a");

    let charset: any = '';
    for(const meta_tag of meta_tags) {
        charset = meta_tag.getAttribute("charset") || '';
        if(charset) break;
        charset = meta_tag.getAttribute("content") || '';
        if(charset) charset = charset.match(/charset=[\s]*[a-zA-Z0-9-]*/i);
        if(charset) charset = charset[0].replace(/charset=/i, "");
        if(charset) break;
    }

    if(charset) { 
        html_string = iconv.decode(html_binary, charset);
        html = parse(html_string);
    }

    htmls.push(html);

    if(depth > 0) {
        for(const a_tag of a_tags) {
            let parsed_url = parseURL(a_tag.attributes['href']);
            let url='';

            if(parsed_url.protocol == "host", parsed_url.protocol == "host2") {
                url = originUrl + parsed_url.path
            }
            else if (parsed_url.protocol != "anchor") {
                url = parsed_url.hostname! + parsed_url.path
            }

            if(url && items > 0 ) { 
                items = items -1;
                urls.push(url) 
            };
        }

        for(const url of urls) {
            htmls.push(...await extractWordsFromUrlRecursviely(url, depth-1));
        }
    }

    return htmls;
}

function getHTML(url: string): Promise<Buffer> {
    const parsed_url = parseURL(url);

    const options = {
        hostname: parsed_url?.hostname,
        path: parsed_url?.path,
        headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36"}
    }

    return new Promise((resolve, reject)=>{
        const req = http.get(options,  (res)=>{
            let data: any = [];
            res.on("data", (chunk)=>{
                data.push(chunk);
            });
            res.on("end", ()=>{
                const buffer = Buffer.concat(data);
                resolve(buffer);
            });
            res.on("error", (err)=>{
                reject(err);
            });
        })
        .on("error", (err)=>{
            reject(err);
        });
    })
}

function parseURL (url:string){
    if(url[0] == "#") {
        return { protocol: "anchor"};
    }
    else if(url[0] == "/") {
        let path = url.substr(1, url.length);

        return { protocol: "host", path: path};
    }
    else if(url[0]+url[1] == "//") {
        let path = url.substr(2, url.length);

        return { protocol: "host2", path: path};
    }
    else {
        let context: string|string[] = url.split("://")
        let protocol = 'http';
        let hostname = '';
        let path = '/';
    
        if(context.length > 1) { 
            protocol = context[0];
            context = context[1];
        }
        else {
            context = context[0];
        }
    
        context = context.split("/");
    
        if(context.length > 1) {
            hostname = context[0];
            path = "/"+ context.slice(1, context.length).join("/");
        }
        else {
            hostname = context[0];
        }
    
        return { protocol: protocol, hostname: hostname, path: path }
    }
}

function getWords(text: string) {
    return text.trim()
            .replace(/\s+/g, " ")
            .split(" ")
            .filter(word=> word.match(/^[가-힣]+$/g));
}
