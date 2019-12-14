FROM alpine

RUN apk add --update --no-cache \
  nodejs \
  npm \
  nginx \
  git \
  ca-certificates && \
  npm install -g yarn

WORKDIR /home

COPY . .

RUN cd server && \
  npm install && \
  yarn build && \
  cd .. && \
  cd frontend && \
  npm install && \
  yarn build

VOLUME [ "/data" ]

EXPOSE 3000

CMD [ "node", "server/dist/index.js" ]