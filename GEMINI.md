CONTEXTE PROJET : Application de Journaling Next.js 15 (App Router), Prisma, Postgres, Tailwind/Shadcn UI.

RÈGLES DE CODAGE STRICTES :

Type Safety & TypeScript :

    Interdiction stricte du type any. Utilisez des interfaces ou des types Zod.

    Les types partagés (DTOs) doivent être dans @/types/index.ts.

    Utilise zod pour valider toutes les entrées formulaires (Server Actions et Client).

Architecture Next.js :

    Server Actions : Toute mutation de donnée (CREATE, UPDATE, DELETE) doit être une Server Action dans @/actions.

    Data Fetching : Privilégier le fetch dans les Server Components. Pour le "Lock", créer une action spécifique getLockedEntry(id, pin) qui ne retourne la data que si le PIN est valide.

    Client Components : Utiliser 'use client' uniquement si nécessaire (hooks, interactivité, dialogs).

UI & UX (Shadcn) :

    Utiliser les composants shadcn/ui existants. Ne pas réinventer des boutons ou inputs.

    Utiliser react-hook-form + zod pour les formulaires (Dialogs).

    État Global : Utiliser zustand pour gérer l'état "isBlurred" (touche 'b') car cela affecte toute l'app.

Logique Spécifique au Projet :

    Sécurité Lock : Une entrée isLocked: true ne doit JAMAIS renvoyer son content ou ses images dans un findMany standard. Le contenu doit être null côté client tant que le PIN n'est pas validé.

    Recherche : La recherche doit inclure les éléments "locked", mais le texte retourné doit être obfusqué si l'utilisateur n'a pas encore déverrouillé l'item.

Workflow :

    Ne jamais faire de git commit. Proposer le code, attendre la validation.

    Lancer le linter (npm run lint) avant de confirmer qu'une tâche est finie.