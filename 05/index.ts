import { readEntireFile } from "../utils/file";

(async () => {
    console.log(await partOne("./05/test.txt")); // 143
    console.log(await partOne("./05/input.txt"));
    // console.log(await partTwo("./05/test.txt")); // 123
    // console.log(await partTwo("./05/input.txt"));
})();

async function partOne(path: string): Promise<number[]> {
    const input = await readEntireFile(path);

    const [rules, updateSets] = input.split("\n\n");

    const rulePairs = parseRules(rules);
    const updateRows = updateSets.split("\n");

    const validPageSets: PageInfo[] = [];
    const invalidPageSets: PageInfo[] = [];

    for (const row of updateRows) {
        const pages = row.trim().split(",");

        const pageInfo = getPageInfo(pages, rulePairs);

        if (pageInfo.isValid) {
            validPageSets.push(pageInfo);
        } else {
            invalidPageSets.push(pageInfo);
        }
    }

    return [
        validPageSets.reduce((sum, pageInfo) => {
            return sum + getMiddlePage(pageInfo.pages);
        }, 0),
        invalidPageSets.reduce((sum, pageInfo) => {
            return sum + getMiddlePage(pageInfo.pages);
        }, 0),
    ];
}

// async function partTwo(path: string): Promise<number> {
//     const input = await readEntireFile(path);

//     return 0;
// }

function getMiddlePage(pages: string[]): number {
    return parseInt(pages[Math.floor(pages.length / 2)], 10);
}

function parseRules(rules: string): [string, string][] {
    return rules.split("\n").map((line) => line.trim().split("|") as [string, string]);
}

type PageInfo = {
    pages: string[];
    isValid: boolean;
};

function getPageInfo(pages: string[], rules: [string, string][]): PageInfo {
    let isValid = true;

    const validRules: [string, string][] = [];

    for (const rule of rules) {
        const a = pages.indexOf(rule[0]);
        const b = pages.indexOf(rule[1]);

        // Does this rule matter?
        if (a !== -1 && b !== -1) {
            validRules.push(rule);
            isValid = isValid && a < b;
        }
    }

    if (!isValid) {
        let completedLoop = false;
        do {
            completedLoop = true;
            for (let i = 0; i < validRules.length; i++) {
                const rule = validRules[i];

                const a = pages.indexOf(rule[0]);
                const b = pages.indexOf(rule[1]);

                if (a > b) {
                    pages[a] = rule[1];
                    pages[b] = rule[0];
                    completedLoop = false;
                }
            }
        } while (!completedLoop);
    }

    return {
        pages,
        isValid,
    };
}
