# qa-vue

> 测试平台前端项目使用说明

## 构建步骤
- #### 安装依赖
1. npm install(官方默认安装方式,速度比较慢,建议使用后两种)
2. 或者指定国内镜像安装:npm install --registry=https://registry.npm.taobao.org
3. 或者通过cnpm install （前提是需要安装cnpm：npm install cnpm --registry=https://registry.npm.taobao.org）

- #### 开发环境运行,项目访问链接为 localhost:8080
命令:npm run dev

- #### 生产环境构建
命令:npm run build

- #### 生产构建并查看报告
命令:npm run build --report

- #### 注意事项
1. package.json中dependencies不要使用^xxx版本的方式指定版本,一旦有新版本发布,
 会有兼容性问题产生("^"是使用更高版本,不要"^"是使用固定版本,建议各个依赖都是固定版本)
2. 项目是vue2.x,安装时不要弄错vue版本
