# Dockerfile
FROM golang:1.23-alpine as builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies will be cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app

# Install Air
RUN apk update && apk add --no-cache ca-certificates && \
    wget -O- -q https://raw.githubusercontent.com/cosmtrek/air/master/install.sh | sh -s -- -b /usr/local/bin

# Expose port 4908 to the outside world
EXPOSE 4908

# Command to run the executable
CMD ["air"]
