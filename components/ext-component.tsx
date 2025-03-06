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
            // Cria os parâmetros da URL
            const queryParams = new URLSearchParams({
                componentDefinition: componentDefinition || '', // Não é necessário encodeURIComponent
                componentUsage: componentUsage // Não é necessário encodeURIComponent
            }).toString();

            // Define a URL da API do Next.js
            const url = `/api/ext?${queryParams}`;
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