export type Dimensions = {
    x: number;
    y: number;
    height: number;
    width: number;
};

export function getTransformToElement(element: SVGGraphicsElement) {
    // get the transformation matrix from the element to the SVG root
    const elementCTM = element.getCTM();
    // get the transformation matrix from the SVG root to the screen
    const svgInverseCTM = element.ownerSVGElement?.getScreenCTM()?.inverse();
    // cancel out the svg transformation from the element transformation
    return svgInverseCTM?.multiply(elementCTM!);
}

export function getAbsoluteOrDefault(
    element: SVGGraphicsElement,
    defaultDimensions: Dimensions
) {
    if (!element) return defaultDimensions;

    const elementCTM = element.getCTM();
    const elementBBox = element.getBBox();

    if (!elementCTM) return defaultDimensions;

    const svgRelativeCTM = getTransformToElement(element);

    const svgNewPoint = element.ownerSVGElement!.createSVGPoint();
    svgNewPoint.x = elementBBox.x;
    svgNewPoint.y = elementBBox.y;

    const svgRelativePoint = svgNewPoint.matrixTransform(svgRelativeCTM);

    return {
        x: svgRelativePoint.x,
        y: svgRelativePoint.y,
        height: elementBBox.height,
        width: elementBBox.width,
    };
}

export function getAbsoluteCenterOrDefault(
    element: SVGGraphicsElement,
    defaultDimensions: Dimensions
) {
    const absolutePosition = getAbsoluteOrDefault(element, defaultDimensions);
    const centeredPosition = {
        x: absolutePosition.x + absolutePosition.width / 2,
        y: absolutePosition.y + absolutePosition.height / 2,
    };
    return centeredPosition;
}

export function exportToSvg(element: HTMLElement) {
    const domNode = element
        .getElementsByClassName("structurizr__viewport")
        .item(0);
    const svgClone = domNode?.cloneNode(true) as SVGSVGElement;
    if (!domNode) return "";
    svgClone.setAttribute("height", "1280");
    svgClone.setAttribute("width", "1280");
    const svgOuterHTML = svgClone.outerHTML;
    return svgOuterHTML;
}
