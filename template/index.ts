import { readFile } from "../utils/file";

(async () => {
    console.log(await partOne("./00/test.txt")); // 0
    console.log(await partOne("./00/input.txt"));
    console.log(await partTwo("./00/test.txt")); // 0
    console.log(await partTwo("./00/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readFile(path);

    return 0;
}

async function partTwo(path: string): Promise<number> {
    const input = await readFile(path);

    return 0;
}
