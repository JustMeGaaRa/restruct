export interface NodeData<T = any> {
    id: string;
    x: number;
    y: number;
    width?: number;
    height?: number;
    parent?: string;
    data?: T;
}

export interface EdgeData<T = any> {
    id: string;
    source: string;
    target: string;
    data?: T;
}

export interface GraphAdapter<TNode = any, TEdge = any, TLayout = any> {
    getNode: (nodeId: string) => NodeData<TNode>;
    getNodes: () => NodeData<TNode>[];
    setParent: (nodeId: string, parentId: string) => void;
    setNode: (nodeId: string, node: NodeData<TNode>) => void;
    setEdge: (edgeId: string, edge: EdgeData<TEdge>) => void;
    layout: () => Promise<TLayout>;
}
