# 04_integration_gitea_jenkins_webhook.md — Intégration & webhook

## 🎯 Objectif  
Relier **Gitea** et **Jenkins** via le **plugin Gitea**, configurer le **webhook**, et créer un **Multibranch Pipeline** qui se déclenche à chaque push.

> 💡 Tu peux faire tourner Gitea et Jenkins dans des compose séparés **OU** les mettre dans un même compose + réseau commun. Ici on garde séparé et on utilise **localhost**.

## 🔑 Créer un token personnel (PAT) côté Gitea
**Gitea → Configuration → Applications → Générer un nouveau jeton**

- **Nom du jeton** : `jenkins`  
- **Permissions à cocher** :
  - `user` → **Lecture**
  - `organization` → **Lecture**
  - `repository` → **Lecture et écriture**
  - `admin` → **Lecture et écriture**
- Clique **Générer un jeton**  
- Copie le token (il ne sera plus réaffiché)

## 🔌 Déclarer le serveur Gitea dans Jenkins
**Manage Jenkins → Configure System → Gitea Servers → Add Gitea Server**

- **Server URL** : `http://localhost:3000`  
- **Credentials** :
  - **Add → Jenkins**
  - **Kind** : `Gitea Personal Access Token`
  - **Personal Access Token** : colle le PAT créé ci-dessus
  - **ID** (ex.) : `gitea-jenkins-pat`
- **Manage hooks** : ✅  
- **Save**

## 🔔 Créer le webhook Gitea → Jenkins
Dans **Gitea → Repository → Settings → Webhooks → Add Webhook → Gitea** :

- **Target URL** : `http://localhost:8080/gitea-webhook/post`  
- **Events** : **Tous les événements**  
- **Active** : ✅ → **Add Webhook**

> Si Gitea et Jenkins partagent un **réseau Docker** et ne sont pas exposés en localhost, utilise l’URL interne : `http://jenkins:8080/gitea-webhook/post`.

## 🧱 Créer un Multibranch Pipeline
**New Item → Multibranch Pipeline**
- **Name** : `taskboard-pipeline`
- **Branch Sources → Add source → Gitea**
  - **Server** : ton serveur Gitea
  - **Credentials** : le PAT `gitea-jenkins-pat`
  - **Owner** : `<owner>` (ex. `admin`)
  - **Repository** : `taskboard`
  - Coche *Discover branches* et *Discover pull requests*
- **Build Configuration** : *by Jenkinsfile*
- **Scan Multibranch Pipeline Triggers** : cocher *Periodically if not otherwise run* → **2 minutes**
- **Save** → **Scan Multibranch Pipeline Now** (premier scan requis)

## 📄 Jenkinsfile minimal (vérification)
À la racine du dépôt `taskboard`, créer un fichier nommé `Jenkinsfile` :
```groovy
pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        echo "Building branch ${env.BRANCH_NAME}"
      }
    }
    stage('Test') {
      steps {
        echo "Running tests on ${env.BRANCH_NAME}"
      }
    }
  }
}
```

> Quand l’**agent Docker** est en place : remplace `agent any` par  
> `agent { label 'docker-agent' }` et ajoute par exemple :
> ```groovy
> stage('Node CI') { steps { sh 'npm ci && npm test || echo "Tests à implémenter"' } }
> stage('Docker Build') { steps { sh 'docker build -t taskboard:test .' } }
> ```

## 🧪 Test du webhook
```bash
git add Jenkinsfile
git commit -m "Add Jenkinsfile"
git push
```
- Le **webhook** envoie l’événement à Jenkins.  
- Après le **premier scan**, les nouveaux push déclenchent automatiquement les builds.
