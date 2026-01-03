"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Header() {
    const pathname = usePathname();

    return (
        <header className="flex h-16 items-center justify-center border-b px-6">
            <div className="flex items-center gap-8">
                <h1 className="font-bold text-xl tracking-tight">Mon Journal</h1>
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link
                        href="/"
                        className={cn(
                            "transition-colors hover:text-foreground/80 cursor-pointer",
                            pathname === "/" ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        Entrées
                    </Link>
                    <Link
                        href="/writings"
                        className={cn(
                            "transition-colors hover:text-foreground/80 cursor-pointer",
                            pathname === "/writings" ? "text-foreground" : "text-foreground/60"
                        )}
                    >
                        Réflexions
                    </Link>
                </nav>
            </div>
        </header>
    );
}
