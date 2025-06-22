FROM maven:3.8-openjdk-17 AS build

WORKDIR /app

# Copy the POM file
COPY pom.xml .

# Download all required dependencies
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build the application
RUN mvn package -DskipTests

# Create runtime image
FROM openjdk:17-slim

WORKDIR /app

# Copy the built JAR file
COPY --from=build /app/target/*.jar app.jar

# Environment variables
ENV GROQ_API_KEY=""
ENV CHROMADB_URL="http://chromadb:8000"
ENV CHROMADB_COLLECTION="edun7-collection"

# Expose port
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
