import { FC, SVGProps, useLayoutEffect, useRef } from "react";

export const Text: FC<SVGProps<SVGTextElement>> = (props) => {
    const textRef = useRef<SVGTextElement>(null);

    useLayoutEffect(() => {
        // TODO: support the text word wrapping into multiple lines
        const truncateText = () => {
            const svgText = textRef.current;
            if (svgText && typeof props.width === "number" && svgText.getComputedTextLength() > props.width) {
                let truncatedText = props.children as string;
                while (
                    svgText.getComputedTextLength() > props.width &&
                    truncatedText.length > 0
                ) {
                    truncatedText = truncatedText.slice(0, -1);
                    svgText.textContent = truncatedText + "...";
                }
            }
        };

        truncateText();
    }, [props.children, props.width]);

    return (
        <text ref={textRef} {...props}>
            {props.children}
        </text>
    );
};
