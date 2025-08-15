FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files first to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Install lightningcss to avoid binding errors
RUN npm install lightningcss

# Install other required dependencies (like sharp, tailwind, etc.)
RUN npm install sharp @tailwindcss/oxide

# Copy the rest of the application code
COPY . .

# Build the Next.js app for production
RUN npm run build

# Expose the port where the Next.js app will run
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
