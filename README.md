# pq-distance: Approximate Tree-Edit Distance for Node.js

[![npm version](https://badge.fury.io/js/@se2p%2Fpq-distance.svg)](https://www.npmjs.com/package/@se2p/pq-distance) 
![CI status](https://github.com/se2p/pq-distance/actions/workflows/ci.yml/badge.svg?branch=main)

Modern TypeScript implementation of pq-gram distance, an efficient approximation for tree-edit distance. Algorithm based
on academic papers[^1][^2] and thesis[^5]. Implementation ported from LitterBox[^3]. Node.js API inspired by jqgram[^4].

## Installation

The package can be installed as `@se2p/pq-distance` from npm:

```bash
npm install @se2p/pq-distance
```

## Usage

The package exports two functions function `pqDistance` and `pqDistanceWindowed`:

```javascript
const {pqDistance, pqDistanceWindowed} = require("@se2p/pq-distance");
```

TypeScript users can also import the `PQTree`, `PQOpts` and `PQWindowedOpts` types:

```typescript
import {pqDistance, pqDistanceWindowed, PQTree, PQOpts, PQWindowedOpts} from "@se2p/pq-distance";
```

Example trees:

```
        a              a
       /|\            /|\
t1:   a b c    t2:   a b c 
     / \            / \
    e   b          e   x
```

Arbitrary tree-representations are supported. Provide two functions `getLabel()` to extract the label as string from a
node, and `getChildren()` that returns a node's children in an array.

For example:

```typescript
const t1 = {
    label: 'a',
    children: [
        {
            label: 'a',
            children: [
                {
                    label: 'e',
                    children: []
                },
                {
                    label: 'b',
                    children: []
                }
            ]
        },
        {
            label: 'b',
            children: []
        },
        {
            label: 'c',
            children: []
        }
    ]
};

const t2 = {
    node: 'A',
    child: [
        {
            node: 'A',
            child: [
                {node: 'E'},
                {node: 'B'}
            ]
        },
        {node: 'B'},
        {node: 'X'}
    ]
};
```

To compute the pq-gram distance between `t1` and `t2`, pass them as `PQTree` objects to `pqDistance()`:

```typescript
const tree1: PQTree = {
    root: t1,
    getLabel: ({label}) => label,
    getChildren: ({children}) => children
};

const tree2: PQTree = {
    root: t2,
    getLabel: (n) => n.node.toLowerCase(),
    getChildren: (n) => n.child ?? []
};
```

Finally:

```typescript
const opts: PQOpts = {p: 2, q: 3}; // default values 
pqDistance(tree1, tree2, opts); // 0.3076923076923077
```

The use is analogous for the windowed pq-gram distance:

```typescript
const opts: PQWindowedOpts = {p: 2, w: 3}; // default values 
pqDistanceWindowed(tree1, tree2, opts); // 0.3125
```

The object `opts` sets the `p` and `q` values for `pqDistance`, and may be omitted to use the default values
`p=2` and `q=3`. In case of `pqDistanceWindowed`, you must use `w` instead of `q`. The default values are
`p=2` and `w=3`. Please refer to the academic papers how they affect the distance value.

## License

pq-distance is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
version.

pq-distance is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.


[^1]: Nikolaus Augsten, Michael H. Böhlen, and Johann Gamper. 2005. Approximate Matching of Hierarchical Data Using
   pq-Grams. In Proceedings of the 31st International Conference on Very Large Data Bases, Trondheim, Norway, August 30
   – September 2, 2005
[^2]: https://github.com/DatabaseGroup/apted
[^3]: https://github.com/se2p/LitterBox
[^4]: https://github.com/hoonto/jqgram
[^5]: https://vbn.aau.dk/en/publications/approximate-matching-of-hierarchial-data
