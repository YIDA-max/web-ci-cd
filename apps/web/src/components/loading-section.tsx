import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function LoadingSection({ text }: { text: string }) {
  return (
    <Card className="mt-4">
      <CardContent className="flex flex-col items-center gap-4 py-10">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
