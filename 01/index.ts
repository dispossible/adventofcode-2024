import { readFile } from "../utils/file";
import { countInstances } from "../utils/array";

(async () => {
    console.log(await dayOne("./01/test.txt")); // 11
    console.log(await dayOne("./01/input.txt"));
    console.log(await dayOnePartTwo("./01/test.txt")); // 31
    console.log(await dayOnePartTwo("./01/input.txt"));
})();

async function dayOne(path: string): Promise<number> {
    const input = await readFile(path);

    const listA = [];
    const listB = [];

    for (const line of input) {
        const numbers = line.split("   ");
        listA.push(parseInt(numbers[0].trim()));
        listB.push(parseInt(numbers[1].trim()));
    }

    listA.sort((a, b) => a - b);
    listB.sort((a, b) => a - b);

    let total = 0;

    for (const i in listA) {
        const diff = Math.abs(listA[i] - listB[i]);
        total += diff;
    }

    return total;
}

async function dayOnePartTwo(path: string): Promise<number> {
    const input = await readFile(path);

    const listA = [];
    const listB = [];

    for (const line of input) {
        const numbers = line.split("   ");
        listA.push(parseInt(numbers[0].trim()));
        listB.push(parseInt(numbers[1].trim()));
    }

    const counts = countInstances(listB);
    let total = 0;

    for (const a of listA) {
        const count = counts.get(a) || 0;
        total += a * count;
    }

    return total;
}
