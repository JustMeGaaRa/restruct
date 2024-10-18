import {
    createContext,
    FC,
    PropsWithChildren,
    SetStateAction,
    useCallback,
    useContext,
    useState,
} from "react";

export type Viewbox = { x: number; y: number; height: number; width: number };

export const ViewportContext = createContext<{
    zoom: number;
    viewbox: Viewbox;
    setZoom: React.Dispatch<SetStateAction<number>>;
    setViewbox: React.Dispatch<SetStateAction<Viewbox>>;
}>({
    zoom: 1,
    viewbox: {
        x: 0,
        y: 0,
        height: 1000,
        width: 1000,
    },
    setZoom: () => { },
    setViewbox: () => { },
});

export const ViewportProvider: FC<PropsWithChildren> = ({ children }) => {
    const [zoom, setZoom] = useState<number>(1);
    const [viewbox, setViewbox] = useState<Viewbox>({
        x: 0,
        y: 0,
        height: 1000,
        width: 1000,
    });

    return (
        <ViewportContext.Provider value={{ zoom, viewbox, setZoom, setViewbox }}>
            {children}
        </ViewportContext.Provider>
    );
};

export const useViewport = () => {
    const { viewbox, zoom, setViewbox, setZoom } = useContext(ViewportContext);

    const getBounds = useCallback(() => {
        // TODO: get a reference to the dom node of the viewport
        const htmlElement = document.getElementsByClassName("structurizr__viewport").item(0) as HTMLElement;
        if (!htmlElement) throw new Error("Element not found");
        return htmlElement instanceof SVGSVGElement
            ? (htmlElement as SVGSVGElement).getBBox()
            : htmlElement.getBoundingClientRect();
    }, []);

    const fitBounds = useCallback((bounds: DOMRect) => {
        const scale = Math.min(viewbox.height / bounds.height, viewbox.width / bounds.width);
        const scaledBounds = {
            x: bounds.x * scale,
            y: bounds.y * scale,
            height: bounds.height * scale,
            width: bounds.width * scale
        };
        const offsetX = (viewbox.width - scaledBounds.width) / 2;
        const offsetY = (viewbox.height - scaledBounds.height) / 2;
        const centeredBounds = {
            ...scaledBounds,
            x: scaledBounds.x - offsetX,
            y: scaledBounds.y - offsetY
        };
        setViewbox((state) => ({ ...state, x: centeredBounds.x, y: centeredBounds.y }));
        setZoom(scale);
    }, [setViewbox, setZoom, viewbox.height, viewbox.width]);

    const centerViewbox = useCallback((bounds: DOMRect) => {
        setViewbox((state) => ({
            ...state,
            x: bounds.x - (state.width - bounds.width) / 2,
            y: bounds.y - (state.height - bounds.height) / 2
        }));
    }, [setViewbox]);

    return {
        viewbox,
        zoom,
        setViewbox,
        setZoom,
        getBounds,
        fitBounds,
        centerViewbox
    }
};
