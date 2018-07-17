FROM daocloud.io/node:8.9.1

ENV NGINX_VERSION 1.9.11-1~jessie

RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
  && echo "deb http://nginx.org/packages/mainline/debian/ jessie nginx" >> /etc/apt/sources.list \
  && apt-get update \
  && apt-get install -y ca-certificates nginx=${NGINX_VERSION} gettext-base git libpng-dev \
  && rm -rf /var/lib/apt/lists/* \
  && ln -sf /dev/stdout /var/log/nginx/access.log \
  && ln -sf /dev/stderr /var/log/nginx/error.log
#  && npm install -g -q npm && npm install -g -q gulp
#  && npm install -g cnpm --registry=https://registry.npm.taobao.org && cnpm install -g -q gulp

COPY nginx.conf /etc/nginx/nginx-base.conf

WORKDIR /app

COPY ./package.json /app/
RUN npm install -q
#RUN cnpm install -q

COPY . /app/

RUN npm run build

EXPOSE 80

CMD bash startup.sh
