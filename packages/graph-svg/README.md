# `@graph/svg`

A specialized utility package for generating and manipulating SVG-based graphs. This library serves as a low-level engine for the Restruct suite, providing the necessary primitives for rendering nodes, edges, and complex layouts in SVG format.

## 🚀 Key Features

-   **React Components**: High-performance SVG components for architectural elements.
-   **Graph Utilities**: Logic for calculating relationship paths and node positions.
-   **Styling**: Built-in support for theme-aware architectural styles (C4 colors, shapes).
-   **Performance**: Optimized for rendering large diagrams with many elements.

## 🛠️ Usage

Typically used internally by `@structurizr/react`.

```typescript
import { Node, Edge } from '@graph/svg';

// Used within a React SVG context
<svg>
  <Node id="1" label="System A" x={100} y={100} />
  <Edge from="1" to="2" label="Uses" />
</svg>
```

---

## 🔧 Development

```bash
pnpm test
pnpm lint
```
