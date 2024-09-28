export interface IBuilder<T> {
    build(): T;
}

export type BuilderCallback<
    TBuilder extends IBuilder<TResult>,
    TResult = any,
> = (builder: TBuilder) => void;
