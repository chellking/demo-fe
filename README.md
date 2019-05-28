## 介绍

本仓库为与ap-fe-optimze配套的项目工程模板。

## 文件说明

```
│  fis-conf.js // fis3配置
│  gulpfile.js // gulp配置，用于启动服务及监听文件
│  package.json // 项目配置
│  README.md // 说明文件
│  
├─build
│      build.js // 产出dist目录
│      dev-server.js // 开发启动服务
├─config  // 配置文件
│      
├─locals // 多语资源文件
│      
└─src  
    └─apps // 项目开发时修改的目录
    │  │      
    │  └─assets // 项目静态资源文件，图片、josn文件等，直接放入dist
    │  │      
    │  └─common // 项目公共资源，公共的js、vue组件等，进行打包后合并放入dist/包名/common/index.js
    │  │      
    │  └─pages // 项目功能节点
    │     │
    │     └─*** // 功能节点目录
    │         │
    │         └─index.js  // 功能节点下的路由信息
    │         │
    │         └─mockdemo.js  // 开发时mock数据，产出代码前需要将此文件的引用去掉
    │         │
    │         └─src  // 功能节点下的vue文件
    │               BjBrokaccDetailDetail.vue
    │               BjBrokaccDetailEdit.vue
    │               BjBrokaccDetailList.vue
    │
    └─widget // 小部件开发目录
    │
    └─widgetVue // 以.vue方式开发小部件对应目录
├─static // 用于本地调试的静态资源目录，例如：element放到 static/ap/trd/ifbp-element下
```


#### 注意点：

- 项目开发时仅需要修改src/apps目录，其他内容理论不需要修改，但是开发相关的配置可适当调整
- 项目开发时要将src/apps/assets、src/apps/common、src/apps/pages目录清空，根据实际情况来添加对应内容
- 对于项目开发时的公共css，建议放到src/apps/common/css/index.css中进行维护
- 引用图片资源时在路径增加后缀`?__inline`，方便资源引用
- pages目录下，index.js只能用于定义路由信息，并且index.js中路由需要的vue文件需放入同级src目录下，其他依赖文件可随意存放。此设置是为了保证最终产出文件的路由配置与产出模块名称保持一致
- 以下文件必须修改
  - package.json
    - name：需要与ap-fe-optimze工程src/App.vue文件中请求(window.ctxs.ap + '/appMGT/appCenter/allList?showway=apparea&areaId=&groupId=')返回模块的areaKey值保持一致

## 开发说明

此工程中仅包含项目资源文件，平台内容需要代理到可用的测试工程。

### 修改config/index.js

按照实际情况修改proxyList下平台服务以及后台服务的地址及url的匹配规则。

### 启动服务

可通过以下方式启动服务

```
$ gulp
```

或者

```
npm run dev
```


### 线上部署

将产出的dist目录进行部署，并且保证线上服务可通过下面的地址找到对应文件

ip + port + '/ifbp-fe/config.js'
多语情况下为：
ip + port + '/ifbp-fe/' + 语种 + 'config.js'

### 注意点

* 如果模块名需要变成二级目录，则在build.js和fis-config.js中将`project-name/`替换为相应的内容
* 如果page下面有多级目录，则在build.js中根据`// fs.mkdirSync(path.resolve(distPagesBasePath + '/base'))` 创建对应的子目录
* 在同一个目录下，不要同时存在.vue和.js文件的文件名一致的情况

### 按目录打包
首先将原有的config.js修改名称为oldConfig.js放到config目录下 然后执行下面的命令
```
npm run build -- pages/typicalDemo
```

### 小部件开发
小部件开发分为 2 种开发模式：.html .vue
#### .html 
* 目录 ：src/widget
* 公共文件 ：src/widget/common
* 文件名称 ：简短、有含义
  * js html css 与之对应
* css ：要有自己的命名空间
  * schedule-container
* 图片
  * html内img引用 src写绝对路径 ：`<img src="/ap-pub/widget/schedule/img/demo.png">`
  * css内 background引用 写相对路径 ： `background-image: url(./img/demo.png)`

#### .vue 
* 目录 ：src/widgetVue
* 公共文件 ：src/widgetVue/commonVue
* 文件名称 ：简短、有含义
  * 入口文件：必须为index.vue 
* css ：要有自己的命名空间
  * compOne-big
  * compTwo-big
* 图片
  * html内img引用 src写相对路径 ：`<img class="img-common" src="../../apps/assets/img/widget/demo.png?__inline" alt="">`
    * src路径最后需要添加`?__inline`
  * css内 background引用 写相对路径 ：`background-image: url('../../apps/assets/img/widget/demo.png')`


### TODO.

* vue小部件测试引用同目录下组件，引用node_modules中的组件
* 小部件考虑引用项目中的公共js
* 功能开发时考虑跨目录引用文件
* 考虑如果加载项目中的图标字体
