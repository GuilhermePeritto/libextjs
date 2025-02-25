"use client"

import { useExt } from "@/contexts/ext-context";
import { useExtComponent } from "@/hooks/use-ext-component";
import { useEffect, useRef } from "react";

interface ExtComponentProps {
    componentUsage?: string;
    componentDefinition?: string;
    xtype?: string;
    config?: any;
    className?: string;
    onReady?: (component: any) => void;
    onError?: (error: Error) => void;
}

export function ExtComponent({ className = "", onReady, onError, ...props }: ExtComponentProps) {
    const { isExtLoaded, 
        error: contextError,
        temaExt,
        temaExt1,
        temaExt2,
        temaExt3,
        temaExt4 } = useExt();
    const { containerRef, error } = useExtComponent({ ...props, onReady, onError });
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hostRef.current && isExtLoaded) {
            // Verifica se o elemento já possui um Shadow DOM
            if (!hostRef.current.shadowRoot) {
                // Cria um Shadow DOM para isolar completamente o componente
                const shadowRoot = hostRef.current.attachShadow({ mode: "open" });

                // Cria um container dentro do Shadow DOM
                const container = document.createElement("div");
                container.style.width = "100%";
                container.style.height = "100%";
                container.classList.add("extjs-container"); // Adiciona uma classe ao container
                shadowRoot.appendChild(container);

                // Adiciona os estilos dos temas ao Shadow DOM
                if (temaExt) shadowRoot.appendChild(temaExt);
                if (temaExt1) shadowRoot.appendChild(temaExt1);
                if (temaExt2) shadowRoot.appendChild(temaExt2);
                if (temaExt3) shadowRoot.appendChild(temaExt3);
                if (temaExt4) shadowRoot.appendChild(temaExt4);

                // Aponta o containerRef para o container no Shadow DOM
                containerRef.current = container;
            } else {
                // Se o Shadow DOM já existe, apenas atualiza o containerRef
                containerRef.current = hostRef.current.shadowRoot.querySelector(".extjs-container");
            }
        }
    }, [isExtLoaded, containerRef, temaExt, temaExt1, temaExt2, temaExt3, temaExt4]);

    if (contextError || error) {
        return (
            <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                Error: {(contextError || error)?.message}
            </div>
        );
    }

    if (!isExtLoaded) {
        return (
            <div className="animate-pulse bg-muted h-[200px] flex items-center justify-center">
                Loading ExtJS Component...
            </div>
        );
    }

    return <div ref={hostRef} className={`extjs-container ${className}`} />;
}