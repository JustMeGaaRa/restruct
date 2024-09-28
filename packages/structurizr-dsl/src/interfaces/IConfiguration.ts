import { IStyles } from "./IStyles";

export interface IConfiguration {
    styles: IStyles;
    theme?: string;
    themes: string[];
}
