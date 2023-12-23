FROM eclipse-temurin:17

# Set the current working directory inside the image (create the directory if doesn't exist)
WORKDIR /app

COPY target/meltiverse-0.0.1-SNAPSHOT.jar /app/meltiverse.jar

ENTRYPOINT ["java", "-jar", "meltiverse.jar"]

# EXPOSE 8080