export const safeBoundingBox = (
    bbox: { x: number; y: number; height?: number; width?: number } | undefined,
    defaultHeight: number,
    defaultWidth: number
) => {
    const {
        x = 0,
        y = 0,
        height = defaultHeight,
        width = defaultWidth,
    } = bbox ?? {
        height: defaultHeight,
        width: defaultWidth,
    };
    return { x, y, height, width };
};
