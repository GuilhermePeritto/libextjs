import { ExtComponent } from "@/components/ext-component";
import { Code } from "lucide-react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface ComponentCardProps {
  componente: {
    id: string;
    nome: string;
    descricao: string;
    comoUsar: string;
    componente: any;
    autor: string;
    ultimaModificacao: string;
    pasta?: string;
  };
}

export function ComponentCard({ componente }: ComponentCardProps) {
  const router = useRouter();

  return (
    <Card
      className="overflow-hidden h-full flex flex-col transition-all duration-200 hover:shadow-md cursor-pointer border-muted/60 hover:border-primary/20"
      onClick={() => router.push(`/components/${componente.id}`)}
    >
      <CardHeader className="pb-2 space-y-0">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-none">{componente.nome}</h3>
            <p className="text-sm text-muted-foreground">por {componente.autor}</p>
          </div>
          <Badge variant="secondary" className="text-xs font-normal">
            {componente.pasta || "Sem categoria"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-0 px-4">
        <div className="bg-muted/40 rounded-md p-4 h-48 flex items-center justify-center overflow-hidden cursor-default">
          <div className="transform scale-75 w-full">
            <ExtComponent
              componentDefinition={componente.componente}
              componentUsage={componente.comoUsar}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-4 pb-4 px-4 border-t text-xs text-muted-foreground">
        <span>{componente.ultimaModificacao}</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="h-6 px-2 text-xs font-normal">
                  <Code className="h-3 w-3 mr-1" />
                  Detalhes
                </Badge>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ver detalhes completos</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}