FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set pnpm 

COPY . /app/

ENV PNPM_HOME="./pnpm"
ENV PATH="$PNPM_HOME:$PATH"


WORKDIR /app
RUN pnpm i 


RUN pnpm config set store-dir /app/pnpm





