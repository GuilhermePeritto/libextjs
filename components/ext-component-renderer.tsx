"use client"

import { useEffect, useRef } from "react"

interface ExtComponentRendererProps {
    extCode: string // Código ExtJS como string
}

export const ExtComponentRenderer = ({ extCode }: ExtComponentRendererProps) => {
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://desenvuseall.useall.com.br/useallux/ext-all-7.8.0.js?d=010119000000";
        script.async = true;
        document.head.appendChild(script);

        return () => {
            document.head.removeChild(script);
        };
    }, []);

    useEffect(() => {
        if (containerRef.current && typeof window !== "undefined" && window.Ext) {
            try {
                // Limpa o conteúdo do container antes de renderizar
                containerRef.current.innerHTML = ""

                // Executa o código ExtJS dinamicamente
                const executeExtCode = new Function(`
          const container = arguments[0];
          ${extCode.replace("Ext.getBody()", "container")}
        `)
                executeExtCode(containerRef.current)
            } catch (error) {
                console.error("Erro ao executar o código ExtJS:", error)
            }
        }
    }, [extCode])

    return <div ref={containerRef}></div>
}