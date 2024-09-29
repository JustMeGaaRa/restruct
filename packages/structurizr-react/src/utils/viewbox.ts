import { Viewbox } from "../containers";

const defaultDimensions = { x: 0, y: 0, height: 200, width: 200 };

export function calculateAbsolutePosition(
    viewbox: Viewbox,
    zoom: number,
    element: SVGGraphicsElement
) {
    if (!element) return defaultDimensions;

    const ctm = element.getCTM();
    const bbox = element.getBBox();

    if (!ctm) return defaultDimensions;

    // const x = (ctm.e + bbox.x * ctm.a + bbox.y * ctm.c + viewbox.x) / zoom;
    // const y = (ctm.f + bbox.x * ctm.b + bbox.y * ctm.d + viewbox.y) / zoom;
    const x = ctm.e / ctm.a + bbox.x + viewbox.x / zoom;
    const y = ctm.f / ctm.d + bbox.y + viewbox.y / zoom;
    return { x, y, height: bbox.height, width: bbox.width };
}

export function calculateCenterPosition(
    viewbox: Viewbox,
    zoom: number,
    element: SVGGraphicsElement
) {
    const absolutePosition = calculateAbsolutePosition(viewbox, zoom, element);
    const centeredPosition = {
        x: absolutePosition.x + absolutePosition.width / 2,
        y: absolutePosition.y + absolutePosition.height / 2,
    };
    return centeredPosition;
}

export function exportToSvg() {
    const domNode = document
        .getElementsByClassName("structurizr__viewport")
        .item(0);
    const svgClone = domNode?.cloneNode(true) as SVGSVGElement;
    if (!domNode) return "";
    svgClone.setAttribute("height", "1280");
    svgClone.setAttribute("width", "1280");
    const svgOuterHTML = svgClone.outerHTML;
    return svgOuterHTML;
}
