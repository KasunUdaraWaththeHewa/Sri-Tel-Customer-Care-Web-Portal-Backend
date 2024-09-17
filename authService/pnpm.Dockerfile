FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set pnpm 

COPY package.json /app/package.json

ENV PNPM_HOME="./pnpm"
ENV PATH="$PNPM_HOME:$PATH"


WORKDIR /app
RUN pnpm i 


RUN pnpm config set store-dir /app/pnpm