import { getStatsData, getEntryDates } from "@/actions/stats";
import { SleepChart } from "@/components/stats/sleep-chart";
import { EntryCalendar } from "@/components/stats/entry-calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StatsPage() {
    const [entries, entryDates] = await Promise.all([
        getStatsData(),
        getEntryDates()
    ]);

    return (
        <main className="container mx-auto py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Statistiques</h1>
            </div>

            <div className="grid gap-8">
                {/* Sleep/Wake Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Heures de sommeil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SleepChart entries={entries} />
                    </CardContent>
                </Card>

                {/* Entry Calendar */}
                <Card>
                    <CardHeader>
                        <CardTitle>Calendrier des entrées</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EntryCalendar entryDates={entryDates} />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
