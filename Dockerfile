# Production stage
FROM nginx:alpine
RUN apk update && apk add nodejs npm
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_PRIVATE_VERBOSE_LOGGING=1
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=1m --retries=3 CMD [ "curl", "-f", "localhost" ]
CMD npm run build && \
    mkdir -p /usr/share/nginx/html && \
    rm -rf /usr/share/nginx/html && \
    mv /app/out /usr/share/nginx/html && \
    nginx -g "daemon off;"
