import { getEntries, getTags } from "@/actions/entry";
import { getUserSettings } from "@/actions/user";
import { Feed } from "@/components/journal/feed";
import { EntryDialog } from "@/components/journal/entry-dialog";

export default async function Home() {
    const [{ data: initialEntries, total }, tags, settings] = await Promise.all([
        getEntries(1, "", true),
        getTags(),
        getUserSettings()
    ]);

    return (
        <main className="container mx-auto py-8 max-w-3xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Entrées</h1>
                <EntryDialog />
            </div>
            <Feed
                initialEntries={initialEntries}
                initialTotal={total}
                itemsPerPage={settings.itemsPerPage}
                availableTags={tags}
            />
        </main>
    );
}