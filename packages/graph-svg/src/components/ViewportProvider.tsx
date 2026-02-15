import {
    createContext,
    FC,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from "react";
import { zoom as zoomUtil } from "../utils";

export type Viewbox = { x: number; y: number; height: number; width: number };

export const ViewportContext = createContext<{
    zoom: number;
    viewbox: Viewbox;
    minZoom: number;
    maxZoom: number;
    setZoom: React.Dispatch<SetStateAction<number>>;
    setViewbox: React.Dispatch<SetStateAction<Viewbox>>;
}>({
    zoom: 1,
    viewbox: {
        x: 0,
        y: 0,
        height: 1000,
        width: 1000,
    },
    minZoom: 0.1,
    maxZoom: 5,
    setZoom: () => {},
    setViewbox: () => {},
});

export const ViewportProvider: FC<
    PropsWithChildren<{ minZoom?: number; maxZoom?: number }>
> = ({ children, minZoom = 0.1, maxZoom = 5 }) => {
    const [zoom, setZoom] = useState<number>(1);
    const [viewbox, setViewbox] = useState<Viewbox>({
        x: 0,
        y: 0,
        height: 1000,
        width: 1000,
    });

    return (
        <ViewportContext.Provider
            value={{ zoom, viewbox, minZoom, maxZoom, setZoom, setViewbox }}
        >
            {children}
        </ViewportContext.Provider>
    );
};

export const useViewport = () => {
    const { viewbox, zoom, minZoom, maxZoom, setViewbox, setZoom } =
        useContext(ViewportContext);

    const getBounds = useCallback(() => {
        const contentElement = document
            .getElementsByClassName("graph__viewport-content")
            .item(0) as SVGGraphicsElement;
        if (!contentElement) throw new Error("Content element not found");
        return contentElement.getBBox();
    }, []);

    const fitBounds = useCallback(
        (bounds: { x: number; y: number; width: number; height: number }) => {
            const svgElement = document
                .getElementsByClassName("graph__viewport")
                .item(0) as SVGSVGElement;
            if (!svgElement) return;

            const { width: viewportWidth, height: viewportHeight } =
                svgElement.getBoundingClientRect();
            if (bounds.width === 0 || bounds.height === 0) return;

            const scaleX = viewportWidth / bounds.width;
            const scaleY = viewportHeight / bounds.height;
            const padding = 0.9; // 10% padding
            const scale = Math.min(scaleX, scaleY) * padding;

            // Constrain zoom to keep it within reasonable limits
            const constrainedScale = Math.min(
                Math.max(scale, minZoom),
                maxZoom
            );

            const newWidth = viewportWidth / constrainedScale;
            const newHeight = viewportHeight / constrainedScale;

            const contentCenterX = bounds.x + bounds.width / 2;
            const contentCenterY = bounds.y + bounds.height / 2;

            setViewbox({
                x: contentCenterX - newWidth / 2,
                y: contentCenterY - newHeight / 2,
                width: newWidth,
                height: newHeight,
            });
            setZoom(constrainedScale);
        },
        [setViewbox, setZoom, minZoom, maxZoom]
    );

    const centerViewbox = useCallback(
        (bounds: { x: number; y: number; width: number; height: number }) => {
            setViewbox((state) => ({
                ...state,
                x: bounds.x - (state.width - bounds.width) / 2,
                y: bounds.y - (state.height - bounds.height) / 2,
            }));
        },
        [setViewbox]
    );

    const zoomIn = useCallback(() => {
        const svgElement = document
            .getElementsByClassName("graph__viewport")
            .item(0) as SVGSVGElement;
        if (!svgElement) return;

        const svgDimensions = svgElement.getBoundingClientRect();
        const centerPosition = {
            x: svgDimensions.width / 2,
            y: svgDimensions.height / 2,
        };

        const SCALE_FACTOR = 1.1;
        const currentScale = Math.min(zoom * SCALE_FACTOR, maxZoom);
        const allowZoomIn = SCALE_FACTOR > 1 && currentScale < maxZoom;

        setZoom(currentScale);
        setViewbox((viewbox) =>
            allowZoomIn
                ? zoomUtil(viewbox, SCALE_FACTOR, centerPosition, svgDimensions)
                : viewbox
        );
    }, [zoom, setZoom, setViewbox, maxZoom]);

    const zoomOut = useCallback(() => {
        const svgElement = document
            .getElementsByClassName("graph__viewport")
            .item(0) as SVGSVGElement;
        if (!svgElement) return;

        const svgDimensions = svgElement.getBoundingClientRect();
        const centerPosition = {
            x: svgDimensions.width / 2,
            y: svgDimensions.height / 2,
        };

        const SCALE_FACTOR = 1 / 1.1;
        const currentScale = Math.max(zoom * SCALE_FACTOR, minZoom);
        const allowZoomOut = SCALE_FACTOR < 1 && currentScale > minZoom;

        setZoom(currentScale);
        setViewbox((viewbox) =>
            allowZoomOut
                ? zoomUtil(viewbox, SCALE_FACTOR, centerPosition, svgDimensions)
                : viewbox
        );
    }, [zoom, setZoom, setViewbox, minZoom]);

    return {
        viewbox,
        zoom,
        minZoom,
        maxZoom,
        setViewbox,
        setZoom,
        getBounds,
        fitBounds,
        centerViewbox,
        zoomIn,
        zoomOut,
    };
};
