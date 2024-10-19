import { IDiagramVisitor } from "./IDiagramVisitor";

export interface ISupportVisitor<TScope, TSupporting> {
    accept(visitor: IDiagramVisitor<TScope, TSupporting>): void;
}
