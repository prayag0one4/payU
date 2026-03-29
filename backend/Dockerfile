# Step 1: Use Node.js 20 lightweight image
FROM node:20-alpine

# Step 2: Set the working directory
WORKDIR /app

# Step 3: Copy package files first for faster caching
COPY package*.json ./

# Step 4: Install production dependencies
RUN npm ci --only=production

# Step 5: Copy the entire project (including the src folder)
COPY . .

# Step 6: Expose the port App Runner expects
EXPOSE 8080

# Step 7: Start the app pointing to the file inside src
# This assumes your structure is /app/src/index.js
CMD ["node", "src/index.js"]