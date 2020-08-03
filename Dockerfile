FROM node:lts-alpine3.11

WORKDIR /home

COPY . .

RUN cd frontend && \
  yarn install && \
  yarn build && \
  cd ../server && \
  yarn install && \
  yarn build

ENV DOCKER=true
ENV PORT=80

EXPOSE 80
VOLUME [ "/volumes/db", "/volumes/builds-out", "/var/run/docker.sock" ]

ENTRYPOINT [ "node", "server/dist" ]
