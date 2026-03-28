import { FC, SVGProps, useMemo } from "react";

export interface TextProps extends SVGProps<SVGTextElement> {
    noLines?: number;
    width?: number;
}

const CHAR_WIDTH_FACTOR = 0.5;

export const Text: FC<TextProps> = ({
    noLines = 1,
    children,
    width,
    fontSize,
    x,
    y,
    ...props
}) => {
    const finalLines = useMemo(() => {
        const originalText = children ? String(children) : "";
        if (!originalText || typeof width !== "number") {
            return [originalText];
        }

        const numericFontSize =
            (typeof fontSize === "number"
                ? fontSize
                : parseFloat(String(fontSize))) ||
            (typeof props.style?.fontSize === "number"
                ? props.style.fontSize
                : parseFloat(String(props.style?.fontSize))) ||
            12;

        const safeWidth = width - 4; // Buffer to prevent edge clipping

        const estimateWidth = (text: string) =>
            text.length * numericFontSize * CHAR_WIDTH_FACTOR;

        const truncateLine = (text: string): string => {
            if (estimateWidth(text) <= safeWidth) return text;

            let truncated = text;
            while (
                truncated.length > 0 &&
                estimateWidth(truncated + "...") > safeWidth
            ) {
                truncated = truncated.slice(0, -1);
            }
            return truncated.length > 0 ? truncated + "..." : "...";
        };

        const words = originalText.split(" ");
        const lines: string[] = [];
        let currentLine = words[0] ?? "";

        for (let i = 1; i < words.length; i++) {
            const word = words[i] ?? "";
            const testLine = currentLine + " " + word;

            if (estimateWidth(testLine) > safeWidth) {
                if (lines.length + 1 === noLines) {
                    const remaining = words.slice(i).join(" ");
                    const fullLastLine = currentLine + " " + remaining;
                    currentLine = truncateLine(fullLastLine);
                    break;
                }

                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine);

        return lines.map((line) => {
            if (estimateWidth(line) > safeWidth) {
                return truncateLine(line);
            }
            return line;
        });
    }, [children, width, noLines, fontSize, props.style?.fontSize]);

    return (
        <text
            x={x}
            y={y}
            {...props}
            fontSize={fontSize}
            style={{ fontSize: fontSize }}
        >
            {finalLines.map((line, index) => (
                <tspan key={index} x={x} dy={index === 0 ? 0 : "1.2em"}>
                    {line}
                </tspan>
            ))}
        </text>
    );
};
