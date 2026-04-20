FROM node:20-alpine

WORKDIR /workspace/apps/backend

COPY apps/backend/package*.json ./
RUN npm install

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
