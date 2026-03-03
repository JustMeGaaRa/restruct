export function memoize<T extends (...args: any[]) => any>(
    func: T
): (...args: Parameters<T>) => ReturnType<T> {
    const cache: Map<string, ReturnType<T>> = new Map();

    return (...args: Parameters<T>): ReturnType<T> => {
        // A simple key generation (works for primitives, may need a custom hasher for objects)
        const key = JSON.stringify(args);

        if (cache.has(key)) {
            return cache.get(key)!;
        }

        const result = func(...args);
        cache.set(key, result);
        return result;
    };
}
