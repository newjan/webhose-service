FROM node:22.12.0
WORKDIR /app

ENV NODE_ENV=development

COPY package.json yarn.lock ./

RUN yarn install

EXPOSE 8000

CMD ["yarn", "dev"]