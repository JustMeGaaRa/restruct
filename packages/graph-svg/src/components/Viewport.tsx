import {
    FC,
    PropsWithChildren,
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";
import { BackgroundDotPattern } from "./BackgroundDotPattern";
import { MarkerArrowClosed } from "./MarkerArrowClosed";
import { MarkerCircleOutline } from "./MarkerCircleOutline";
import { useViewport } from "./ViewportProvider";
import { getContentScale, pan, zoom } from "../utils";

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

export const Viewport: FC<PropsWithChildren<{
    minZoom?: number;
    maxZoom?: number;
}>> = ({
    children,
    minZoom = 0.1,
    maxZoom = 4
}) => {
        const svgRef = useRef<SVGSVGElement>(null);
        const groupRef = useRef<SVGSVGElement>(null);
        const [isPointerDown, setIsPointerDown] = useState(false);
        const [pointerOrigin, setPointerOrigin] = useState({ x: 0, y: 0 });
        const { viewbox, setZoom, setViewbox } = useViewport();

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

            // NOTE: track mouseup event on window to prevent pointer lock
            // eslint-disable-next-line no-undef
            window.addEventListener("mouseup", handleOnPointerUp);

            return () => {
                resizeObserver.unobserve(element);
                resizeObserver.disconnect();

                // eslint-disable-next-line no-undef
                window.removeEventListener("mouseup", handleOnPointerUp);
            };
        }, [setViewbox, svgRef]);

        const handleOnPointerDown = useCallback((event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
            const pointerTarget = getPointFromEvent(event);
            setIsPointerDown(true);
            setPointerOrigin(pointerTarget);
        }, []);

        const handleOnPointerUp = useCallback(() => {
            setIsPointerDown(false);
        }, []);

        const handleOnPointerMove = useCallback((event: React.MouseEvent<SVGSVGElement> | React.TouchEvent<SVGSVGElement>) => {
            if (!isPointerDown || !svgRef.current) return;

            event.preventDefault();

            const pointerTarget = getPointFromEvent(event);
            const pointerDelta = {
                dx: pointerTarget.x - pointerOrigin.x,
                dy: pointerTarget.y - pointerOrigin.y
            }
            const svgDimensions = svgRef.current.getBoundingClientRect();
            const svgSize = { width: svgDimensions.width, height: svgDimensions.height };

            setPointerOrigin(pointerTarget);
            setViewbox((viewbox) => pan(viewbox, pointerDelta, svgSize));
        }, [setViewbox, svgRef, isPointerDown, pointerOrigin.x, pointerOrigin.y]);

        const handleOnWheel = useCallback((event: React.WheelEvent<SVGSVGElement>) => {
            if (!svgRef?.current) return viewbox;
            if (!groupRef?.current) return viewbox;

            event.preventDefault();

            const SCALE_FACTOR = 1.1;
            const scaleFactor = Math.pow(SCALE_FACTOR, (event.deltaY / 100) * (-1));
            const svgDimensions = svgRef.current.getBoundingClientRect();
            const contentOriginSize = groupRef.current.getBBox();
            const contentScaledSize = groupRef.current.getBoundingClientRect();
            const pointerPosition = {
                x: event.clientX - svgDimensions.left,
                y: event.clientY - svgDimensions.top
            };
            const currentScale = getContentScale(contentScaledSize, contentOriginSize);

            const allowZoomIn = scaleFactor > 1 && currentScale < maxZoom;
            const allowZoomOut = scaleFactor < 1 && currentScale > minZoom;

            setZoom(currentScale);
            setViewbox(viewbox => allowZoomIn || allowZoomOut
                ? zoom(viewbox, scaleFactor, pointerPosition, svgDimensions)
                : viewbox
            );
        }, [setViewbox, svgRef, groupRef]);

        return (
            <svg
                ref={svgRef}
                className={"structurizr__viewport"}
                cursor={"grab"}
                height={"100%"}
                width={"100%"}
                style={{
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
                <g ref={groupRef} className={"structurizr__viewport-content"}>
                    {children}
                </g>
            </svg>
        );
    };
