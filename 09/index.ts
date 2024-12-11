import { readEntireFile } from "../utils/file";

(async () => {
    console.log(await partOne("./09/test.txt")); // 1928
    console.log(await partOne("./09/input.txt"));
    console.log(await partTwo("./09/test.txt")); // 2858
    console.log(await partTwo("./09/test2.txt")); // 132
    console.log(await partTwo("./09/test3.txt")); // 385
    console.log(await partTwo("./09/test4.txt")); // 1325
    console.log(await partTwo("./09/test5.txt")); // 2746
    console.log(await partTwo("./09/test6.txt")); // 88
    console.log(await partTwo("./09/test7.txt")); // 6204
    console.log(await partTwo("./09/input.txt"));
})();

async function partOne(path: string): Promise<number> {
    const input = await readEntireFile(path);
    const values = input.trim().split("");

    const fullData = expandData(values);
    const defragged = defragData(fullData);

    return checksum(defragged);
}

function expandData<T = null>(input: string[], nullValue: T = null): (number | T)[] {
    let isData = true;
    let data: (number | T)[] = [];
    for (const i in input) {
        const value = parseInt(input[i], 10);
        data.push(...new Array<number | T>(value).fill(isData ? parseInt(i, 10) / 2 : nullValue));
        isData = !isData;
    }

    return data;
}

function defragData(data: (number | null)[]): number[] {
    const defragedData: number[] = [];

    let cursorA = 0;
    let cursorB = data.length - 1;

    while (cursorB >= cursorA) {
        const a = data[cursorA];

        if (a === null) {
            let b = data[cursorB];
            while (b === null) {
                cursorB--;
                b = data[cursorB];
            }

            defragedData.push(b);
            cursorB--;
        } else {
            defragedData.push(a);
        }

        cursorA++;
    }

    return defragedData;
}

function checksum(values: unknown[]): number {
    return values.reduce<number>((sum, id, i) => {
        if (Number.isInteger(id)) {
            return sum + (id as number) * i;
        }
        return sum;
    }, 0);
}

async function partTwo(path: string): Promise<number> {
    const input = await readEntireFile(path);
    const values = input.trim().split("");

    const data = expandAndRelocateData(values);

    return checksum(data);
}

function expandAndRelocateData(values: string[]): (number | null)[] {
    let isData = true;
    let data: (number | null)[][] = [];
    for (const i in values) {
        const value = parseInt(values[i], 10);
        data.push(new Array<number | null>(value).fill(isData ? parseInt(i, 10) / 2 : null));
        isData = !isData;
    }
    debug(data);

    for (let id = data[data.length - 1][0]; id >= 0; id--) {
        let cursor = data.findIndex((fileData) => fileData.includes(id));
        const count = data[cursor].length;

        const switchIndex = data.findIndex(
            (fileData, idx) => fileData.includes(null) && idx < cursor && fileData.length >= count
        );

        if (switchIndex > -1) {
            // Have to split up a larger null set
            const lengthDiff = data[switchIndex].length - count;
            if (lengthDiff > 0) {
                data.splice(switchIndex + 1, 0, new Array(lengthDiff).fill(null));
                cursor += 1;
            }

            const fileData = data.splice(cursor, 1, new Array(count).fill(null));

            data.splice(switchIndex, 1, fileData[0]);
        }
    }

    debug(data);
    return data.flat();
}

function debug(data: (number | null)[][]) {
    console.log(
        data
            .flat()
            .map((v) => (v === null ? " " : v))
            .join(",")
    );
}
