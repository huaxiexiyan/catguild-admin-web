# 使用 Node.js 作为基础镜像，用于构建和运行 Vue.js 项目
FROM node:18.16.0 as build-stage

# 设置工作目录
WORKDIR /app

# 复制项目文件（package.json 和 package-lock.json）
COPY package*.json ./

# 使用 npm 缓存目录
ARG NPM_CACHE_DIR=/root/.npm
ENV npm_config_cache=${NPM_CACHE_DIR}

# 安装项目依赖
RUN npm install

# 复制项目源代码到工作目录
COPY . .

# 构建 Vue.js 应用程序
RUN npm run build && \
    cp -r node_modules /host

# 构建生产镜像
FROM nginx:alpine

# 将构建好的 Vue.js 应用程序复制到 Nginx 默认网站目录
COPY --from=build-stage /app/dist /usr/share/nginx/html

# 暴露端口（Nginx 默认端口为 80）
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]