import {requirePositiveInteger} from "../src/util";

describe("requirePositiveInteger", () => {
    it("should not throw when no arguments are given", () => {
        expect(() => requirePositiveInteger()).not.toThrow();
    });

    it("should throw for a negative number", () => {
        expect(() => requirePositiveInteger(1, -42, 2, 3)).toThrow();
    });

    it("should throw for 0", () => {
        expect(() => requirePositiveInteger(1, 2, 0)).toThrow();
    });

    it("should throw for a positive but non-integer number", () => {
        expect(() => requirePositiveInteger(1.1234, 2, 3, 4)).toThrow();
    });

    it("should not throw if the given numbers are positive integers", () => {
        expect(() => requirePositiveInteger(1, 2, 3, 4)).not.toThrow();
    });
});
