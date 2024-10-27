/**
 * Ensures the given numbers are positive integers. Throws an error otherwise.
 * @param ns The numbers to check.
 */
export function requirePositiveInteger(...ns: number[]): void {
    for (const n of ns) {
        if (!(Number.isInteger(n) && n > 0)) {
            throw new RangeError(`Must be positive integer: ${n}`);
        }
    }
}
