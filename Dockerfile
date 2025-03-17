FROM node:20.17.0-alpine

# install glibc for Prisma https://www.prisma.io/docs/guides/docker
RUN apk add --no-cache libc6-compat

WORKDIR /app

COPY package.json package-lock.json ./

# intall deps
RUN npm install --frozen-lockfile

# copy application files
COPY . .

# generate prisma client
RUN npx prisma generate

# build app
RUN npm run build

# next.js port
EXPOSE 3000

# reset and seed db, start server
CMD npx prisma migrate reset --force && npm run start
