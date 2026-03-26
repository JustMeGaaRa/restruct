import React, { useState, useEffect, useRef, useCallback } from "react";
import type { ReactNode } from "react";

interface CarouselProps {
    pages: ReactNode[];
    pageLabels: string[];
}

export function Carousel({ pages, pageLabels }: CarouselProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = pages.length;
    const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const resetTimer = useCallback(() => {
        if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        autoPlayRef.current = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % totalPages);
        }, 10000);
    }, [totalPages]);

    useEffect(() => {
        resetTimer();
        return () => {
            if (autoPlayRef.current) clearInterval(autoPlayRef.current);
        };
    }, [resetTimer]);

    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);
    const [dragOffset, setDragOffset] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (x: number) => {
        setTouchStart(x);
        setIsDragging(true);
    };

    const handleDragMove = (x: number) => {
        if (!isDragging || touchStart === null) return;
        setTouchEnd(x);
        setDragOffset(x - touchStart);
    };

    const handleDragEnd = () => {
        if (touchStart === null || touchEnd === null) {
            setIsDragging(false);
            setTouchStart(null);
            setTouchEnd(null);
            setDragOffset(0);
            return;
        }

        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > 50;
        const isRightSwipe = distance < -50;

        if (isLeftSwipe) {
            setCurrentPage((prev) => (prev + 1) % totalPages);
        } else if (isRightSwipe) {
            setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
        }

        resetTimer();
        setIsDragging(false);
        setTouchStart(null);
        setTouchEnd(null);
        setDragOffset(0);
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full">
            {/* Page Labels */}
            <div className="flex items-center gap-4 text-white/40 font-mono text-xs tracking-widest uppercase transition-all duration-700">
                {pageLabels.map((label, idx) => (
                    <React.Fragment key={idx}>
                        <span
                            className={
                                currentPage === idx
                                    ? "text-primary font-bold"
                                    : ""
                            }
                        >
                            {label}
                        </span>
                        {idx < pageLabels.length - 1 && (
                            <div className="w-12 h-[1px] bg-white/10" />
                        )}
                    </React.Fragment>
                ))}
            </div>

            {/* Viewport */}
            <div
                className={`w-full relative select-none transition-all duration-300 ${isDragging ? "cursor-grabbing" : "cursor-grab"} overflow-hidden`}
                onTouchStart={(e) =>
                    handleDragStart(e.targetTouches[0].clientX)
                }
                onTouchMove={(e) => handleDragMove(e.targetTouches[0].clientX)}
                onTouchEnd={handleDragEnd}
                onMouseDown={(e) => handleDragStart(e.clientX)}
                onMouseMove={(e) => handleDragMove(e.clientX)}
                onMouseUp={handleDragEnd}
                onMouseLeave={() => isDragging && handleDragEnd()}
            >
                <div
                    className={`flex ${isDragging ? "" : "transition-transform duration-1000 ease-[var(--ease-premium)]"}`}
                    style={{
                        transform: `translateX(calc(-${currentPage * 100}% + ${dragOffset}px))`,
                    }}
                >
                    {pages.map((page, idx) => (
                        <div key={idx} className="w-full shrink-0 px-4">
                            {page}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center gap-3 mt-4">
                {pages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            setCurrentPage(index);
                            resetTimer();
                        }}
                        className={`h-1.5 transition-all duration-700 rounded-full ${
                            currentPage === index
                                ? "w-12 bg-primary"
                                : "w-4 bg-white/10 hover:bg-white/20"
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
