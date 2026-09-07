FROM eclipse-temurin:21-jdk-jammy AS build
WORKDIR /workspace
COPY .mvn .mvn
COPY mvnw pom.xml ./
COPY src src
RUN ./mvnw -B -DskipTests package

FROM eclipse-temurin:21-jre-jammy
RUN apt-get update \
    && apt-get install --yes --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system app \
    && useradd --system --gid app app
WORKDIR /app
COPY --from=build /workspace/target/maarif-analytics-backend-*.jar app.jar
RUN mkdir -p /app/data/product-images && chown -R app:app /app/data
USER app
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
