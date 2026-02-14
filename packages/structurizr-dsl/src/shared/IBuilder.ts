export interface IBuilder<T> {
    build(): T;
}

export type BuilderCallback<
    TBuilder extends IBuilder<TResult>,
    TResult = unknown,
> = (builder: TBuilder) => void;
