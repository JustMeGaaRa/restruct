import { createContext, FC, PropsWithChildren, useCallback, useContext, useMemo, useRef } from "react";
import { calculateAbsolutePosition } from "../utils";
import { useViewport } from "../containers";

export const Box: FC<PropsWithChildren<{
    id?: string;
    className?: string;
    position?: { x: number; y: number };
    onMouseOver?: (event: React.MouseEvent<SVGGraphicsElement>) => void;
    onMouseOut?: (event: React.MouseEvent<SVGGraphicsElement>) => void;
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
        return calculateAbsolutePosition(viewbox, zoom, domNode?.current);
    }, [domNode, viewbox, zoom]);

    return {
        domNode,
        getRelativePosition,
        getAbsolutePosition,
    };
};
