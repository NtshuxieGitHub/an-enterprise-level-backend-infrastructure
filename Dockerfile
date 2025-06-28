# Use an official Node.js runtime as a parent image
FROM node:22-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the pavkage.json and package-lock.json files to the container
COPY package*.json ./

# Install npm dependencies
RUN npm i

# Copy the rest of the app code
COPY . .

# Expose the port on which the app will run
EXPOSE 5005

# Define the command to run the application
CMD ["node", "./src/server.js"]