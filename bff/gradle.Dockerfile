# Use Gradle and OpenJDK version 22 as a base image
FROM gradle:jdk22-jammy AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the Gradle wrapper and project metadata
COPY gradle /app/gradle
COPY gradlew /app/gradlew
COPY build.gradle /app/
COPY settings.gradle /app/

# Cache dependencies by downloading them
# RUN ./gradlew build --no-daemon --refresh-dependencies

# Copy the source code to the container (this will be overridden by volume in dev)
COPY src /app/src

# Expose the port your Spring Boot application runs on
EXPOSE 8080

# Run Gradle in continuous mode to recompile and rerun when code changes
# CMD ["./gradlew", "bootRun", "--continuous"]
CMD ["./gradlew", "bootRun", "--continuous", "-Dorg.gradle.daemon=false", "-Dorg.gradle.unsafe.watch-fs=true", "-Dorg.gradle.unsafe.polling=true"]

