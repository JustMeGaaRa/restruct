import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useRef } from "react";
import { getAbsoluteOrDefault } from "../utils";
import { useViewport } from "./ViewportProvider";

export const Box: FC<PropsWithChildren<{
    id?: string;
    className?: string;
    position?: { x: number; y: number };
    onMouseOver?: React.MouseEventHandler<SVGGraphicsElement>;
    onMouseOut?: React.MouseEventHandler<SVGGraphicsElement>;
}>> = ({
    children,
    id,
    className,
    position,
    onMouseOver,
    onMouseOut
}) => {
        const domNode = useRef<SVGGraphicsElement>(null);
        const transform = useMemo(() => position && `translate(${position.x}, ${position.y})`, [position]);

        return (
            <BoxContext.Provider value={{ domNode }}>
                <g
                    ref={domNode}
                    id={id}
                    className={className}
                    transform={transform}
                    onMouseOver={onMouseOver}
                    onMouseOut={onMouseOut}
                >
                    {children}
                </g>
            </BoxContext.Provider>
        )
    };

export const BoxContext = createContext<{
    domNode: React.RefObject<SVGGraphicsElement> | null;
}>({
    domNode: null
});

export const useBox = () => {
    const { domNode } = useContext(BoxContext);
    const { zoom, viewbox } = useViewport();

    const getRelativePosition = useCallback(() => {
        const bbox = domNode?.current?.getBBox();
        return { x: bbox?.x || 0, y: bbox?.y || 0 };
    }, [domNode]);

    const getAbsolutePosition = useCallback(() => {
        if (!domNode?.current) return { x: 0, y: 0 };
        const bbox = domNode?.current?.getBBox();
        const dimensions = { x: bbox.x, y: bbox.y, width: bbox?.width || 0, height: bbox?.height || 0 };
        return getAbsoluteOrDefault(domNode?.current, dimensions);
    }, [domNode, viewbox, zoom]);

    return {
        domNode,
        getRelativePosition,
        getAbsolutePosition,
    };
};
