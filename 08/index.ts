import chalk from "chalk";
import { readEntireFile } from "../utils/file";

(async () => {
    console.log(await partOne("./08/test.txt")); // 14
    console.log(await partOne("./08/input.txt"));
    console.log(await partTwo("./08/test.txt")); // 34
    console.log(await partTwo("./08/input.txt"));
})();

type Point = [number, number];

async function partOne(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const { size, antennas } = parseAntennas(input);

    const antinodes = new Map<string, Point[]>();

    const chars = antennas.keys();
    for (const char of chars) {
        const charAntennas = antennas.get(char);
        const charAntinodes: Point[] = [];

        for (const sourceAnt of charAntennas) {
            for (const destAnt of charAntennas) {
                if (sourceAnt === destAnt) {
                    continue;
                }

                const offset: Point = [sourceAnt[0] - destAnt[0], sourceAnt[1] - destAnt[1]];
                const antinode: Point = [sourceAnt[0] + offset[0], sourceAnt[1] + offset[1]];

                //console.log(JSON.stringify({ char, sourceAnt, destAnt, antinode, oob: isOOB(size, antinode) }));
                if (isOOB(size, antinode)) {
                    continue;
                }

                charAntinodes.push(antinode);
            }
        }
        antinodes.set(char, charAntinodes);
    }

    const allAntinodes = new Set<string>();
    antinodes.forEach((nodes) => {
        nodes.forEach((node) => {
            allAntinodes.add(node.join(","));
        });
    });

    debug(size, antennas, antinodes);
    return allAntinodes.size;
}

async function partTwo(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const { size, antennas } = parseAntennas(input);

    const antinodes = new Map<string, Point[]>();

    const chars = antennas.keys();
    for (const char of chars) {
        const charAntennas = antennas.get(char);
        const charAntinodes: Point[] = [];

        if (charAntennas.length > 1) {
            charAntinodes.push(...charAntennas);
        }

        for (const sourceAnt of charAntennas) {
            for (const destAnt of charAntennas) {
                if (sourceAnt === destAnt) {
                    continue;
                }

                const offset: Point = [sourceAnt[0] - destAnt[0], sourceAnt[1] - destAnt[1]];

                let lastNode: Point = [sourceAnt[0], sourceAnt[1]];
                while (true) {
                    const antinode: Point = [lastNode[0] + offset[0], lastNode[1] + offset[1]];

                    if (isOOB(size, antinode)) {
                        break;
                    }

                    lastNode = antinode;
                    charAntinodes.push(antinode);
                }
            }
        }
        antinodes.set(char, charAntinodes);
    }

    const allAntinodes = new Set<string>();
    antinodes.forEach((nodes) => {
        nodes.forEach((node) => {
            allAntinodes.add(node.join(","));
        });
    });

    debug(size, antennas, antinodes);
    return allAntinodes.size;
}

function isOOB([width, height]: [number, number], [x, y]: Point): boolean {
    return x < 0 || x >= width || y < 0 || y >= height;
}

function parseAntennas(input: string): { size: [number, number]; antennas: Map<string, Point[]> } {
    const antennas = new Map<string, Point[]>();

    const rows = input.split("\n");
    let x: number, y: number;
    for (y = 0; y < rows.length; y++) {
        const row = rows[y];
        const chars = row.split("");

        for (x = 0; x < chars.length; x++) {
            const char = chars[x];
            if (char === ".") {
                continue;
            }

            if (antennas.has(char)) {
                const set = antennas.get(char);
                set.push([x, y]);
            } else {
                antennas.set(char, [[x, y]]);
            }
        }
    }

    return { size: [x, y], antennas };
}

function debug([width, height]: [number, number], antennas: Map<string, Point[]>, antinodes: Map<string, Point[]>) {
    const colors = [chalk.blue, chalk.green, chalk.magenta, chalk.red, chalk.yellow];
    const colorsBg = [chalk.bgBlue, chalk.bgGreen, chalk.bgMagenta, chalk.bgRed, chalk.bgYellow];

    const grid: string[][] = new Array(height).fill("").map(() => new Array(width).fill("."));

    let i = 0;
    for (const char of antinodes.keys()) {
        const locations = antinodes.get(char);
        for (const loc of locations) {
            if (grid[loc[1]][loc[0]].includes("#")) {
                grid[loc[1]][loc[0]] = chalk.bgGrey("#");
            } else {
                grid[loc[1]][loc[0]] = colorsBg[i % colors.length]("#");
            }
        }
        i++;
    }

    i = 0;
    for (const char of antennas.keys()) {
        const locations = antennas.get(char);
        for (const loc of locations) {
            if (grid[loc[1]][loc[0]].includes("#")) {
                grid[loc[1]][loc[0]] = colorsBg[i % colors.length](char);
            } else {
                grid[loc[1]][loc[0]] = colors[i % colors.length](char);
            }
        }
        i++;
    }

    console.log(grid.map((line) => line.join("")).join("\n"));
}
