import { PQGramProfile, PQTree } from "./PQGramProfile";
import { requirePositiveInteger } from "./util";

export interface PQOpts {
    p: number;
    q: number;
}

/**
 * Computes the pq-gram distance of the two given trees. Uses p=2 and q=3 by default.
 *
 * @param t1 A tree
 * @param t2 Another tree
 * @param opts Custom p and q values, optional
 */
export function pqDistance<T, U>(t1: PQTree<T>, t2: PQTree<U>, opts: Partial<PQOpts> = {}): number {
    const { p, q } = {
        p: 2,
        q: 3,
        ...opts,
    };

    requirePositiveInteger(p, q);

    const p1 = PQGramProfile.of(t1, p, q);
    const p2 = PQGramProfile.of(t2, p, q);
    return p1.distanceTo(p2);
}

export interface PQWindowedOpts {
    p: number;
    w: number;
}

export function pqDistanceWindowed<T, U>(
    t1: PQTree<T>,
    t2: PQTree<U>,
    opts: Partial<PQWindowedOpts> = {},
): number {
    const { p, w } = {
        p: 2,
        w: 3,
        ...opts,
    };

    requirePositiveInteger(p, w);

    if (w < 2) {
        throw new RangeError(`Expected window size to be greater than or equal to 2`);
    }

    const p1 = PQGramProfile.windowed(t1, p, w);
    const p2 = PQGramProfile.windowed(t2, p, w);
    return p1.distanceTo(p2);
}
