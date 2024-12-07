import chalk from "chalk";
import { readEntireFile } from "../utils/file";

(async () => {
    console.log(await partOne("./06/test.txt")); // 41
    console.log(await partOne("./06/input.txt"));
    console.log(await partTwo("./06/test.txt")); // 6
    console.log(await partTwo("./06/test2.txt")); // 1
    console.log(await partTwo("./06/input.txt"));
})();

type Point = [number, number];

async function partOne(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const { startPoint, level } = parseLevel(input);

    const visited = getVisited(level, startPoint);

    return visited.size;
}

function parseLevel(input: string) {
    let startPoint: Point = [0, 0];

    const level = input.split("\n").map((line, y) => {
        const startChar = line.indexOf("^");
        if (startChar >= 0) {
            startPoint = [startChar, y];
            line.replace("^", ".");
        }
        return line.split("");
    });

    return {
        startPoint,
        level,
    };
}

function getAt(level: string[][], x: number, y: number): string {
    return level?.[y]?.[x] ?? null;
}

function getVisited(level: string[][], startPoint: Point): Set<string> {
    const seen = new Set<string>();

    let location: Point = [...startPoint];
    let dir = 0; // 0 - 3 :: Up Right Down Left

    while (inBounds(level, location)) {
        seen.add(location.join());

        const nextLocation: Point =
            dir === 0
                ? [location[0], location[1] - 1]
                : dir === 1
                ? [location[0] + 1, location[1]]
                : dir === 2
                ? [location[0], location[1] + 1]
                : // dir === 3
                  [location[0] - 1, location[1]];

        const nextChar = getAt(level, nextLocation[0], nextLocation[1]);

        if (nextChar === "#") {
            dir = (dir + 1) % 4;
            continue;
        }

        location = nextLocation;
    }

    return seen;
}

function inBounds(level: string[][], location: Point): boolean {
    const height = level.length;
    const width = level[0].length;
    return location[0] >= 0 && location[0] < width && location[1] >= 0 && location[1] < height;
}

async function partTwo(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const { startPoint, level } = parseLevel(input);

    const visited = await getLoops(level, startPoint);

    return visited.size;
}

async function getLoops(level: string[][], startPoint: Point): Promise<Set<string>> {
    const seenWithDir = new Set<string>();
    const seen = new Set<string>();
    const loopPositions = new Set<string>();

    let location: Point = [...startPoint];
    let dir = 0; // 0 - 3 :: Up Right Down Left

    while (inBounds(level, location)) {
        seen.add(location.join());
        seenWithDir.add(location.join() + `,${dir}`);
        // debug(level, startPoint.join(), seen, location.join() + `,${dir}`, undefined, loopPositions);
        // await wait(50);

        const nextDir = (dir + 1) % 4;
        const nextLocation: Point =
            dir === 0
                ? [location[0], location[1] - 1]
                : dir === 1
                ? [location[0] + 1, location[1]]
                : dir === 2
                ? [location[0], location[1] + 1]
                : // dir === 3
                  [location[0] - 1, location[1]];

        const nextChar = getAt(level, nextLocation[0], nextLocation[1]);

        if (nextChar === "#") {
            dir = nextDir;
            continue;
        }
        // Clear to walk forward

        if (!seen.has(nextLocation.join())) {
            // Possible loop, scout to the right
            let scoutLocation: Point = [...location];
            let scoutDir = nextDir;
            let scoutTurns = 0;
            const scoutSeen = new Set<string>();
            while (inBounds(level, scoutLocation)) {
                // debug(level, startPoint.join(), seen, location.join() + `,${dir}`, scoutLocation.join() + `,${scoutDir}`, loopPositions);
                // await wait(50);

                if (
                    seenWithDir.has(scoutLocation.join() + `,${scoutDir}`) ||
                    scoutSeen.has(scoutLocation.join() + `,${scoutDir}`)
                ) {
                    //Loop!
                    loopPositions.add(nextLocation.join());
                    // debug(level, startPoint.join(), seen, location.join() + `,${dir}`, scoutLocation.join() + `,${scoutDir}`, loopPositions);
                    // await wait(50);
                    break;
                }

                scoutSeen.add(scoutLocation.join() + `,${scoutDir}`);

                const nextScoutLocation: Point =
                    scoutDir === 0
                        ? [scoutLocation[0], scoutLocation[1] - 1]
                        : scoutDir === 1
                        ? [scoutLocation[0] + 1, scoutLocation[1]]
                        : scoutDir === 2
                        ? [scoutLocation[0], scoutLocation[1] + 1]
                        : // scoutDir === 3
                          [scoutLocation[0] - 1, scoutLocation[1]];

                const nextScoutChar = getAt(level, nextScoutLocation[0], nextScoutLocation[1]);

                if (nextScoutChar === "#" || nextScoutLocation.join() === nextLocation.join()) {
                    if (scoutTurns < 1000) {
                        scoutTurns++;
                        scoutDir = (scoutDir + 1) % 4;
                        continue;
                    }
                    break;
                }

                scoutLocation = nextScoutLocation;
            }
        }

        location = nextLocation;
    }

    debug(level, startPoint.join(), seenWithDir, undefined, undefined, loopPositions);
    return loopPositions;
}

