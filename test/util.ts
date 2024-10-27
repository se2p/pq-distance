import {Register} from "../src/Register";
import {PQGramProfile} from "../src/PQGramProfile";

export function newRegister(r: Register | number, ...contents: (string | null)[]): Register {
    return contents.reduce(
        (r, l) => l === null ? r.shift() : r.shift(l),
        typeof r === "number" ? new Register(r) : r);
}

export function newPQGramProfile(registerLength: number, contents: (string | null)[][]): PQGramProfile {
    if (contents.length === 0) {
        throw new Error("Empty contents");
    }

    const p = new PQGramProfile(registerLength);
    const registers = contents.map((c) => newRegister(c.length, ...c));
    registers.forEach((r) => p.add(r));
    return p;
}
