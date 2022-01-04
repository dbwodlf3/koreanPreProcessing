import { HTMLElement } from "node-html-parser";

export interface HTMLParserData {
    html: HTMLElement;
    charset?: string;
}