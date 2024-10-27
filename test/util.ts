import {Register} from "../src/Register";

export function newRegister(r: Register | number, ...contents: (string | null)[]): Register {
    return contents.reduce(
        (r, l) => l === null ? r.shift() : r.shift(l),
        typeof r === "number" ? new Register(r) : r);
}
