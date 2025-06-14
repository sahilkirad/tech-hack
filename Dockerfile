# Use official Node.js Alpine image

FROM node:18-alpine



# Set working directory

WORKDIR /app



# Install deps

COPY package*.json ./

RUN npm install --legacy-peer-deps



# Copy source code

COPY . .



# Build app

RUN npm run build



# Expose port

EXPOSE 3000



# Start app

CMD ["npm", "start"]