import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Hexagon, Diamond } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

export function AuthGate() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: authError } =
        mode === "login"
          ? await authClient.signIn.email({ email, password })
          : await authClient.signUp.email({ email, password, name });

      if (authError) {
        setError(authError.message ?? "Échec de l'authentification");
        return;
      }
      await router.invalidate();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setSubmitting(false);
    }
  }

  function switchMode() {
    setMode(mode === "login" ? "signup" : "login");
    setError(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.85)] backdrop-blur-md p-4">
      <div
        className={cn(
          "relative w-[min(420px,100%)] overflow-hidden rounded-2xl p-8",
          "bg-[rgba(5,5,8,0.95)] border border-[rgba(0,245,255,0.2)]",
          "shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_30px_rgba(0,245,255,0.1)]",
        )}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-[#00f5ff] to-transparent opacity-60" />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="relative">
            <Hexagon className="w-8 h-8 text-[#00f5ff] stroke-[1.5]" />
            <Diamond className="w-4 h-4 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="flex flex-col">
            <span className="font-(family-name:--font-display) text-xl font-bold tracking-[0.2em] text-white">
              VOID
            </span>
            <span className="text-[10px] text-[rgba(0,245,255,0.6)] tracking-[0.3em] uppercase">
              Journal 2026
            </span>
          </div>
        </div>

        <h2 className="font-(family-name:--font-display) text-2xl tracking-wider text-white mb-1">
          {mode === "login" ? "CONNEXION" : "CRÉER UN COMPTE"}
        </h2>
        <p className="text-xs text-[rgba(255,255,255,0.4)] mb-6">
          {mode === "login"
            ? "Accédez à votre espace personnel."
            : "Commencez votre journal."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">
                Nom
              </Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">
              Email
            </Label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] text-[rgba(0,245,255,0.6)] uppercase tracking-[0.2em]">
              Mot de passe
            </Label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="rounded-xl bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.08)] text-white"
            />
            {mode === "signup" && (
              <p className="text-[10px] text-[rgba(255,255,255,0.4)]">
                8 caractères minimum.
              </p>
            )}
          </div>

          {error && (
            <p className="text-xs text-[#ff3864] border border-[rgba(255,56,100,0.3)] bg-[rgba(255,56,100,0.05)] rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={submitting}
            className={cn(
              "w-full rounded-xl h-11",
              "bg-[rgba(0,245,255,0.15)] text-[#00f5ff] border border-[rgba(0,245,255,0.4)]",
              "hover:bg-[rgba(0,245,255,0.25)] hover:shadow-[0_0_30px_rgba(0,245,255,0.2)]",
              "transition-all duration-300 tracking-wider",
            )}
          >
            {submitting
              ? "..."
              : mode === "login"
                ? "SE CONNECTER"
                : "CRÉER LE COMPTE"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={switchMode}
            className="text-xs text-[rgba(255,255,255,0.5)] hover:text-[#00f5ff] transition-colors"
          >
            {mode === "login"
              ? "Pas encore de compte ? Créer un compte"
              : "Déjà inscrit ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
