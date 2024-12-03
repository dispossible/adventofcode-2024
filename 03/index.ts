import { readFile, parseNumberList, readEntireFile } from "../utils/file";

(async () => {
    console.log(await dayThree("./03/test.txt")); // 161
    console.log(await dayThree("./03/input.txt"));
    console.log(await dayThreePartTwo("./03/test2.txt")); // 48
    console.log(await dayThreePartTwo("./03/input.txt"));
})();

async function dayThree(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const muls = parseMuls(input);

    return muls.reduce((sum, [a, b]) => a * b + sum, 0);
}

async function dayThreePartTwo(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const muls = parseEnabledMuls(input);

    return muls.reduce((sum, [a, b]) => a * b + sum, 0);
}

function parseMuls(input: string): [number, number][] {
    const matcher = /mul\((\d{1,3}),(\d{1,3})\)/g;

    const matches = [...input.matchAll(matcher)];

    return matches.map((match) => [parseInt(match[1], 10), parseInt(match[2], 10)]);
}

function parseEnabledMuls(input: string): [number, number][] {
    const matcher = /((do)|(don't))\(\)/g;
    const matches = [...input.matchAll(matcher)];

    let validInput = input.substring(0, matches[0].index);

    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const nextMatch = matches[i + 1];

        if (match[1] === "do") {
            if (nextMatch) {
                validInput += input.substring(match.index, nextMatch.index);
            } else {
                validInput += input.substring(match.index);
            }
        }
    }

    return parseMuls(validInput);
}
