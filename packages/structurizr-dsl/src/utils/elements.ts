export const isElementExplicitlyIncludedInView = (
    view: { include?: string[] },
    elementIdentifier: string
) => {
    // TODO (configuration): all elements are included for asterisk isntead of scoped ones
    return (
        view.include?.includes(elementIdentifier) ||
        view.include?.includes("*") ||
        false
    );
};
