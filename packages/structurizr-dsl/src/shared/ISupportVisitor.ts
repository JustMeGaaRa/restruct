import { IDiagramVisitor } from "./IDiagramVisitor";

export interface ISupportVisitor<TScope, TPrimary, TSupporting> {
    accept(visitor: IDiagramVisitor<TScope, TPrimary, TSupporting>): void;
}
