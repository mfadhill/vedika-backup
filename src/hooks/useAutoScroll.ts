import { useEffect, useRef } from "react";

export function useAutoScroll() {
    const ref = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    return ref;
}
