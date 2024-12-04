import { readEntireFile } from "../utils/file";

(async () => {
    console.log(await partOne("./04/test.txt")); // 18
    console.log(await partOne("./04/input.txt"));
    console.log(await partTwo("./04/test2.txt")); // 9
    console.log(await partTwo("./04/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const grid = input.split("\n").map((line) => line.split(""));

    let count = 0;

    function getCord(x: number, y: number) {
        return grid?.[x]?.[y] ?? ".";
    }

    for (const Y in grid) {
        const y = parseInt(Y, 10);
        for (const X in grid[y]) {
            const x = parseInt(X, 10);

            const char = getCord(y, x);

            if (char !== "X") {
                continue;
            }

            const right = getCord(y, x) + getCord(y, x + 1) + getCord(y, x + 2) + getCord(y, x + 3);
            if (right === "XMAS") count++;

            const rightDown = getCord(y, x) + getCord(y + 1, x + 1) + getCord(y + 2, x + 2) + getCord(y + 3, x + 3);
            if (rightDown === "XMAS") count++;

            const down = getCord(y, x) + getCord(y + 1, x) + getCord(y + 2, x) + getCord(y + 3, x);
            if (down === "XMAS") count++;

            const leftDown = getCord(y, x) + getCord(y + 1, x - 1) + getCord(y + 2, x - 2) + getCord(y + 3, x - 3);
            if (leftDown === "XMAS") count++;

            const left = getCord(y, x) + getCord(y, x - 1) + getCord(y, x - 2) + getCord(y, x - 3);
            if (left === "XMAS") count++;

            const leftUp = getCord(y, x) + getCord(y - 1, x - 1) + getCord(y - 2, x - 2) + getCord(y - 3, x - 3);
            if (leftUp === "XMAS") count++;

            const up = getCord(y, x) + getCord(y - 1, x) + getCord(y - 2, x) + getCord(y - 3, x);
            if (up === "XMAS") count++;

            const rightUp = getCord(y, x) + getCord(y - 1, x + 1) + getCord(y - 2, x + 2) + getCord(y - 3, x + 3);
            if (rightUp === "XMAS") count++;
        }
    }

    return count;
}

async function partTwo(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const grid = input.split("\n").map((line) => line.split(""));

    let count = 0;

    function getCord(x: number, y: number) {
        return grid?.[x]?.[y] ?? ".";
    }

    for (const Y in grid) {
        const y = parseInt(Y, 10);
        for (const X in grid[y]) {
            const x = parseInt(X, 10);

            const char = getCord(y, x);

            if (char !== "A") {
                continue;
            }

            const cross = getCord(y - 1, x - 1) + getCord(y - 1, x + 1) + getCord(y + 1, x - 1) + getCord(y + 1, x + 1);

            // M . M
            // . A .
            // S . S
            if (cross === "MMSS") count++;

            // M . S
            // . A .
            // M . S
            if (cross === "MSMS") count++;

            // S . S
            // . A .
            // M . M
            if (cross === "SSMM") count++;

            // S . M
            // . A .
            // S . M
            if (cross === "SMSM") count++;
        }
    }

    return count;
}
