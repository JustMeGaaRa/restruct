import { IDiagramVisitor } from "./IDiagramVisitor";

export interface ISupportDiagramVisitor<TScope, TSupporting> {
    accept(visitor: IDiagramVisitor<TScope, TSupporting>): void;
}
