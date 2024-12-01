export function range(start: number, size: number): number[] {
    if (size <= 0) return [];
    return new Array(size).fill(0).map((_, i) => i + start);
}
export function sum(arr: (number | string)[]): number {
    return arr.reduce<number>((a, b) => {
        if (typeof a === "string") {
            a = parseInt(a, 10);
        }
        if (typeof b === "string") {
            b = parseInt(b, 10);
        }
        return a + b;
    }, 0);
}

export function intersection<T>(arr1: T[], arr2: T[]): T[] {
    return arr1.filter((val) => arr2.includes(val));
}

export function unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
}

export function countInstances<T>(arr: T[]): Map<T, number> {
    const counts = new Map<T, number>();
    for (const val of arr) {
        if (counts.has(val)) {
            counts.set(val, counts.get(val) + 1);
        } else {
            counts.set(val, 1);
        }
    }
    return counts;
}
