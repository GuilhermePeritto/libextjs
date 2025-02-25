import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateExtPage(componentDefinition: string, componentUsage: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ExtJS Component</title>
      <link rel="stylesheet" href="https://cdn.sencha.com/ext/commercial/7.6.0/build/classic/theme-triton/resources/theme-triton-all.css">
      <script src="https://cdn.sencha.com/ext/commercial/7.6.0/build/ext-all.js"></script>
      <script>
        Ext.onReady(function() {
          ${componentDefinition ? componentDefinition : ''}
          const componentConfig = ${componentUsage};
          Ext.create({
            ...componentConfig,
            renderTo: Ext.getBody()
          });
        });
      </script>
    </head>
    <body>
    </body>
    </html>
  `;
}