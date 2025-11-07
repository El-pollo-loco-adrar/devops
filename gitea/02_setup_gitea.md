# 02_setup_gitea.md — Installation de Gitea + push depuis le repo local

## 🎯 Objectif  
Démarrer **Gitea** en local, créer un dépôt `taskboard`, et pousser ton code depuis ton répertoire local.

## 🧰 Prérequis  
- Docker installé  
- Port **3000** libre

## 🚀 Lancer Gitea
```yaml
# docker-compose.yml (Gitea seul)
services:
  gitea:
    image: gitea/gitea:latest
    container_name: gitea
    ports:
      - "3000:3000"
    environment:
      - GITEA__server__ROOT_URL=http://localhost:3000/
      - GITEA__webhook__ALLOWED_HOST_LIST=*
    volumes:
      - gitea:/data
    restart: unless-stopped

volumes:
  gitea:
```

```bash
docker compose up -d
```

Accès : http://localhost:3000

## 👤 Création de l’admin et initialisation  
1) Suis l’assistant (SQLite par défaut OK en local).  
2) Crée un utilisateur **admin**.  
3) (Optionnel) crée un utilisateur **jenkins-bot** pour les intégrations.

## 📦 Créer le dépôt `taskboard` dans Gitea  
- “+ → Nouveau Dépôt” → **taskboard** (public ou privé).

## 💻 Push depuis ton repo local
Dans le dossier **taskboard/** (ton code) :
```bash
git init
git add .
git commit -m "Initial commit - TaskBoard"
git branch -M main
git remote add origin http://localhost:3000/<owner>/taskboard.git
git push -u origin main
```

Vérifie sur Gitea que la branche `main` et tes fichiers sont bien présents.
