FROM node

LABEL maintainer mahy

RUN npm install -g cnpm --registry=https://registry.npm.taobao.org

RUN cnpm install pm2

CMD ["pm2", "start", "./bin/www", "--watch"]
