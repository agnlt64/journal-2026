import { getWritings } from "@/actions/writing";
import { WritingDialog } from "@/components/journal/writing-dialog";
import { Feather, Sparkles, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default async function WritingsPage() {
    const writings = await getWritings();

    return (
        <div className="max-w-3xl mx-auto">
            {/* Hero Section */}
            <header className="mb-12 relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[rgba(184,41,221,0.03)] rounded-full blur-2xl" />
                <div className="absolute top-8 right-0 w-32 h-32 bg-[rgba(0,245,255,0.03)] rounded-full blur-2xl" />
                
                <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-px bg-gradient-to-r from-[#b829dd] to-transparent" />
                        <span className="text-[10px] font-medium tracking-[0.3em] text-[rgba(184,41,221,0.6)] uppercase">
                            Deep Thoughts
                        </span>
                    </div>
                    
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[#888888] text-sm mb-1 tracking-wide uppercase">Deep Thoughts & Ideas</p>
                        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold text-[#f5f0e8]">
                            Reflections
                        </h1>
                    </div>
                    <WritingDialog>
                        <button
                            className={cn(
                                "relative overflow-hidden rounded-xl px-6 py-3",
                                "bg-transparent border border-[rgba(0,245,255,0.5)]",
                                "text-[#00f5ff] font-medium tracking-wider text-sm",
                                "hover:bg-[rgba(0,245,255,0.1)] hover:border-[#00f5ff]",
                                "hover:shadow-[0_0_30px_rgba(0,245,255,0.3)]",
                                "transition-all duration-500 group"
                            )}
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(0,245,255,0.1)] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            <span className="relative z-10 flex items-center">
                                <Plus className="w-4 h-4 mr-2" />
                                NEW REFLECTION
                            </span>
                        </button>
                    </WritingDialog>
                </div>
                    
                    <div className="flex items-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[rgba(184,41,221,0.6)]" />
                            <span className="text-sm text-[rgba(255,255,255,0.5)]">
                                {writings.length} <span className="text-[rgba(255,255,255,0.3)]">reflections recorded</span>
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Writings Grid */}
            <div className="space-y-6">
                {writings.map((w: any, index: number) => (
                    <article
                        key={w.id}
                        className={cn(
                            "group relative rounded-2xl transition-all duration-500 overflow-hidden",
                            "bg-[rgba(10,10,18,0.5)] border border-[rgba(184,41,221,0.1)]",
                            "hover:border-[rgba(184,41,221,0.3)] hover:shadow-[0_0_40px_rgba(184,41,221,0.1)]",
                            "animate-fade-in-up"
                        )}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Top gradient line */}
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[rgba(184,41,221,0.4)] to-transparent" />
                        
                        <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Feather className="w-4 h-4 text-[rgba(184,41,221,0.6)]" />
                                <span className="text-[10px] text-[rgba(255,255,255,0.4)] tracking-[0.2em] uppercase">
                                    {format(new Date(w.createdAt), "MMMM d, yyyy")}
                                </span>
                            </div>
                            
                            <h3 className="font-[family-name:var(--font-display)] text-xl font-medium text-white mb-3 tracking-wide">
                                {w.title}
                            </h3>
                            
                            <div className="text-[rgba(255,255,255,0.7)] leading-relaxed whitespace-pre-wrap">
                                {w.content}
                            </div>
                        </div>
                    </article>
                ))}
                
                {writings.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(184,41,221,0.02)] to-transparent rounded-3xl" />
                        <div className="relative w-24 h-24 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] flex items-center justify-center mb-6">
                            <Feather className="w-10 h-10 text-[rgba(184,41,221,0.4)]" />
                        </div>
                        <h3 className="font-[family-name:var(--font-display)] text-2xl text-white mb-2 tracking-wider">
                            NO REFLECTIONS
                        </h3>
                        <p className="text-[rgba(255,255,255,0.4)] text-sm max-w-md">
                            Capture your deeper thoughts and ideas. Reflections are perfect for long-form writing.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
