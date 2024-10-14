import { Viewbox } from "../containers";

/**
 * Calculates the scale factor between the original and current content sizes.
 *
 * @param {Object} originSize - The original size of the content.
 * @param {Object} currentSize - The current size of the content.
 * @returns - The scale factor.
 */
export const getContentScale = (
    originSize: { width: number; height: number },
    currentSize: { width: number; height: number }
) => {
    return Math.min(
        originSize.width / currentSize.width,
        originSize.height / currentSize.height
    );
};

/**
 * Pans an SVG viewBox based on mouse movement.
 *
 * @param {Viewbox} viewBox - The current viewBox [x0, y0, width, height].
 * @param {Object} cursorDelta - The movement delta { dx: deltaX, dy: deltaY } in screen coordinates.
 * @param {Object} containerSize - The SVG dimensions { width: SVGWidth, height: SVGHeight } in pixels.
 * @returns {Viewbox} - The new viewBox [x1, y1, width, height].
 */
export function pan(
    viewBox: Viewbox,
    cursorDelta: { dx: number; dy: number },
    containerSize: { width: number; height: number }
): Viewbox {
    const { x: x0, y: y0, width, height } = viewBox;
    const { dx, dy } = cursorDelta;
    const { width: SVGWidth, height: SVGHeight } = containerSize;

    // Convert screen deltas to SVG coordinate deltas
    const dxSVG = (dx / SVGWidth) * width;
    const dySVG = (dy / SVGHeight) * height;

    // Update x0 and y0 to pan the viewBox
    const x1 = x0 - dxSVG;
    const y1 = y0 - dySVG;

    // Return the new viewBox
    return {
        x: x1,
        y: y1,
        width,
        height,
    };
}

/**
 * Zooms in on an SVG viewBox, keeping the point under the cursor stationary.
 *
 * @param {Viewbox} viewBox - The current viewBox [x0, y0, width0, height0].
 * @param {number} scaleFactor - The scaling factor k (>1 for zoom in, <1 for zoom out).
 * @param {Object} cursorPosition - The cursor position { x: cx, y: cy } in screen coordinates.
 * @param {Object} containerSize - The SVG dimensions { width: SVGWidth, height: SVGHeight }.
 * @returns {Viewbox} - The new viewBox [x1, y1, width1, height1].
 */
export function zoom(
    viewBox: Viewbox,
    scaleFactor: number,
    cursorPosition: { x: number; y: number },
    containerSize: { width: number; height: number }
): Viewbox {
    const { x: x0, y: y0, width: width0, height: height0 } = viewBox;
    const { x: cx, y: cy } = cursorPosition;
    const { width: SVGWidth, height: SVGHeight } = containerSize;

    // Step 1: Calculate new width and height
    const width1 = width0 / scaleFactor;
    const height1 = height0 / scaleFactor;

    // Step 2: Convert cursor position to SVG coordinates
    const cursorSVGX = x0 + (cx / SVGWidth) * width0;
    const cursorSVGY = y0 + (cy / SVGHeight) * height0;

    // Step 3: Calculate new x and y to keep cursor stationary
    const x1 = x0 + (cursorSVGX - x0) * (1 - 1 / scaleFactor);
    const y1 = y0 + (cursorSVGY - y0) * (1 - 1 / scaleFactor);

    return {
        x: x1,
        y: y1,
        width: width1,
        height: height1,
    };
}

/**
 * Zooms out the SVG viewBox, scaling down the content and gradually centering it.
 *
 * @param {Viewbox} viewBox - The current viewBox [x0, y0, width0, height0].
 * @param {number} scaleFactor - The scaling factor k (<1 for zoom out).
 * @param {Object} containerSize - The SVG size.
 * @param {Object} contentGroup - The root-level group size.
 * @param {number} interpolationFactor - The interpolation factor between 0 and 1.
 * @returns {Viewbox} - The new viewBox [x1, y1, width1, height1].
 */
export function zoomOut(
    viewBox: Viewbox,
    scaleFactor: number,
    containerSize: { width: number; height: number },
    contentGroup: { x: number; y: number; width: number; height: number },
    interpolationFactor = 0.1
): Viewbox {
    const { x: x0, y: y0, width: width0, height: height0 } = viewBox;
    const { width: SVGWidth, height: SVGHeight } = containerSize;

    // Step 1: Scale the viewBox dimensions
    const width1 = width0 / scaleFactor;
    const height1 = height0 / scaleFactor;

    // Step 2: Get content bounding box and center
    const contentCenterX = contentGroup.x + contentGroup.width / 2;
    const contentCenterY = contentGroup.y + contentGroup.height / 2;

    // Step 3: Get current viewport center in SVG coordinates
    const viewportCenterX = SVGWidth / 2;
    const viewportCenterY = SVGHeight / 2;

    const viewportCenterSVGX = x0 + (viewportCenterX / SVGWidth) * width0;
    const viewportCenterSVGY = y0 + (viewportCenterY / SVGHeight) * height0;

    // Step 4: Interpolate towards the content center
    const newCenterX =
        viewportCenterSVGX +
        (contentCenterX - viewportCenterSVGX) * interpolationFactor;
    const newCenterY =
        viewportCenterSVGY +
        (contentCenterY - viewportCenterSVGY) * interpolationFactor;

    // Step 5: Calculate the new viewBox origin
    const x1 = newCenterX - width1 / 2;
    const y1 = newCenterY - height1 / 2;

    return {
        x: x1,
        y: y1,
        width: width1,
        height: height1,
    };
}

