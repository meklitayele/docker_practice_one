# Start from an image that already has Node.js installed
FROM node:22-alpine

# Work inside the /app folder in the image
WORKDIR /app

# Copy our files (server.js, index.html) into /app
COPY . .

# The app listens on port 3000 inside the container
EXPOSE 3000

# The command that runs when a container starts
CMD ["node", "server.js"]
