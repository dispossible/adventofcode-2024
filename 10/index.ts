import { readEntireFile } from "../utils/file";

(async () => {
    console.log(await partOne("./10/test.txt")); // 36
    console.log(await partOne("./10/input.txt"));
    console.log(await partTwo("./10/test.txt")); // 81
    console.log(await partTwo("./10/input.txt"));
})();

type Point = [number, number];

async function partOne(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const { trailheads, map } = parseMap(input);

    const trailCounts = new Map<string, number>();
    for (const trailhead of trailheads) {
        trailCounts.set(trailhead.join(), countFromTrailhead(trailhead, map).destinations);
    }

    return trailCounts.values().reduce((sum, count) => sum + count, 0);
}

function parseMap(input: string): { map: number[][]; trailheads: Point[] } {
    const trailheads: Point[] = [];

    const map: number[][] = input.split("\n").map((line, y) => {
        return line
            .trim()
            .split("")
            .map((char, x) => {
                const value = parseInt(char, 10);
                if (value === 0) {
                    trailheads.push([x, y]);
                }
                return value;
            });
    });

    return {
        trailheads,
        map,
    };
}

function countFromTrailhead(
    start: Point,
    map: number[][]
): {
    destinations: number;
    trails: number;
} {
    let validTrails = 0;
    const destinations = new Set<string>();

    const checkNextSteps = (position: Point) => {
        const height = getHeight(position, map);

        if (height === 9) {
            validTrails++;
            destinations.add(position.join());
            return;
        }

        const directions: Point[] = [
            [position[0], position[1] - 1],
            [position[0], position[1] + 1],
            [position[0] - 1, position[1]],
            [position[0] + 1, position[1]],
        ];

        for (const dir of directions) {
            const nextHeight = getHeight(dir, map);
            if (nextHeight === height + 1) {
                checkNextSteps(dir);
            }
        }
    };

    checkNextSteps(start);

    return {
        destinations: destinations.size,
        trails: validTrails,
    };
}

function getHeight(position: Point, map: number[][]): number {
    return map?.[position[1]]?.[position[0]] ?? 100;
}

async function partTwo(path: string): Promise<number> {
    const input = await readEntireFile(path);

    const { trailheads, map } = parseMap(input);

    const trailCounts = new Map<string, number>();
    for (const trailhead of trailheads) {
        trailCounts.set(trailhead.join(), countFromTrailhead(trailhead, map).trails);
    }

    return trailCounts.values().reduce((sum, count) => sum + count, 0);
}