/**
 * Adjusts the SVG viewBox to fit and center all content within the viewport.
 *
 * @param {Object} containerSize - The SVG size.
 * @param {Object} contentGroup - The root-level group size.
 * @returns {Viewbox} - The new viewBox [x1, y1, width1, height1].
 */
export function zoomToFit(
    containerSize: { width: number; height: number },
    contentGroup: { x: number; y: number; width: number; height: number }
): Viewbox {
    // Step 1: Get the SVG viewport dimensions
    const { width: SVGWidth, height: SVGHeight } = containerSize;

    // Step 2: Calculate scaling factors
    const scale = getContentScale(containerSize, contentGroup);

    // Step 3: Calculate the new viewBox dimensions
    const viewBoxWidth = SVGWidth / scale;
    const viewBoxHeight = SVGHeight / scale;

    // Step 4: Center the content
    const x = contentGroup.x + contentGroup.width / 2 - viewBoxWidth / 2;
    const y = contentGroup.y + contentGroup.height / 2 - viewBoxHeight / 2;

    // Step 5: Set the new viewBox
    const newViewBox = {
        x,
        y,
        width: viewBoxWidth,
        height: viewBoxHeight,
    };
    return newViewBox;
}

/**
 * Converts a point from screen (client) coordinates to SVG coordinates.
 *
 * @param {Object} screenPoint - The screen position { x: screenX, y: screenY }.
 * @param {Viewbox} viewBox - The current viewBox [x0, y0, width, height].
 * @param {Object} svgDimensions - The SVG dimensions { width: SVGWidth, height: SVGHeight } in pixels.
 * @returns {Object} - The SVG position { x: SVGX, y: SVGY }.
 */
export function screenToSVG(
    screenPoint: { x: number; y: number },
    viewBox: Viewbox,
    svgDimensions: { width: number; height: number }
) {
    const { x: x0, y: y0, width, height } = viewBox;
    const { x: screenX, y: screenY } = screenPoint;
    const { width: SVGWidth, height: SVGHeight } = svgDimensions;

    const SVGX = x0 + (screenX / SVGWidth) * width;
    const SVGY = y0 + (screenY / SVGHeight) * height;

    return { x: SVGX, y: SVGY };
}

/**
 * Converts a point from SVG coordinates to screen (client) coordinates.
 *
 * @param {Object} svgPoint - The SVG position { x: SVGX, y: SVGY }.
 * @param {Array} viewBox - The current viewBox [x0, y0, width, height].
 * @param {Object} svgDimensions - The SVG dimensions { width: SVGWidth, height: SVGHeight } in pixels.
 * @returns {Object} - The screen position { x: screenX, y: screenY }.
 */
export function SVGToScreen(
    svgPoint: { x: number; y: number },
    viewBox: Viewbox,
    svgDimensions: { width: number; height: number }
) {
    const { x: x0, y: y0, width, height } = viewBox;
    const { x: SVGX, y: SVGY } = svgPoint;
    const { width: SVGWidth, height: SVGHeight } = svgDimensions;

    const screenX = ((SVGX - x0) / width) * SVGWidth;
    const screenY = ((SVGY - y0) / height) * SVGHeight;

    return { x: screenX, y: screenY };
}

export function screenToSVGWithCTM(
    screenPoint: { x: number; y: number },
    svgElement: SVGSVGElement
) {
    const { x: screenX, y: screenY } = screenPoint;

    // Get the inverse of the current transformation matrix
    const svgCTM = svgElement.getScreenCTM()?.inverse();

    // Create an SVGPoint object
    const pt = svgElement.createSVGPoint();
    pt.x = screenX;
    pt.y = screenY;

    // Apply the inverse matrix to the point
    const svgPoint = pt.matrixTransform(svgCTM);

    return { x: svgPoint.x, y: svgPoint.y };
}

export function SVGwithCTMToScreen(
    svgPoint: { x: number; y: number },
    svgElement: SVGSVGElement
) {
    const { x: SVGX, y: SVGY } = svgPoint;

    // Get the current transformation matrix
    const svgCTM = svgElement.getScreenCTM() ?? undefined;

    // Create an SVGPoint object
    const pt = svgElement.createSVGPoint();
    pt.x = SVGX;
    pt.y = SVGY;

    // Apply the matrix to the point
    const screenPoint = pt.matrixTransform(svgCTM);

    return { x: screenPoint.x, y: screenPoint.y };
}
