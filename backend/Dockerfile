# Sử dụng image Java chính thức
FROM openjdk:17-jdk-alpine

# Đặt thư mục làm việc
WORKDIR /app

# Sao chép file jar vào container
COPY target/library_management-0.0.1-SNAPSHOT.jar app.jar

# Expose port mà ứng dụng Spring Boot sử dụng
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java","-jar","app.jar"]
