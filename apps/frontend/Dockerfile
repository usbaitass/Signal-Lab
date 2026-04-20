FROM node:20-alpine

WORKDIR /workspace/apps/frontend

COPY apps/frontend/package*.json ./
RUN npm install

EXPOSE 3000

CMD ["npm", "run", "dev"]
