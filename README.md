# catBack
catReading  backstage
devFront文件夹里是开发版的后台前端代码，使用yarn进行构建（yarn add, yarn run dev, yarn build）
dist文件夹是build后的前端代码，由node支持服务
后端为node，开启方式为node app.js
注意：后端支持开发版的请求（需要修改请求的链接为服务开启的绝对域名）不支持开发版的服务，开发版的服务由-cli提供，
      支持build后的上线版的服务和请求（请求链接为相对域名）
