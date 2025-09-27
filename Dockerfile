FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy gradle wrapper and build files
COPY gradle/ gradle/
COPY gradlew .
COPY build.gradle .

# Copy source code
COPY src/ src/

# Make gradlew executable
RUN chmod +x gradlew

# Build the application
RUN ./gradlew build -x test

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "build/libs/repetytor-0.0.1-SNAPSHOT.jar"]
