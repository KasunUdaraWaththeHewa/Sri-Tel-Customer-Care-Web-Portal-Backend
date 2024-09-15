# Use OpenJDK version 22 as a base image (change to the actual JDK 22 image if available)
FROM maven:3.9.9-eclipse-temurin-22-alpine

# Set the working directory in the container
WORKDIR /app

# Install Maven for building and running in dev mode

# Copy the pom.xml and download dependencies (caching dependencies)
COPY pom.xml /app/
RUN mvn dependency:go-offline

# Copy the application source code to the container (this will be overridden by volume in dev)
COPY src /app/src

# Expose the port Spring Boot will run on
EXPOSE 8080

# Default entry point for development (compile and run the project)
CMD ["mvn", "spring-boot:run"]
