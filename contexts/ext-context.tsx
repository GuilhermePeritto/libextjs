"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface ExtContextType {
    isExtLoaded: boolean
    error: Error | null
}

const ExtContext = createContext<ExtContextType>({
    isExtLoaded: false,
    error: null,
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

    const useExtAllUrl = 'https://desenvuseall.useall.com.br/useallux/ext-all-7.8.0.js?d=010119000000'
    const useExtCoreUrl = 'https://desenvuseall.useall.com.br/useallux/useall-core-7.8.1.js?d=010119000000'

    useEffect(() => {
        const loadExtJS = async () => {
            try {
                // Load ExtJS core
                const ExtAll = document.createElement("script")
                ExtAll.src = useExtAllUrl || `https://cdn.sencha.com/ext/commercial/${extJsVersion}/build/ext-all.js`
                document.head.appendChild(ExtAll)

                // Wait for core to load before loading theme
                ExtAll.onload = () => {
                    window.requirejs = window.requirejs || function() {
                        console.warn("RequireJS foi chamado, mas não existe. Retornando um mock.");

                        return {
                        };
                    }

                    window.UseConfig = window.UseConfig || function() {
                        console.warn("UseConfig foi chamado, mas não existe. Retornando um mock.");
                        
                        return {
                            loadCssPaths: function(paths) {
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
            }}
        >
            {children}
        </ExtContext.Provider>
    )
}