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

  useEffect(() => {
    const loadExtJS = async () => {
      try {
        // Load CSS first
        const linkEl = document.createElement("link")
        linkEl.rel = "stylesheet"
        linkEl.href = `https://cdn.sencha.com/ext/commercial/${extJsVersion}/build/classic/theme-${theme}/resources/theme-${theme}-all.css`
        document.head.appendChild(linkEl)

        // Load ExtJS core
        const extCore = document.createElement("script")
        extCore.src = `https://cdn.sencha.com/ext/commercial/${extJsVersion}/build/ext-all.js`
        document.head.appendChild(extCore)

        // Wait for core to load before loading theme
        extCore.onload = () => {
          const extTheme = document.createElement("script")
          extTheme.src = `https://cdn.sencha.com/ext/commercial/${extJsVersion}/build/classic/theme-${theme}/theme-${theme}.js`
          document.head.appendChild(extTheme)

          // Set loaded state when theme is ready
          extTheme.onload = () => {
            // Initialize base Use namespace if it doesn't exist
            if (!(window as any).Use) {
              ;(window as any).Use = {
                button: {},
                config: {
                  user: {
                    codigoUsuario: "123",
                  },
                },
                Msg: {
                  alert: (title: string, msg: string) => {
                    alert(`${title}: ${msg}`)
                  },
                },
              }
            }

            // Define base button class
            const Ext = (window as any).Ext
            Ext.define("Use.button.Button", {
              extend: "Ext.button.Button",
              alias: "widget.use-button",
            })

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