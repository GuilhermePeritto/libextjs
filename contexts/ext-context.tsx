"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface ExtContextType {
    isExtLoaded: boolean
    error: Error | null
    temaExt: HTMLLinkElement | null
    temaExt1: HTMLLinkElement | null
    temaExt2: HTMLLinkElement | null
    temaExt3: HTMLLinkElement | null
    temaExt4: HTMLLinkElement | null
}

const ExtContext = createContext<ExtContextType>({
    isExtLoaded: false,
    error: null,
    temaExt: null,
    temaExt1: null,
    temaExt2: null,
    temaExt3: null,
    temaExt4: null
})

export function useExt() {
    return useContext(ExtContext)
}

interface ExtProviderProps {
    children: React.ReactNode
    extJsVersion?: string
    theme?: string
}

export function ExtProvider({ children, extJsVersion = "7.6.0", theme = "triton" }: ExtProviderProps) {
    const [isExtLoaded, setIsExtLoaded] = useState(false)
    const [error, setError] = useState<Error | null>(null)
    const [temaExt, setTemaExt] = useState<HTMLLinkElement | null>(null)
    const [temaExt1, setTemaExt1] = useState<HTMLLinkElement | null>(null)
    const [temaExt2, setTemaExt2] = useState<HTMLLinkElement | null>(null)
    const [temaExt3, setTemaExt3] = useState<HTMLLinkElement | null>(null)
    const [temaExt4, setTemaExt4] = useState<HTMLLinkElement | null>(null)

    const useExtAllUrl = 'https://desenvuseall.useall.com.br/useallux/ext-all-7.8.0.js?d=010119000000'
    const useExtCoreUrl = 'https://desenvuseall.useall.com.br/useallux/useall-core-7.8.1.js?d=010119000000'
    const temaExtUrlAll = 'https://desenvsb2.useall.com.br/servicos/resources/App-all.css?d=010119000000'
    const temaExtUrl_1 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_1.css'
    const temaExtUrl_2 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_2.css'
    const temaExtUrl_3 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_3.css'
    const temaExtUrl_4 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_4.css'


    useEffect(() => {
        const loadExtJS = async () => {
            try {
                // Load ExtJS core
                const ExtAll = document.createElement("script")
                ExtAll.src = useExtAllUrl || `https://cdn.sencha.com/ext/commercial/${extJsVersion}/build/ext-all.js`
                document.head.appendChild(ExtAll)

                // Wait for core to load before loading theme
                ExtAll.onload = () => {
                    window.requirejs = window.requirejs || function () {
                        console.warn("RequireJS foi chamado, mas não existe. Retornando um mock.");

                        return {
                        };
                    }

                    window.UseConfig = window.UseConfig || function () {
                        console.warn("UseConfig foi chamado, mas não existe. Retornando um mock.");

                        return {
                            loadCssPaths: function (paths) {
                                console.log("Mock de loadCssPaths chamado com:", paths);
                            }
                        };
                    };

                    window.Use = window.Use || {};

                    Use.config = new Proxy({}, {
                        get: (target, prop) => {
                            if (!(prop in target)) {
                                console.warn(`Interceptado: use.config.${prop} não existe. Retornando string vazia.`);
                                target[prop] = ""; // Retorna uma string vazia para evitar erro no .split()
                            }
                            return target[prop];
                        }
                    });

                    const extCore = document.createElement("script")
                    extCore.src = useExtCoreUrl || `https://cdn.sencha.com/ext/commercial/${extJsVersion}/build/classic/theme-${theme}/theme-${theme}.js`
                    document.head.appendChild(extCore)

                    extCore.onload = () => {

                        const linkTemaExt = document.createElement("link");
                        linkTemaExt.rel = "stylesheet";
                        linkTemaExt.href = temaExtUrlAll || `https://cdn.sencha.com/ext/commercial/7.6.0/build/classic/theme-triton/resources/theme-triton-all.css`;
                        setTemaExt(linkTemaExt)

                        const linkTemaExt1 = document.createElement("link");
                        linkTemaExt1.rel = "stylesheet";
                        linkTemaExt1.href = temaExtUrl_1
                        setTemaExt1(linkTemaExt1)

                        const linkTemaExt2 = document.createElement("link");
                        linkTemaExt2.rel = "stylesheet";
                        linkTemaExt2.href = temaExtUrl_2
                        setTemaExt2(linkTemaExt2)

                        const linkTemaExt3 = document.createElement("link");
                        linkTemaExt3.rel = "stylesheet";
                        linkTemaExt3.href = temaExtUrl_3
                        setTemaExt3(linkTemaExt3)

                        const linkTemaExt4 = document.createElement("link");
                        linkTemaExt4.rel = "stylesheet";
                        linkTemaExt4.href = temaExtUrl_4
                        setTemaExt4(linkTemaExt4)

                        setIsExtLoaded(true)
                        setError(null)
                    }
                }
            } catch (err) {
                const error = err instanceof Error ? err : new Error("Failed to load ExtJS")
                setError(error)
            }
        }

        loadExtJS()
    }, [extJsVersion, theme])

    return (
        <ExtContext.Provider
            value={{
                isExtLoaded,
                error,
                temaExt: temaExt,
                temaExt1: temaExt1,
                temaExt2: temaExt2,
                temaExt3: temaExt3,
                temaExt4: temaExt4
            }}
        >
            {children}
        </ExtContext.Provider>
    )
}