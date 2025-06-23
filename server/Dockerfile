FROM maven:3.8-openjdk-17 AS build

WORKDIR /app

# Copy all source code
COPY . .

# Build the application
RUN mvn package -DskipTests

# Create runtime image
FROM eclipse-temurin:17-jre-alpine

WORKDIR /app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy the built JAR file
COPY --from=build /app/target/*.jar app.jar

# Create and set permissions for uploads directory
RUN mkdir -p /app/uploads && chmod 777 /app/uploads

# Environment variables
ENV SPRING_PROFILES_ACTIVE="docker"
ENV JAVA_OPTS="-Xmx512m"

# Expose port
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "app.jar"]
