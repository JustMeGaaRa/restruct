import { FC, SVGProps, useLayoutEffect, useRef } from "react";

export const Text: FC<SVGProps<SVGTextElement> & { noLines?: number }> = ({
    noLines = 1,
    ...props
}) => {
    const textRef = useRef<SVGTextElement>(null);

    useLayoutEffect(() => {
        const svgText = textRef.current;
        if (!svgText || typeof props.width !== "number") return;

        const originalText = props.children ? String(props.children) : "";
        if (!originalText) return;

        svgText.textContent = originalText;

        const safeWidth = props.width - 4; // Buffer to prevent edge clipping

        if (svgText.getComputedTextLength() <= safeWidth) {
            return;
        }

        const truncateLine = (text: string): string => {
            svgText.textContent = text;
            if (svgText.getComputedTextLength() <= safeWidth) return text;

            let truncated = text;
            svgText.textContent = truncated + "...";
            while (
                truncated.length > 0 &&
                svgText.getComputedTextLength() > safeWidth
            ) {
                truncated = truncated.slice(0, -1);
                svgText.textContent = truncated + "...";
            }
            return truncated + "...";
        };

        const words = originalText.split(" ");
        const lines: string[] = [];
        let currentLine = words[0] ?? "";

        for (let i = 1; i < words.length; i++) {
            const word = words[i] ?? "";
            const testLine = currentLine + " " + word;

            svgText.textContent = testLine;
            if (svgText.getComputedTextLength() > safeWidth) {
                // Check if we can add a new line
                if (lines.length + 1 === noLines) {
                    // We are already at the limit. The current line IS the last line.
                    // We must stop and truncate EVERYTHING remaining into this line.
                    const remaining = words.slice(i).join(" ");
                    // Reconstruct the full text for the last line
                    const fullLastLine = currentLine + " " + remaining;
                    currentLine = truncateLine(fullLastLine);
                    break;
                }

                lines.push(currentLine); // Push current valid(ish) line
                currentLine = word; // Start new line
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);

        // Truncate any lines that exceed width (e.g. single long words)
        // Especially significant if noLines=1 and words=["superlong..."]
        const finalLines = lines.map((line) => {
            svgText.textContent = line;
            if (svgText.getComputedTextLength() > safeWidth) {
                return truncateLine(line);
            }
            return line;
        });

        // Render lines using tspans
        svgText.textContent = "";
        const x = String(props.x || 0);
        finalLines.forEach((line, index) => {
            const tspan = document.createElementNS(
                "http://www.w3.org/2000/svg",
                "tspan"
            );
            tspan.textContent = line;
            tspan.setAttribute("x", x);
            tspan.setAttribute("dy", index === 0 ? "0" : "1.2em");
            svgText.appendChild(tspan);
        });
    }, [props.children, props.width, noLines, props.x]);

    return (
        <text ref={textRef} {...props}>
            {props.children}
        </text>
    );
};
