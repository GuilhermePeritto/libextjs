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
    const { isExtLoaded, error: contextError } = useExt();
    const { containerRef, error } = useExtComponent({ ...props, onReady, onError });
    const hostRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (hostRef.current && isExtLoaded) {
            // Cria um container para o ExtJS no DOM global
            const container = document.createElement("div");
            container.style.width = "100%";
            container.style.height = "100%";
            container.classList.add("extjs-container"); // Adiciona uma classe ao container
            hostRef.current.appendChild(container);

            // Injeta o CSS do ExtJS no DOM global, mas com escopo limitado ao container
            const style = document.createElement("style");
            style.textContent = `
        .extjs-container {
          all: initial; /* Reseta estilos para evitar conflitos */
        }
        .extjs-container * {
          box-sizing: border-box; /* Garante que o box-sizing seja consistente */
        }
      `;
            document.head.appendChild(style);

            const temaExtUrlAll = 'https://desenvsb2.useall.com.br/servicos/resources/App-all.css?d=010119000000'
            const temaExtUrl_1 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_1.css'
            const temaExtUrl_2 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_2.css'
            const temaExtUrl_3 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_3.css'
            const temaExtUrl_4 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_4.css'


            // Carrega o CSS do ExtJS
            const temaExt = document.createElement("link");
            temaExt.rel = "stylesheet";
            temaExt.href = temaExtUrlAll || `https://cdn.sencha.com/ext/commercial/7.6.0/build/classic/theme-triton/resources/theme-triton-all.css`;
            document.head.appendChild(temaExt);

            const temaExt_1 = document.createElement("link");
            temaExt_1.rel = "stylesheet";
            temaExt_1.href = temaExtUrl_1
            document.head.appendChild(temaExt_1);

            const temaExt_2 = document.createElement("link");
            temaExt_2.rel = "stylesheet";
            temaExt_2.href = temaExtUrl_2
            document.head.appendChild(temaExt_2);

            const temaExt_3 = document.createElement("link");
            temaExt_3.rel = "stylesheet";
            temaExt_3.href = temaExtUrl_3
            document.head.appendChild(temaExt_3);

            const temaExt_4 = document.createElement("link");
            temaExt_4.rel = "stylesheet";
            temaExt_4.href = temaExtUrl_4
            document.head.appendChild(temaExt_4);

            // Aponta o containerRef para o container no DOM global
            containerRef.current = container;
        }
    }, [isExtLoaded, containerRef]);

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