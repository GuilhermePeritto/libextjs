import { useEffect, useState } from "react";

interface ExtComponentProps {
    componentUsage?: string;
    componentDefinition?: string;
    className?: string;
}

export function ExtComponent({ className = "", componentUsage, componentDefinition }: ExtComponentProps) {
    const [iframeSrc, setIframeSrc] = useState<string | null>(null);

    useEffect(() => {
        if (componentUsage) {
            const queryParams = new URLSearchParams({
                componentDefinition: encodeURIComponent(componentDefinition || ''),
                componentUsage: encodeURIComponent(componentUsage)
            }).toString();

            const url = `http://localhost:6969/ext-page?${queryParams}`;
            setIframeSrc(url);
        }
    }, [componentUsage, componentDefinition]);

    if (!iframeSrc) {
        return (
            <div className="animate-pulse bg-muted h-[20rem] flex items-center justify-center">
                Loading ExtJS Component...
            </div>
        );
    }

    return (
        <div className={`w-full h-[20rem] flex items-center justify-center border rounded-md ${className}`}>
            <iframe
                src={iframeSrc}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
                title="ExtJS Component"
            />
        </div>
    );
}