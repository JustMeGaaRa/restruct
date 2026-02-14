/* eslint-disable react/display-name */
import { forwardRef, PropsWithChildren } from "react";

export const Box = forwardRef<
    SVGGraphicsElement,
    PropsWithChildren<{
        id?: string;
        className?: string;
        position?: { x: number; y: number };
        onMouseOver?: React.MouseEventHandler<SVGGraphicsElement>;
        onMouseOut?: React.MouseEventHandler<SVGGraphicsElement>;
    }>
>(({ children, id, className, position, onMouseOver, onMouseOut }, ref) => {
    return (
        <g
            ref={ref}
            id={id}
            className={className}
            transform={`translate(${position?.x ?? 0}, ${position?.y ?? 0})`}
            onMouseOver={onMouseOver}
            onMouseOut={onMouseOut}
        >
            {children}
        </g>
    );
});
