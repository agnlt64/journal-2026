import { getEntries } from "@/actions/entry";
import { Feed } from "@/components/journal/feed";

export default async function Home() {
    const { data: initialEntries } = await getEntries();

    return (
        <main className="container mx-auto py-8 max-w-3xl">
            <Feed initialEntries={initialEntries} />
        </main>
    );
}