import {Register} from "../src/Register";
import {newRegister} from "./util";

describe("A register", () => {
    describe("that is newly constructed", () => {
        it.each([0, -1, 1.1234])("should throw an error for invalid size %d", (i) => {
            expect(() => new Register(i)).toThrow();
        });

        it("should have the specified size", () => {
            const length = 42;
            expect(new Register(42)).toHaveLength(length);
        });

        it("should be empty", () => {
            const length = 5;
            const r = new Register(length);
            const actual = r.toJSON();
            const expected = Array(length).fill(null);
            expect(actual).toStrictEqual(expected);
        });
    });

    describe("that is serialized", () => {
        it("should return a fresh object", () => {
            const r = new Register(5);
            const j = r.toJSON();
            const k = r.toJSON();
            expect(j).not.toBe(k);
        });

        it("should result in an array with the labels", () => {
            const r = new Register(3).shift("foo").shift("bar");
            expect(r.toJSON()).toStrictEqual([null, "foo", "bar"]);
        });
    });

    describe("that is shifted", () => {
        it("should not modify the callee object", () => {
            const r = new Register(5);
            const before = r.toJSON();
            r.shift("foo");
            const after = r.toJSON();
            expect(before).toStrictEqual(after);
        });

        it("should result in a new register with the given label appended", () => {
            const r = new Register(2);
            const t = r.shift("foo");
            expect(r).not.toBe(t);
            expect(t.toJSON()).toStrictEqual([null, "foo"]);
        });

        it("should have shifted contents", () => {
            const r = newRegister(3, 'a', 'b', 'c', 'd');
            expect(r.toJSON()).toStrictEqual(['b', 'c', 'd']);
        });

        it("should append NIL when not given a label", () => {
            const r = newRegister(3, 'a', 'b', 'c', null);
            expect(r.toJSON()).toStrictEqual(['b', 'c', null]);
        });
    });

    describe("that is concatenated with another register", () => {
        it("should return a new register", () => {
            const r = new Register(1);
            const s = new Register(2);
            const t = r.concat(s);
            expect(t).not.toBe(r);
            expect(t).not.toBe(s);
        });

        it("should return a register of the correct length", () => {
            const r = new Register(1);
            const s = new Register(2);
            const t = r.concat(s);
            expect(t).toHaveLength(r.length + s.length);
        });

        it("should not modify the operands", () => {
            const r = newRegister(3, 'a', 'b', 'c');
            const s = newRegister(3, 'd', 'e', 'f');
            const before = {
                r: r.toJSON(),
                s: s.toJSON(),
            };
            r.concat(s);
            const after = {
                r: r.toJSON(),
                s: s.toJSON(),
            };
            expect(after).toStrictEqual(before);
        });

        it("should have the same values as the two operand registers combined", () => {
            const r = newRegister(3, 'a', 'b', 'c');
            const s = newRegister(3, 'd', 'e', 'f');
            const t = r.concat(s);
            expect(t.toJSON()).toStrictEqual(['a', 'b', 'c', 'd', 'e', 'f']);
        });
    });
});
