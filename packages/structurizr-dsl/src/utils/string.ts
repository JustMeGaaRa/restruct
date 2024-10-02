export class String {
    static equalsIgnoreCase = (a: string, b: string): boolean =>
        a.toLowerCase() === b.toLowerCase();
    static isNullOrEmpty = (value: string): boolean =>
        value === null || value === "";
    static isNullOrWhiteSpace = (value: string): boolean =>
        value === null || value.trim() === "";
}
