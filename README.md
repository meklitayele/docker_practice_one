# Docker Guestbook

A tiny web app for learning Docker. Visitors write messages, and the page shows
which container answered. It uses only Node.js, with no extra libraries.

## Run it with Docker

You only need Git and Docker Desktop (open and running).

```
git clone https://github.com/<your-username>/docker-guestbook.git
cd docker-guestbook
docker build -t guestbook:v1 .
docker run -d -p 8080:3000 --name guestbook guestbook:v1
```

Open http://localhost:8080 and write a message.

## Useful commands

| Command | What it does |
|---|---|
| `docker ps` | List running containers |
| `docker logs -f guestbook` | Watch the app's output (Ctrl+C to stop watching) |
| `docker exec -it guestbook sh` | Open a shell inside the container (`exit` to leave) |
| `docker stop guestbook` / `docker start guestbook` | Stop / start the container |
| `docker rm -f guestbook` | Delete the container |

## Keep the messages with a volume

```
docker run -d -p 8080:3000 -v guestbook-data:/app/data --name guestbook guestbook:v1
```

## Change the title and color without rebuilding

```
docker run -d -p 8081:3000 -e TITLE="My Guestbook" -e COLOR=darkgreen --name guestbook2 guestbook:v1
```

## Files

| File | Job |
|---|---|
| `server.js` | The web server: serves the page and saves messages in `data/messages.json` |
| `index.html` | The page the visitor sees |
| `Dockerfile` | The recipe that packages the app into an image |
| `.dockerignore` | Files Docker must not copy into the image |
