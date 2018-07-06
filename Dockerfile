FROM node:10.5-alpine

RUN mkdir /app

ENV SUBDIR=app
ENV HOME=/home/$USER

RUN npm i -g typescript tsc-watch gulp-cli

COPY package.json $HOME/$SUBDIR/

WORKDIR $HOME/$SUBDIR

RUN npm install

CMD ["node", "dist/"]