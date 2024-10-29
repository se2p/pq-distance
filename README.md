# pq-distance: Approximate Tree-Edit Distance for Node.js

![CI status](https://github.com/se2p/pq-distance/actions/workflows/ci.yml/badge.svg?branch=main)

Modern TypeScript implementation of pq-gram distance, an efficient approximation for tree-edit distance. Algorithm based
on the academic paper [^1][^2]. Implementation ported from LitterBox[^3]. Node.js API inspired by jqgram[^4].

## Installation

The package can be installed as `@se2p/pq-distance` from npm:

```bash
npm install @se2p/pq-distance
```

## Usage

The package exports a single function `pqDistance`:

```javascript
const {pqDistance} = require("@se2p/pq-distance");
```

TypeScript users can also import the `PQTree` and `PQOpts` types:

```typescript
import {pqDistance, PQTree, PQOpts} from "@se2p/pq-distance";
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

The object `opts` sets the `p` and `q` values for distance computation, and may be omitted to use the default values
`p=2` and `q=3`. Please refer to the academic paper how they affect the distance value.

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
