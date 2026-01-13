import { getStatsData, getEntryDates, getCounter } from "@/actions/stats";
import { SleepChart } from "@/components/stats/sleep-chart";
import { ScreenTimeChart } from "@/components/stats/screen-time-chart";
import { EntryCalendar } from "@/components/stats/entry-calendar";
import { Counter } from "@/components/stats/counter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function StatsPage() {
    const [entries, entryDates, counterValue] = await Promise.all([
        getStatsData(),
        getEntryDates(),
        getCounter()
    ]);

    return (
        <main className="container mx-auto py-8 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Statistiques</h1>
            </div>

            <div className="grid gap-8">
                {/* Counter */}
                <Card>
                    <CardHeader>
                        <CardTitle>Compteur</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Counter initialValue={counterValue} />
                    </CardContent>
                </Card>

                {/* Sleep/Wake Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Heures de sommeil</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <SleepChart entries={entries} />
                    </CardContent>
                </Card>

                {/* Screen Time Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Temps d'écran moyen par semaine</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ScreenTimeChart entries={entries} />
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
