import {requirePositiveInteger} from "./util";

/**
 * Dummy label.
 */
const NIL = Symbol("*");

/**
 * The label of a node, or a dummy.
 */
type Label = string | typeof NIL;

class _Register {

    /**
     * Current labels stored by the register.
     * @private
     */
    private readonly _contents: Label[];

    /**
     * Constructs a new shift register, initially filled with the given labels.
     * @param contents The labels with which the register is initially filled.
     * @protected
     */
    protected constructor(contents: Label[]) {
        if (contents.length === 0) {
            throw new Error("empty contents");
        }

        this._contents = contents;
    }

    /**
     * The length of the register.
     */
    get length(): number {
        return this._contents.length;
    }

    /**
     * Shifts the register using the given label. This operation removes the oldest element from the front of the
     * register, and enqueues the given one at the end. Does not modify this register in-place, but creates and
     * returns a new register to which the changes are applied.
     * @param label The label with which to shift.
     */
    shift(label: Label = NIL): Register {
        const contents = [...this._contents];
        contents.push(label);
        contents.shift();
        return new _Register(contents);
    }

    /**
     * Concatenated the labels of this register with the labels of the given other register, and returns a new register
     * with the result. Does not modify the two operand registers in-place.
     * @param that The other register to concatenate with.
     */
    concat(that: Register): Register {
        return new _Register([...this._contents, ...that._contents]);
    }

    /**
     * JSON representation of this register.
     */
    toJSON(): (string | null)[] {
        return this._contents.map((l) => l === NIL ? null : l);
    }
}

/**
 * A fixed-length shift register of labels.
 */
export class Register extends _Register {

    /**
     * Constructs a new, initially empty shift register which can hold the given fixed number of labels.
     * @param n The fixed length of the register.
     */
    constructor(n: number) {
        requirePositiveInteger(n);
        super(Array<Label>(n).fill(NIL));
    }
}
