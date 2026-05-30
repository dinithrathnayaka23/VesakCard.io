FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -q -DskipTests dependency:go-offline

COPY src src
RUN ./mvnw -q -DskipTests package

FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd --system --create-home appuser
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75 -XX:+UseSerialGC -Dfile.encoding=UTF-8"

COPY --from=build /app/target/vesak-cards-api-0.0.1-SNAPSHOT.jar app.jar

USER appuser
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
