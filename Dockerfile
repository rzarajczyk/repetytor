FROM eclipse-temurin:21-jdk AS build
WORKDIR /app
COPY ./ .
RUN ./gradlew clean build -x test

FROM eclipse-temurin:21-jdk
EXPOSE 8080
WORKDIR /app
COPY --from=build build/libs/app.jar app.jar

ENTRYPOINT java \
  -XX:InitialRAMPercentage=75.0 \
  -XX:MaxRAMPercentage=75.0 \
  -XX:+UseG1GC \
  -XX:+ExitOnOutOfMemoryError \
  -Xlog:gc*:stderr:time \
  -XX:+HeapDumpOnOutOfMemoryError \
  -Dfile.encoding=UTF-8 \
  -Djava.security.egd=file:/dev/./urandom \
  -jar app.jar