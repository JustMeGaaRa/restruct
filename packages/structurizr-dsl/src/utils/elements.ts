export const isElementExplicitlyIncludedInView = (
    view: { include?: string[] },
    elementIdentifier: string
) => {
    return view.include?.includes(elementIdentifier);
};
