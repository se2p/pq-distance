import { PQGramProfile } from "../src/PQGramProfile";
import { node, tree } from "./util";
import { pqDistance, pqDistanceWindowed } from "../src/pqDistance";

const t1 =
    tree(
        node("a",
            node("a",
                node("e"),
                node("b")
            ),
            node("b"),
            node("c")
        )
    );

const t2 =
    tree(
        node("a",
            node("a",
                node("e"),
                node("b")
            ),
            node("b"),
            node("x")
        )
    );

const t3 =
    tree(
        node("a",
            node("b",
                node("c")
            ),
            node("b")
        )
    );

const t4 =
    tree(
        node("a",
            node("b"),
            node("b",
                node("c")
            ),
        )
    );

describe("the pq-distance", () => {
    it("should be 0 when comparing a tree against itself", () => {
        expect(pqDistance(t1, t1)).toStrictEqual(0);
        expect(pqDistance(t2, t2)).toStrictEqual(0);
        expect(pqDistance(t3, t3)).toStrictEqual(0);
        expect(pqDistance(t3, t3)).toStrictEqual(0);
    });

    it("can be 0 for structurally different trees", () => {
        expect(pqDistance(t3, t4)).toStrictEqual(0);
    });

    it("should be symmetric", () => {
        expect(pqDistance(t1, t2)).toStrictEqual(pqDistance(t2, t1));
        expect(pqDistance(t3, t4)).toStrictEqual(pqDistance(t4, t3));
    });

    it("should be around 0.31 for the two example trees", () => {
        expect(pqDistance(t1, t2)).toStrictEqual(expect.closeTo(0.3076923076923077, 5));
    });

    describe.each([0, -1, 1.1234])("should throw", (i) => {
        test(`for invalid p of ${i}`, () => {
            expect(() => pqDistance(t1, t2, { p: i })).toThrow();
        });

        test(`for invalid q of ${i}`, () => {
            expect(() => pqDistance(t1, t2, { q: i })).toThrow();
        });
    });

    describe("should use", () => {
        let pqGramProfileOf: jest.Spied<typeof PQGramProfile.of> | null = null;

        beforeAll(() => {
            pqGramProfileOf = jest.spyOn(PQGramProfile, "of");
        });

        afterEach(() => {
            pqGramProfileOf?.mockClear();
        });

        afterAll(() => {
            pqGramProfileOf?.mockRestore();
        });

        test("the given p and q values", () => {
            const p = 3;
            const q = 4;
            pqDistance(t1, t2, { p, q });
            expect(pqGramProfileOf).toHaveBeenCalledWith(expect.anything(), 3, 4);
            expect(pqGramProfileOf).toHaveBeenCalledTimes(2);
        });

        test("p=2 and q=3 if not explicitly specified", () => {
            pqDistance(t1, t2);
            expect(pqGramProfileOf).toHaveBeenCalledWith(expect.anything(), 2, 3);
            expect(pqGramProfileOf).toHaveBeenCalledTimes(2);
        });
    });
});

describe("The windowed pq-gram distance", () => {
    it("should be 0 when comparing a tree against itself", () => {
        expect(pqDistanceWindowed(t1, t1)).toStrictEqual(0);
        expect(pqDistanceWindowed(t2, t2)).toStrictEqual(0);
        expect(pqDistanceWindowed(t3, t3)).toStrictEqual(0);
        expect(pqDistanceWindowed(t3, t3)).toStrictEqual(0);
    });

    it("should be 0 for unordered trees (i.e., with different sibling order)", () => {
        const t5 = tree(
            node("a",
                node("b"),
                node("c"),
                node("d"),
            ),
        );

        const t6 = tree(
            node("a",
                node("d"),
                node("c"),
                node("b"),
            ),
        );

        expect(pqDistanceWindowed(t5, t6)).toStrictEqual(0);
    });

    it("should be symmetric", () => {
        expect(pqDistanceWindowed(t1, t2)).toStrictEqual(pqDistanceWindowed(t2, t1));
        expect(pqDistanceWindowed(t3, t4)).toStrictEqual(pqDistanceWindowed(t4, t3));
    });

    it("should be 0.3125 for the two example trees", () => {
        expect(pqDistanceWindowed(t1, t2)).toStrictEqual(0.3125);
    });

    describe.each([0, -1, 1.1234])("should throw", (i) => {
        test(`for invalid p of ${i}`, () => {
            expect(() => pqDistanceWindowed(t1, t2, { p: i })).toThrow();
        });

        test(`for invalid window size w of ${i}`, () => {
            expect(() => pqDistanceWindowed(t1, t2, { w: i })).toThrow();
        });
    });

    it("should throw for invalid window size w of 1", () => {
        expect(() => pqDistanceWindowed(t1, t2, { w: 1 })).toThrow();
    });

    describe("should use", () => {
        let pqGramProfileWindowed: jest.Spied<typeof PQGramProfile.windowed> | null = null;

        beforeAll(() => {
            pqGramProfileWindowed = jest.spyOn(PQGramProfile, "windowed");
        });

        afterEach(() => {
            pqGramProfileWindowed?.mockClear();
        });

        afterAll(() => {
            pqGramProfileWindowed?.mockRestore();
        });

        test("the given p and w values", () => {
            const p = 3;
            const w = 4;
            pqDistanceWindowed(t1, t2, { p, w });
            expect(pqGramProfileWindowed).toHaveBeenCalledWith(expect.anything(), 3, 4);
            expect(pqGramProfileWindowed).toHaveBeenCalledTimes(2);
        });

        test("p=2 and w=3 if not explicitly specified", () => {
            pqDistanceWindowed(t1, t2);
            expect(pqGramProfileWindowed).toHaveBeenCalledWith(expect.anything(), 2, 3);
            expect(pqGramProfileWindowed).toHaveBeenCalledTimes(2);
        });
    });
});
