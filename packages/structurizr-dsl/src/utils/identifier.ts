export const createUniqueId = (): string => {
    return crypto.randomUUID().replace("-", "");
};
