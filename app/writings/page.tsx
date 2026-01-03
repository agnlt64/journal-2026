import { getWritings } from "@/actions/writing";
import { WritingDialog } from "@/components/journal/writing-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function WritingsPage() {
    const writings = await getWritings();

    return (
        <main className="container mx-auto py-8 max-w-3xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Reflections</h1>
                <WritingDialog />
            </div>

            <div className="grid gap-4">
                {writings.map((w: any) => (
                    <Card key={w.id}>
                        <CardHeader>
                            <CardTitle>{w.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="whitespace-pre-wrap text-muted-foreground">
                            {w.content}
                        </CardContent>
                    </Card>
                ))}
                {writings.length === 0 && (
                    <p className="text-center text-muted-foreground">No reflections yet.</p>
                )}
            </div>
        </main>
    );
}
