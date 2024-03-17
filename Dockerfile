# Use an official Node.js runtime as the base image
FROM node:16

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install



# If you are building your code for production
# RUN npm ci --only=production

# Copy the current directory contents into the container at /app
COPY . .

# Make port 3000 available to the world outside this container
EXPOSE 3000



# Define the command to run your app using CMD which defines your runtime
# Here we use "node" to run the ./index.js file
CMD [ "node", "src/index.js" ]
 