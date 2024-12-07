import { readFile } from "../utils/file";

(async () => {
    console.log(await partOne("./07/test.txt")); // 3749
    console.log(await partOne("./07/input.txt"));
    console.log(await partTwo("./07/test.txt")); // 11387
    console.log(await partTwo("./07/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    let sumOfValid = 0;
    const validSums = [];

    lineLoop: for (const line of input) {
        const [sumS, parts] = line.split(": ");

        const sum = parseInt(sumS, 10);
        const values = parts.split(" ").map((v) => parseInt(v, 10));

        const variations = generateCharPermutations(["+", "*"], values.length - 1);

        for (const ops of variations) {
            const testSum = values.reduce((sum, val, i) => {
                if (ops[i - 1] === "+") {
                    return sum + val;
                } else {
                    return sum * val;
                }
            });

            if (testSum === sum) {
                sumOfValid += sum;
                validSums.push(sum);
                continue lineLoop;
            }
        }
    }

    return sumOfValid;
}

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    let sumOfValid = 0;
    const validSums = [];

    lineLoop: for (const line of input) {
        const [sumS, parts] = line.split(": ");

        const sum = parseInt(sumS, 10);
        const values = parts.split(" ").map((v) => parseInt(v, 10));

        const variations = generateCharPermutations(["+", "*", "||"], values.length - 1);

        for (const ops of variations) {
            const testSum = values.reduce((sum, val, i) => {
                if (ops[i - 1] === "+") {
                    return sum + val;
                } else if (ops[i - 1] === "||") {
                    return parseInt(`${sum}${val}`, 10);
                } else {
                    return sum * val;
                }
            });

            if (testSum === sum) {
                sumOfValid += sum;
                validSums.push(sum);
                continue lineLoop;
            }
        }
    }

    return sumOfValid;
}

function generateCharPermutations<T>(list: T[], size = list.length): T[][] {
    if (size == 1) {
        return list.map((d) => [d]);
    }
    return list.flatMap((d) => generateCharPermutations(list, size - 1).map((item) => [d, ...item]));
}