function debug(
    level: string[][],
    start: string,
    seen: Set<string>,
    location?: string,
    location2?: string,
    blockers?: Set<string>
) {
    let output = "";

    for (const y in level) {
        const row = level[y];
        for (const x in row) {
            const loc = `${x},${y}`;

            if (loc === location || location?.startsWith(loc + ",")) {
                const cords = location.split(",");
                let sym = "^";
                if (cords.length === 3) {
                    if (cords[2] === "1") {
                        sym = ">";
                    }
                    if (cords[2] === "2") {
                        sym = "V";
                    }
                    if (cords[2] === "3") {
                        sym = "<";
                    }
                }
                output += chalk.green(sym);
                continue;
            }

            if (loc === location2 || location2?.startsWith(loc + ",")) {
                const cords = location2.split(",");
                let sym = "^";
                if (cords.length === 3) {
                    if (cords[2] === "1") {
                        sym = ">";
                    }
                    if (cords[2] === "2") {
                        sym = "V";
                    }
                    if (cords[2] === "3") {
                        sym = "<";
                    }
                }
                output += chalk.red(sym);
                continue;
            }

            if (start === loc) {
                output += chalk.bgMagenta("*");
                continue;
            }

            if (blockers?.has(loc)) {
                output += chalk.red("#");
                continue;
            }

            if (seen.has(loc)) {
                output += chalk.blue(row[x]);
                continue;
            }

            if (
                (seen.has(`${loc},0`) && seen.has(`${loc},1`)) ||
                (seen.has(`${loc},0`) && seen.has(`${loc},3`)) ||
                (seen.has(`${loc},2`) && seen.has(`${loc},1`)) ||
                (seen.has(`${loc},2`) && seen.has(`${loc},3`))
            ) {
                output += chalk.blue("+");
                continue;
            }

            if (seen.has(`${loc},0`) && seen.has(`${loc},2`)) {
                output += chalk.blue("|");
                continue;
            }

            if (seen.has(`${loc},1`) && seen.has(`${loc},3`)) {
                output += chalk.blue("-");
                continue;
            }

            if (seen.has(`${loc},0`)) {
                output += chalk.blue("^");
                continue;
            }
            if (seen.has(`${loc},1`)) {
                output += chalk.blue(">");
                continue;
            }
            if (seen.has(`${loc},2`)) {
                output += chalk.blue("V");
                continue;
            }
            if (seen.has(`${loc},3`)) {
                output += chalk.blue("<");
                continue;
            }

            output += chalk.white(row[x]);
        }
        output += "\n";
    }

    console.log(output);
}

async function wait(time: number) {
    return new Promise((r) => setTimeout(r, time));
}
