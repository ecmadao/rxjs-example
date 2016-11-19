# rxjs-example

通过构建一个简单的 github 应用，学习 RxJS 的快速入门教程

## 开始前的准备

- 使用 ES6 语法
- 通过 webpack/webpack-dev-server 进行编译
- 通过[探索 RxJS - Core Concept](https://github.com/ecmadao/Coding-Guide/blob/master/Notes/RxJS/%E6%8E%A2%E7%B4%A2RxJS-CoreConcept.md)学习 RxJS 的核心概念

## 本地跑起来

```bash
$ git clone https://github.com/ecmadao/rxjs-example.git
$ cd rxjs-example
$ npm i
$ npm run dev-server
```

然后打开`http://localhost:8080/webpack-dev-server`即可

## 展示

- 通过`RxJS`，在输入过程中实时进行异步搜索：

![search repos](./readme/search_repos.png)

- `hover`到 avator 上之后异步获取用户信息

![fetch user info](./readme/fetch_info.png) 

<!-- ## 教程目录 [猛戳这里看教程]() -->
