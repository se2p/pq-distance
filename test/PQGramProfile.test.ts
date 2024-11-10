import {PQGramProfile} from "../src/PQGramProfile";
import {Register} from "../src/Register";
import {newPQGramProfile, node, tree} from "./util";

describe("A pq-gram profile", () => {
    describe("that is newly constructed", () => {
        it("should initially be empty", () => {
            expect(new PQGramProfile(5)).toHaveLength(0);
        });

        it("should have the specified register length", () => {
            const l = 42;
            const p = new PQGramProfile(l);
            expect(p.registerLength).toBe(l);
        });

        it.each([0, -1, 1.1234])("should throw given an invalid length of %s", (i) => {
            expect(() => new PQGramProfile(i)).toThrow();
        });
    });

    describe("to which a register is added", () => {
        it("should increase its length by 1", () => {
            const registerLength = 1;
            const p = new PQGramProfile(registerLength);
            p.add(Register.ofLength(registerLength));
            expect(p).toHaveLength(1);
        });

        it("should increase its length even if it already contains the same register", () => {
            const registerLength = 1;
            const p = new PQGramProfile(registerLength);
            const times = 5;
            const r = Register.ofLength(registerLength);
            for (let i = 0; i < times; i++) {
                p.add(r);
            }
            expect(p).toHaveLength(times);
        });

        it("should throw if the register's length is incompatible", () => {
            const p = new PQGramProfile(1);
            const r = Register.ofLength(2);
            expect(() => p.add(r)).toThrow();
        });
    });

    describe("intersected with another pq-gram profile", () => {
        it("should be empty if one of them is empty", () => {
            const registerLength = 1;
            const p = new PQGramProfile(registerLength);
            for (let i = 0; i < 5; i++) {
                p.add(Register.ofLength(1));
            }
            const q = new PQGramProfile(registerLength);
            expect(p.intersect(q)).toBe(0);
            expect(q.intersect(p)).toBe(0);
        });

        it("should not change the length of the operands", () => {
            const registerLength = 1;
            const p = new PQGramProfile(registerLength);
            for (let i = 0; i < 5; i++) {
                p.add(Register.ofLength(registerLength));
            }

            const q = new PQGramProfile(registerLength);
            for (let i = 0; i < 3; i++) {
                q.add(Register.ofLength(registerLength));
            }

            const before = {
                p: p.length,
                q: q.length,
            };

            p.intersect(q);

            const after = {
                p: p.length,
                q: q.length,
            };

            expect(after).toStrictEqual(before);
        });

        it("should throw if register lengths are incompatible", () => {
            const p = new PQGramProfile(1);
            const q = new PQGramProfile(2);
            expect(() => p.intersect(q)).toThrow();
        });

        describe("should sum the minimum number of times each element occurs in both", () => {
            test("simple example", () => {
                const p = newPQGramProfile(1, ['1', '2', '1', '2'].map((s) => [s]));
                const q = newPQGramProfile(1, ['1', '1', '3', '2'].map((s) => [s]));

                expect(p.intersect(q)).toBe(3);
                expect(q.intersect(p)).toBe(3);
            });

            test("complex example", () => {
                const p = newPQGramProfile(5, [
                    ['*', 'a', '*', '*', 'a'],
                    ['a', 'a', '*', '*', 'e'],
                    ['a', 'e', '*', '*', '*'],
                    ['a', 'a', '*', 'e', 'b'],
                    ['a', 'b', '*', '*', '*'],
                    ['a', 'a', 'e', 'b', '*'],
                    ['a', 'a', 'b', '*', '*'],
                    ['*', 'a', '*', 'a', 'b'],
                    ['a', 'b', '*', '*', '*'],
                    ['*', 'a', 'a', 'b', 'c'],
                    ['a', 'c', '*', '*', '*'],
                    ['*', 'a', 'b', 'c', '*'],
                    ['*', 'a', 'c', '*', '*'],
                ].map((r) => r.map((c) => c === '*' ? null : c)));

                const q = newPQGramProfile(5, [
                    ['*', 'a', '*', '*', 'a'],
                    ['a', 'a', '*', '*', 'e'],
                    ['a', 'e', '*', '*', '*'],
                    ['a', 'a', '*', 'e', 'b'],
                    ['a', 'b', '*', '*', '*'],
                    ['a', 'a', 'e', 'b', '*'],
                    ['a', 'a', 'b', '*', '*'],
                    ['*', 'a', '*', 'a', 'b'],
                    ['a', 'b', '*', '*', '*'],
                    ['*', 'a', 'a', 'b', 'x'],
                    ['a', 'x', '*', '*', '*'],
                    ['*', 'a', 'b', 'x', '*'],
                    ['*', 'a', 'x', '*', '*'],
                ].map((r) => r.map((c) => c === '*' ? null : c)));

                expect(p.intersect(q)).toBe(9);
            });
        });
    });


    test("it should have length 13 for our example tree", () => {
        const t =
            tree(
                node("a",
                    node("a",
                        node("e"),
                        node("b")
                    ),
                    node("b"),
                    node("c")),
            );
        const p = 2;
        const q = 3;
        expect(PQGramProfile.of(t, p, q)).toHaveLength(13);
    });

    describe.each([0, -1, 1.1234])("should throw", (i) => {
        it(`for invalid p of ${i}`, () => {
            expect(() => PQGramProfile.of(tree(node("a")), i, 3)).toThrow();
        });

        it(`for invalid q of ${i}`, () => {
            expect(() => PQGramProfile.of(tree(node("a")), 2, i)).toThrow();
        });
    });
});
