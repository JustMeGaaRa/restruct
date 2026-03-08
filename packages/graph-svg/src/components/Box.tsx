/* eslint-disable react/display-name */
import { forwardRef, PropsWithChildren } from "react";

export const Box = forwardRef<
    SVGGraphicsElement,
    PropsWithChildren<{
        id?: string;
        className?: string;
        position?: { x: number; y: number };
        onMouseEnter?: React.MouseEventHandler<SVGGraphicsElement>;
        onMouseLeave?: React.MouseEventHandler<SVGGraphicsElement>;
    }>
>(({ children, id, className, position, onMouseEnter, onMouseLeave }, ref) => {
    return (
        <g
            ref={ref}
            id={id}
            className={className}
            transform={`translate(${position?.x ?? 0}, ${position?.y ?? 0})`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </g>
    );
});
