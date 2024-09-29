import {
    FC,
    PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { BackgroundDotPattern } from "./BackgroundDotPattern";
import { BackgroundType } from "./BackgroundType";
import { MarkerArrowClosed } from "./MarkerArrowClosed";
import { MarkerCircleOutline } from "./MarkerCircleOutline";
import { useViewport } from "../containers";

function getPointFromEvent(event: any) {
    var point = { x: 0, y: 0 };

    if (event.targetTouches) {
        point.x = event.targetTouches[0].clientX;
        point.y = event.targetTouches[0].clientY;
    }
    else {
        point.x = event.clientX;
        point.y = event.clientY;
    }

    return point;
}

export const Viewport: FC<PropsWithChildren> = ({ children }) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [isPointerDown, setIsPointerDown] = useState(false);
    const [pointerOrigin, setPointerOrigin] = useState({ x: 0, y: 0 });
    const { zoom, viewbox, setZoom, setViewbox } = useViewport();

    useEffect(() => {
        if (!svgRef.current) return;

        const element = svgRef.current;
        const resizeObserver = new ResizeObserver((entries) => {
            const target = entries.at(0);
            if (!target) return;

            setViewbox((prev) => ({
                ...prev,
                height: target.contentRect.height,
                width: target.contentRect.width,
            }));
        });
        resizeObserver.observe(element);

        return () => {
            resizeObserver.unobserve(element);
            resizeObserver.disconnect();
        };
    }, [setViewbox, svgRef]);

    const handleOnPointerDown = useCallback((event: any) => {
        const pointerTarget = getPointFromEvent(event);
        setIsPointerDown(true);
        setPointerOrigin(pointerTarget);
    }, []);

    const handleOnPointerUp = useCallback((event: any) => {
        setIsPointerDown(false);
    }, []);

    const handleOnPointerMove = useCallback((event: any) => {
        if (!isPointerDown || !svgRef.current) return;

        event.preventDefault();
        const pointerTarget = getPointFromEvent(event);

        setViewbox((prev) => ({
            ...prev,
            x: prev.x - (pointerTarget.x - pointerOrigin.x), // * zoom
            y: prev.y - (pointerTarget.y - pointerOrigin.y), // * zoom
        }));
        setPointerOrigin(pointerTarget);
    }, [setViewbox, isPointerDown, pointerOrigin.x, pointerOrigin.y]);

    const handleOnWheel = useCallback((event: any) => {
        // TODO: zooming center should be where the cursor is
        if (!svgRef?.current) return;

        event.preventDefault();
        const zoomIntensity = 0.1;
        const deltaScale = Math.pow(1 + zoomIntensity, event.deltaY / 100);

        // Get cursor position relative to the SVG element
        const rect = svgRef.current.getBoundingClientRect();
        const cursorX = event.clientX - rect.left;
        const cursorY = event.clientY - rect.top;

        // Calculate new viewBox dimensions
        const newWidth = viewbox.width * deltaScale;
        const newHeight = viewbox.height * deltaScale;
        const newX = viewbox.x + (cursorX - viewbox.x) * (1 - deltaScale);
        const newY = viewbox.y + (cursorY - viewbox.y) * (1 - deltaScale);

        // Update viewBox with new values
        // setViewbox({ x: newX, y: newY, width: newWidth, height: newHeight });
        setZoom((scale) => scale / deltaScale);
    }, [setZoom, viewbox.height, viewbox.width, viewbox.x, viewbox.y]);

    return (
        <svg
            ref={svgRef}
            className={"structurizr__viewport"}
            cursor={"grab"}
            height={"100%"}
            width={"100%"}
            style={{
                backgroundColor: "#292B2C",
                position: "absolute",
                top: "0px",
                left: "0px",
            }}
            viewBox={`${viewbox.x} ${viewbox.y} ${viewbox.width} ${viewbox.height}`}
            onMouseDown={handleOnPointerDown}
            onMouseUp={handleOnPointerUp}
            onMouseMove={handleOnPointerMove}
            onTouchStart={handleOnPointerDown}
            onTouchEnd={handleOnPointerUp}
            onTouchMove={handleOnPointerMove}
            onWheel={handleOnWheel}
        >
            <defs>
                <BackgroundDotPattern />
                <MarkerArrowClosed />
                <MarkerCircleOutline />
            </defs>
            <g className={"structurizr__viewport-zoom"} transform={`scale(${zoom})`}>
                {children}
            </g>
        </svg>
    );
};
