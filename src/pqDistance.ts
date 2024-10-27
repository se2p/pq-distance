import {PQGramProfile, PQTree} from "./PQGramProfile";
import {requirePositiveInteger} from "./util";

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
    const {p, q} = {
        p: 2,
        q: 3,
        ...opts,
    };

    requirePositiveInteger(p, q);

    const p1 = PQGramProfile.of(t1, p, q);
    const p2 = PQGramProfile.of(t2, p, q);

    return 1 - 2 * (p1.intersect(p2) / (p1.length + p2.length));
}
