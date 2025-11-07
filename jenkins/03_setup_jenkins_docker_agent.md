# 03_setup_jenkins_docker_agent.md — Jenkins + agent Docker

## 🎯 Objectif  
Démarrer **Jenkins** et ajouter un **agent Docker** capable d’exécuter `docker build`, `npm ci`, etc.

## 🧰 Prérequis  
- Docker installé  
- Ports **8080** (web) et **50000** (agent) libres

## 🚀 Lancer Jenkins (contrôleur)
```yaml
# docker-compose.yml (Jenkins seul)
services:
  jenkins:
    image: jenkins/jenkins:lts-jdk17
    container_name: jenkins
    user: root
    ports:
      - "8080:8080"
      - "50000:50000"
    volumes:
      - jenkins:/var/jenkins_home
      - /var/run/docker.sock:/var/run/docker.sock
    restart: unless-stopped

volumes:
  jenkins:
```

```bash
docker compose up -d
```

Accès : http://localhost:8080  
Mot de passe initial :
```bash
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

mdp : 0fec5d04271f4d3db0eb665e3b6a85bf
```

Installe les **plugins suggérés**, puis connecte-toi avec ton compte admin.

## 🔌 Plugins à installer
- **Docker plugin**
- **Docker Pipeline**
- **Gitea**

## 🐳 Configurer un Cloud “Docker” (agent)
**Manage Jenkins → Clouds → New cloud → Docker**

- **Docker Host URI** : `unix:///var/run/docker.sock`  
- **Enabled** : ✅

**Docker Agent template → Add Docker Template**  
*(Les champs **User** et **Mounts** sont accessibles après avoir cliqué sur **Container settings**.)*

- **Labels** : `docker-agent`  
- **Docker Image** : `jenkins/jnlp-agent-docker:latest`  
- **Container settings → User** : `root`  
- **Container settings → Mounts** : `type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock`  
- **Remote File System Root** : `/home/jenkins/agent`  
- **Connect method** : *Attach Docker container*  
- **Pull strategy** : *Pull once and update latest*

Sauvegarde.

## 🧪 Test rapide (pipeline)
Crée un pipeline “Test Docker” avec :
```groovy
pipeline {
  agent { label 'docker-agent' }
  stages {
    stage('Docker CLI') {
      steps {
        sh 'docker version'
        sh 'docker ps'
      }
    }
  }
}
```
Le build doit afficher la version Docker et la liste des conteneurs.
