FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install --production=false
COPY . .
RUN npm run build

FROM node:20-alpine as runner
WORKDIR /app
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"] 