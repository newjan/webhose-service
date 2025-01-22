# Use the official Node.js image
FROM node:22.12.0

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock into the container
COPY package.json yarn.lock ./

# Install all dependencies
RUN yarn install

# Copy the entire application into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Start the application
CMD ["yarn", "dev"]