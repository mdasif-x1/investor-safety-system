# Stage 1: Build stage using Maven and JDK 21
FROM maven:3.9.8-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copy pom.xml and download dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application
COPY src ./src
RUN mvn clean package -DskipTests -B

# Stage 2: Production Runtime stage using Eclipse Temurin JRE 21
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Create a non-root group and user
RUN addgroup -S sangyan && adduser -S sangyan -G sangyan

# Copy compiled jar from builder stage
COPY --from=builder /app/target/*.jar app.jar

# Ensure ownership by non-root user
RUN chown -R sangyan:sangyan /app

USER sangyan

# Expose default port
EXPOSE 8080

# Environment variables with sensible fallbacks
ENV PORT=8080
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Execute application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT} -jar app.jar"]
