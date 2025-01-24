# Production stage
FROM alpine:latest
RUN apk update && apk add nodejs npm curl
RUN mkdir -p /app
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ENV NEXT_PRIVATE_VERBOSE_LOGGING=1
ENV NEXT_PUBLIC_GOOGLE_FORM_LINK=https://github.com/aequitas-aod/aequitas-flow
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=1m --retries=3 CMD [ "curl", "-f", "localhost" ]
CMD npm run build && \
    npx serve@latest out -l 80;
