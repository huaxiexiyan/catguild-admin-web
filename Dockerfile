FROM tdesign.tencent.com/noc/nodejs:16.6 AS builder
LABEL maintainer="username<username@tencent.com>"

ARG BRANCH
COPY . /

RUN npm config set registry https://registry.npmjs.org/
RUN npm install && npm run build

FROM tdesign.tencent.com/iyunwei/openresty

#EXPOSE 80

COPY ./docker/nginx.conf /etc/nginx/conf.d
RUN  mkdir -p /data/wwwlogs/ && chown -R nobody:nobody /data/wwwlogs/
COPY --from=builder dist dist
