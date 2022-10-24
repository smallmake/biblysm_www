FROM node:16

# https://docs.docker.jp/engine/reference/builder.html#workdir
WORKDIR /usr/src/app

#COPY package.json ./
RUN npm install

COPY . .

# Gooogle Cloud Run は 8080 でないといけない
EXPOSE 8080

# ENV PORT を設定すれば nuxt.config.js ではポートをそれにするように書いている
ENV PORT 8080
ENV HOST 0.0.0.0

RUN npm run build
RUN npm run generate

CMD [ "npm", "run", "start" ]
