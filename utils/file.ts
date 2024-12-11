import * as fs from "fs/promises";

export async function readEntireFile(fileName: string): Promise<string> {
    const file = await fs.readFile(fileName, { encoding: "utf-8" });
    return file.trim().replaceAll("\r\n", "\n");
}

export async function readFile(fileName: string, separator = "\n"): Promise<string[]> {
    const input = await readEntireFile(fileName);
    return input.split(separator).reduce((lines, line) => {
        const lineT = line.trim();
        if (lineT) {
            lines.push(lineT);
        }
        return lines;
    }, []);
}

export async function readJsonFile<T>(fileName: string, fallback?: T): Promise<T> {
    try {
        const input = await readEntireFile(fileName);
        return JSON.parse(input);
    } catch (err) {
        if (fallback) return fallback;
        throw err;
    }
}

export async function writeFile(fileName: string, content: string) {
    return await fs.writeFile(fileName, content, { encoding: "utf-8" });
}

export async function writeJsonFile<T>(fileName: string, content: T) {
    return await writeFile(fileName, JSON.stringify(content));
}

export function parseNumberList(numberStr: string, separator = " "): number[] {
    return numberStr
        .split(separator)
        .map((s) => s.trim())
        .filter((s) => !!s)
        .map((s) => parseInt(s, 10));
}
