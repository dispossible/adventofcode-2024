import { readFile, parseNumberList } from "../utils/file";

(async () => {
    console.log(await dayTwo("./02/test.txt")); // 2
    console.log(await dayTwo("./02/input.txt"));
    console.log(await dayTwoPartTwo("./02/test.txt")); // 4
    console.log(await dayTwoPartTwo("./02/test2.txt"));
    console.log(await dayTwoPartTwo("./02/input.txt"));
})();

async function dayTwo(path: string): Promise<number> {
    const input = await readFile(path);
    let safeCount = 0;

    for (const line of input) {
        const values = parseNumberList(line);

        if (isSafeSequence(values)) {
            safeCount++;
        }
    }

    return safeCount;
}

async function dayTwoPartTwo(path: string): Promise<number> {
    const input = await readFile(path);
    let unsafeCount = 0;

    for (const line of input) {
        const values = parseNumberList(line);

        const isAscending = values[0] - values[values.length - 1] < 0;
        let strike = false;

        for (let i = 1; i < values.length; i++) {
            const prevPrev = values[i - 2] ?? (isAscending ? values[i] - 1 : values[i] + 1);
            const prev = values[i - 1];
            const val = values[i];
            const next = values[i + 1] ?? (isAscending ? prev + 1 : prev - 1);

            if (isValidStep(prev, val, isAscending)) {
                continue;
            }

            if (!strike) {
                if (isValidStep(prev, next, isAscending)) {
                    strike = true;
                    values.splice(i, 1);
                    i--;
                    continue;
                }
                if (isValidStep(prevPrev, val, isAscending)) {
                    strike = true;
                    values.splice(i - 1, 1);
                    i--;
                    continue;
                }
            }

            unsafeCount++;
            break;
        }
    }

    return input.length - unsafeCount;
}

function isSafeSequence(values: number[]) {
    const isAscending = values[0] - values[values.length - 1] < 0;
    for (let i = 1; i < values.length; i++) {
        const prev = values[i - 1];
        const val = values[i];

        if (isValidStep(prev, val, isAscending)) {
            continue;
        }
        return false;
    }
    return true;
}

function isValidStep(a: number, b: number, isAscending: boolean) {
    const diff = a - b;
    if (isAscending && diff < 0 && diff >= -3) {
        return true;
    }
    if (!isAscending && diff > 0 && diff <= 3) {
        return true;
    }
    return false;
}
