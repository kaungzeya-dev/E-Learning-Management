# Build stage
FROM maven:3.9-eclipse-temurin-17 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

# Single build (avoids flaky dependency:go-offline on some CI hosts)
RUN mvn -B -DskipTests package \
    && cp "$(ls target/*.jar | grep -v plain | head -n1)" /app/app.jar

# Runtime (Debian-based JRE: fewer TLS/DNS issues with MySQL than Alpine)
FROM eclipse-temurin:17-jre

WORKDIR /app

COPY --from=build /app/app.jar app.jar

RUN mkdir -p /app/uploads/course-content

# Railway injects PORT; prod profile tunes logging and health probes
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=prod
ENV FILE_UPLOAD_DIR=/app/uploads/course-content
ENV JAVA_OPTS=""

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar app.jar"]
