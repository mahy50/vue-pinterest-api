FROM node:8.9.4

LABEL maintainer mahy

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

RUN cnpm install -g pm2

COPY . /code

WORKDIR /code

RUN cnpm install

EXPOSE 3000

ENV VIRTUAL_HOST=api.pinterest.mahaoyuan.com

CMD ["npm", "product"]
