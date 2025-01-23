# Production stage
FROM nginx:alpine
RUN apk update && apk add nodejs npm
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN rm /etc/nginx/conf.d/*.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
ENV NEXT_PRIVATE_VERBOSE_LOGGING=1
ENV NEXT_PUBLIC_GOOGLE_FORM_LINK=https://github.com/aequitas-aod/aequitas-flow
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=1m --retries=3 CMD [ "curl", "-f", "localhost" ]
CMD npm run build && \
    mkdir -p /usr/share/nginx/html && \
    rm -rf /usr/share/nginx/html && \
    mv /app/out /usr/share/nginx/html && \
    nginx -g "daemon off;"
