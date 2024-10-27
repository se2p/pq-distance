import {PQGramProfile} from "../src/PQGramProfile";
import {node, tree} from "./util";
import {pqDistance} from "../src/pqDistance";

describe("the pq-distance", () => {
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

    it("should be 0 when comparing a tree against itself", () => {
        expect(pqDistance(t1, t1)).toStrictEqual(0);
        expect(pqDistance(t2, t2)).toStrictEqual(0);
    });

    it("can be 0 for structurally different trees", () => {
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

        expect(pqDistance(t3, t4)).toStrictEqual(0);
    });

    it("should be symmetric", () => {
        expect(pqDistance(t1, t2)).toStrictEqual(pqDistance(t2, t1));
    });

    it("should be around 0.31 for the two example trees", () => {
        expect(pqDistance(t1, t2)).toStrictEqual(expect.closeTo(0.3076923076923077, 5));
    });

    describe.each([0, -1, 1.1234])("should throw", (i) => {
        test(`for invalid p of ${i}`, () => {
            expect(() => pqDistance(t1, t2, {p: i})).toThrow();
        });

        test(`for invalid q of ${i}`, () => {
            expect(() => pqDistance(t1, t2, {p: i})).toThrow();
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
            pqDistance(t1, t2, {p, q});
            expect(pqGramProfileOf).toHaveBeenCalledWith(expect.anything(), 3, 4);
            expect(pqGramProfileOf).toHaveBeenCalledTimes(2);
        });

        test("p=2 and q=3 if not explicitly specified", () => {
            const pqGramProfileOf = jest.spyOn(PQGramProfile, "of");
            pqDistance(t1, t2);
            expect(pqGramProfileOf).toHaveBeenCalledWith(expect.anything(), 2, 3);
            expect(pqGramProfileOf).toHaveBeenCalledTimes(2);
        });
    });
});
