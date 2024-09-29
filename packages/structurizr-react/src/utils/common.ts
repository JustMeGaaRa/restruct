export function cssCompose(...classNames: Array<string | undefined>) {
    return classNames
        .filter((x) => x !== null && x != undefined)
        .join(" ")
        .trim();
}

export function getSvgElementById(identifier: string) {
    const htmlElement = document.getElementById(identifier) as HTMLElement;
    const svgElement =
        htmlElement instanceof SVGGraphicsElement ? htmlElement : null;
    return svgElement;
}

export function getSvgElementByClassName(
    element: HTMLElement,
    className: string
) {
    const htmlElement = element?.getElementsByClassName(
        className
    )[0] as HTMLElement;
    const svgElement =
        htmlElement instanceof SVGGraphicsElement ? htmlElement : null;
    return svgElement;
}