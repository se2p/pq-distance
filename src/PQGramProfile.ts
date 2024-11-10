import {Register} from "./Register";
import {requirePositiveInteger} from "./util";

/**
 * Represents a tree.
 */
export interface PQTree<T> {

    /**
     * The tree's root node.
     */
    root: T;

    /**
     * Retrieves the label from the given node.
     * @param node The node from which to retrieve the label.
     */
    getLabel: (node: T) => string;

    /**
     * Returns the given node's child nodes.
     * @param node The node whose children to return.
     */
    getChildren: (node: T) => readonly T[];
}

/**
 * Implements a pq-gram profile, which behaves like a bag of labelled tuples ("registers").
 */
export class PQGramProfile {

    /**
     * Number of occurrences of each register in the bag.
     * @private
     */
    private readonly _tuples: Map<string, number> = new Map();

    /**
     * Size of the bag.
     * @private
     */
    private _length: number = 0;

    /**
     * Allowed register size.
     * @private
     */
    private readonly _registerLength: number;

    constructor(registerLength: number) {
        requirePositiveInteger(registerLength);
        this._registerLength = registerLength;
    }

    /**
     * The size of the bag.
     */
    get length(): number {
        return this._length;
    }

    /**
     * The allowed register size.
     */
    get registerLength(): number {
        return this._registerLength;
    }

    /**
     * Adds a new register to this bag. The register's size must be compatible with the bag, otherwise an error is
     * thrown.
     * @param elem The register to add.
     */
    add(elem: Register): void {
        if (elem.length !== this._registerLength) {
            throw new Error(`Expected register of length ${this._registerLength}, but got ${elem.length}`);
        }

        const tuple = JSON.stringify(elem);
        const count = this._tuples.get(tuple) ?? 0;
        this._tuples.set(tuple, count + 1);
        this._length++;
    }

    /**
     * Computes the size of the bag intersection between this bag and the given other bag.
     * @param that The other bag.
     */
    intersect(that: PQGramProfile): number {
        if (this._registerLength !== that._registerLength) {
            throw new Error("Intersected profiles must only contain registers of same length");
        }

        let sum = 0;

        for (const tuple of this._tuples.keys()) {
            if (that._tuples.has(tuple)) {
                sum += Math.min(this._tuples.get(tuple)!, that._tuples.get(tuple)!);
            }
        }

        return sum;
    }

    /**
     * Computes the pq-gram profile of the given tree, using the specified p and q values.
     * @param tree The tree for which to compute the profile.
     * @param p The p value to use.
     * @param q The q value to use.
     */
    static of<T>(tree: PQTree<T>, p: number, q: number): PQGramProfile {
        requirePositiveInteger(p, q);

        const profile = new PQGramProfile(p + q);
        const workQueue: [T, Register][] = [[tree.root, Register.ofLength(p)]];

        while (workQueue.length > 0) {
            const [r, _anc] = workQueue.shift()!;
            const anc = _anc.shift(tree.getLabel(r));
            let sib = Register.ofLength(q);

            const children = tree.getChildren(r);

            if (children.length === 0) {
                profile.add(anc.concat(sib));
                continue;
            }

            for (const c of children) {
                sib = sib.shift(tree.getLabel(c));
                profile.add(anc.concat(sib));
                workQueue.push([c, anc]);
            }

            for (let k = 0; k < q - 1; k++) {
                sib = sib.shift();
                profile.add(anc.concat(sib));
            }
        }

        return profile;
    }
}
