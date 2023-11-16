<!-- markdownlint-disable MD030 -->

<img width="100%" src="https://github.com/SAIAAI/SAIA/blob/main/images/SAIA.png?raw=true"></a>

# SAIA - 轻松构建 LLM 应用程序

[![发布说明](https://img.shields.io/github/release/SAIAAI/SAIA)](https://github.com/SAIAAI/SAIA/releases)
[![Discord](https://img.shields.io/discord/1087698854775881778?label=Discord&logo=discord)](https://discord.gg/jbaHfsRVBW)
[![Twitter关注](https://img.shields.io/twitter/follow/SAIAAI?style=social)](https://twitter.com/SAIAAI)
[![GitHub星图](https://img.shields.io/github/stars/SAIAAI/SAIA?style=social)](https://star-history.com/#SAIAAI/SAIA)
[![GitHub分支](https://img.shields.io/github/forks/SAIAAI/SAIA?style=social)](https://github.com/SAIAAI/SAIA/fork)

[English](./README.md) | 中文

<h3>拖放界面构建定制化的LLM流程</h3>
<a href="https://github.com/SAIAAI/SAIA">
<img width="100%" src="https://github.com/SAIAAI/SAIA/blob/main/images/SAIA.gif?raw=true"></a>

## ⚡ 快速入门

下载并安装 [NodeJS](https://nodejs.org/en/download) >= 18.15.0

1. 安装 SAIA
    ```bash
    npm install -g SAIA
    ```
2. 启动 SAIA

    ```bash
    npx SAIA start
    ```

    使用用户名和密码

    ```bash
    npx SAIA start --SAIA_USERNAME=user --SAIA_PASSWORD=1234
    ```

3. 打开 [http://localhost:3000](http://localhost:3000)

## 🐳 Docker

### Docker Compose

1. 进入项目根目录下的 `docker` 文件夹
2. 创建 `.env` 文件并指定 `PORT`（参考 `.env.example`）
3. 运行 `docker-compose up -d`
4. 打开 [http://localhost:3000](http://localhost:3000)
5. 可以通过 `docker-compose stop` 停止容器

### Docker 镜像

1. 本地构建镜像：
    ```bash
    docker build --no-cache -t SAIA .
    ```
2. 运行镜像：

    ```bash
    docker run -d --name SAIA -p 3000:3000 SAIA
    ```

3. 停止镜像：
    ```bash
    docker stop SAIA
    ```

## 👨‍💻 开发者

SAIA 在一个单一的代码库中有 3 个不同的模块。

-   `server`：用于提供 API 逻辑的 Node 后端
-   `ui`：React 前端
-   `components`：Langchain 组件

### 先决条件

-   安装 [Yarn v1](https://classic.yarnpkg.com/en/docs/install)
    ```bash
    npm i -g yarn
    ```

### 设置

1. 克隆仓库

    ```bash
    git clone https://github.com/SAIAAI/SAIA.git
    ```

2. 进入仓库文件夹

    ```bash
    cd SAIA
    ```

3. 安装所有模块的依赖：

    ```bash
    yarn install
    ```

4. 构建所有代码：

    ```bash
    yarn build
    ```

5. 启动应用：

    ```bash
    yarn start
    ```

    现在可以在 [http://localhost:3000](http://localhost:3000) 访问应用

6. 用于开发构建：

    - 在 `packages/ui` 中创建 `.env` 文件并指定 `PORT`（参考 `.env.example`）
    - 在 `packages/server` 中创建 `.env` 文件并指定 `PORT`（参考 `.env.example`）
    - 运行

        ```bash
        yarn dev
        ```

    任何代码更改都会自动重新加载应用程序，访问 [http://localhost:8080](http://localhost:8080)

## 🔒 认证

要启用应用程序级身份验证，在 `packages/server` 的 `.env` 文件中添加 `SAIA_USERNAME` 和 `SAIA_PASSWORD`：

```
SAIA_USERNAME=user
SAIA_PASSWORD=1234
```

## 🌱 环境变量

SAIA 支持不同的环境变量来配置您的实例。您可以在 `packages/server` 文件夹中的 `.env` 文件中指定以下变量。了解更多信息，请阅读[文档](https://github.com/SAIAAI/SAIA/blob/main/CONTRIBUTING.md#-env-variables)

## 📖 文档

[SAIA 文档](https://docs.SAIAai.com/)

## 🌐 自托管

### [Railway](https://docs.SAIAai.com/deployment/railway)

[![在 Railway 上部署](https://railway.app/button.svg)](https://railway.app/template/pn4G8S?referralCode=WVNPD9)

### [Render](https://docs.SAIAai.com/deployment/render)

[![部署到 Render](https://render.com/images/deploy-to-render-button.svg)](https://docs.SAIAai.com/deployment/render)

### [HuggingFace Spaces](https://docs.SAIAai.com/deployment/hugging-face)

<a href="https://huggingface.co/spaces/SAIAAI/SAIA"><img src="https://huggingface.co/datasets/huggingface/badges/raw/main/open-in-hf-spaces-sm.svg" alt="HuggingFace Spaces"></a>

### [AWS](https://docs.SAIAai.com/deployment/aws)

### [Azure](https://docs.SAIAai.com/deployment/azure)

### [DigitalOcean](https://docs.SAIAai.com/deployment/digital-ocean)

### [GCP](https://docs.SAIAai.com/deployment/gcp)

## 💻 云托管

即将推出

## 🙋 支持

在[讨论区](https://github.com/SAIAAI/SAIA/discussions)中随时提问、提出问题和请求新功能

## 🙌 贡献

感谢这些了不起的贡献者

<a href="https://github.com/SAIAAI/SAIA/graphs/contributors">
<img src="https://contrib.rocks/image?repo=SAIAAI/SAIA" />
</a>

参见[贡献指南](CONTRIBUTING.md)。如果您有任何问题或问题，请在[Discord](https://discord.gg/jbaHfsRVBW)上与我们联系。

## 📄 许可证

此代码库中的源代码在[Apache License Version 2.0 许可证](LICENSE.md)下提供。
