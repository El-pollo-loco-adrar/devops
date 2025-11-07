# Pack Tests Unitaires — Ajout simple

Ce pack ajoute une suite **de tests unitaires** à ton projet TaskBoard.  
Il se contente d’ajouter des fichiers : aucune configuration complexe n’est requise.

---

## ⚙️ Installation rapide

1️⃣ **Installer la dépendance de test**
```bash
npm i -D vitest@^2.1.3
```

2️⃣ **Ajouter les scripts de test** dans ton `package.json`
```jsonc
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

3️⃣ **Copier le dossier** `tests/` à la **racine** de ton projet (à côté de `src/`).

---

## ▶️ Lancer les tests

### 🔹 Exécution unique
Pour exécuter tous les tests une seule fois :
```bash
npm run test
```

### 🔹 Mode Watch (surveillance continue)
Pour relancer automatiquement les tests à chaque modification :
```bash
npm run test:watch
```

En mode *watch*, Vitest reste actif dans le terminal :
- Il surveille tes fichiers `src/` et `tests/`
- À chaque sauvegarde, il rejoue **seulement les tests concernés**
- Tu vois immédiatement si ton changement casse quelque chose  
- Quitte le mode avec `Ctrl + C`

Exemple :
```
✓ tasks.service.test.js (3)
✓ tasks.repo.test.js (1)

Watching for file changes...
```

---

## 🧩 À propos des tests

- Les tests sont **unitaires** et utilisent des **mocks** :  
  ils n’ont pas besoin d’une base de données ni de démarrer un serveur HTTP.

- Ils couvrent :
  - **Services** — logique métier (validation, erreurs, statuts)
  - **Contrôleurs** — codes HTTP et réponses
  - **Dépôts (repositories)** — requêtes SQL et gestion d’erreurs
  - **Librairies utilitaires** — par ex. `asyncHandler`

- Chaque fichier de test contient un en-tête commenté expliquant précisément ce qu’il vérifie.

---

## ✅ Exemple rapide

```bash
npm install
npm run test:watch
# édite un fichier dans src/services/
# => les tests correspondants se relancent automatiquement
```

---

🎯 **But** : t’offrir une base de tests rapide, isolée et maintenable pour valider ton code en continu pendant le développement.


---

## 📄 (Option CI) Rapport JUnit pour intégration continue

Si tu veux que la CI (ex. Jenkins) affiche les résultats de tests, ajoute un **fichier** `vitest.config.ts` à la **racine** du projet :

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    reporters: [
      'default',
      ['junit', { outputFile: 'reports/junit.xml' }],
    ],
    // coverage: {
    //   provider: 'v8',
    //   reportsDirectory: 'coverage',
    //   reporter: ['text', 'lcov', 'html'],
    // },
  },
})
```

Puis lance :
```bash
mkdir -p reports
npm run test
```

Le fichier **`reports/junit.xml`** sera généré et pourra être collecté par ton outil de CI.

> ℹ️ Si tu actives la section `coverage`, installe d’abord la dépendance optionnelle :
> ```bash
> npm i -D @vitest/coverage-v8
> ```
> Ensuite exécute avec la couverture :
> ```bash
> npm run test -- --coverage
> ```
