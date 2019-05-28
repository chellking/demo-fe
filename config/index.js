var path = require('path')
var pkg = require('../package.json')
var pkgName = pkg.name

// 配置代理服务
  var baseHost = 'http://172.20.53.211:80';
// var baseHost = 'http://localhost:8082';
//var baseHost = 'http://10.15.0.243:8089';
// var baseHost = 'http://192.168.191.1:18888';
// var baseHost = 'http://10.10.4.231:18888';
  var localHost = 'http://localhost:8080';

// 应用平台服务地址
var proxyAPHost = baseHost;


module.exports = {
  build: {
    fonts:[
    //   {
    //   fontsName: '默认图标',
    //   fontFamilyName: 'iconfont',
    //   fontsPath: '/assets/fonts/moren/iconfont.css',
    //   index: 1
    // }, {
    //   fontsName: '菜单图标',
    //   fontFamilyName: 'menufont',
    //   fontsPath: '/assets/fonts/caidantubiao/iconfont.css',
    //   index: 2
    // }, {
    //   fontsName: '业务应用',
    //   fontFamilyName: 'ecmifont',
    //   fontsPath: '/assets/fonts/shuziyingxiao/iconfont.css',
    //   index: 3
    // }
  ],
    languages: []
  },
  dev: {
    port: 8086,
    autoOpenBrowser: true,
    // autoOpenUrl: '/ap/index.html',
    // autoLogin: true,
    // loginname: 'admin',
    // pwd: '123456',
    proxyTable: {
      '/ifbp-app-attach/**': { target: proxyAPHost, secure: false },
      '/ifbp-print/**': {target: proxyAPHost,secure: false},
      '/ifbp-msg/**': {target: proxyAPHost,secure: false},
      '/ifbp-bpm-service/**': {target: proxyAPHost,secure: false},
      '/fin-ifbp-base/**':{target: proxyAPHost,secure: false},
      '/wbalone/**': {target:  proxyAPHost,secure: false,},
      // '/ap/**': {filter: ['/ap/**', '!/ap/config.js','!/ap/pages/**','!/ap/common/**','!/ap/assets/**','!/ap/widget/**'],target:  proxyAPHost,secure: false,},
      // '/ap/**': {filter: ['/ap/**', '!/ap/trd/ifbp-element/**'],target:  proxyAPHost,secure: false,},
      '/ap/**': {target: proxyAPHost,secure: false,},
      '/ap-pub/**': {target: proxyAPHost,secure: false,},
      '/i_uap/**': {target: proxyAPHost,secure: false,},
      '/integration/**': {target: proxyAPHost,secure: false,},
      '/uui/**': {target: proxyAPHost,secure: false,},
      '/busilog': {target: proxyAPHost,secure: false,},
      '/securitylog': {target: proxyAPHost,secure: false,},
      '/ifbp-eiap-bpm-service/**': {target: proxyAPHost,secure: false,},
      '/billcode/**': {target: proxyAPHost,secure: false,},
      '/iuap-saas-message-center/**': {target: proxyAPHost,secure: false,},
      '/iuap-saas-dispatch-service': {target: proxyAPHost,secure: false,},
      '/ifbp-app-bd/**': {target: proxyAPHost,secure: false,},
      '/ifbp-app-sm/**': {target: proxyAPHost,secure: false,},
      '/oss/**': {target: proxyAPHost,secure: false,},
      '/ifbp-bop-web/**': {target: proxyAPHost,secure: false,},
      '/user/getBopUserAccount': {target: proxyAPHost,secure: false,},
      '/ifbp-uc-web/token/**': {target: proxyAPHost,secure: false},
      '/ifbp-app-sm-defdoc-web/**': { target: proxyAPHost, secure: false },
      '/uitemplate_web/**': { target: proxyAPHost, secure: false},
      '/ifbp-app-sm-infoset-web/**': { target: proxyAPHost, secure: false },
      '/imfbp-ins-web/**': { target: proxyAPHost, secure: false },
      '/ifbp-app-sm-qt-web/**': { target: proxyAPHost, secure: false },
      // 业务开发代理
      '/ifbp-demo-web/**': { target: proxyAPHost, secure: false },

      // 以上为平台服务，后续可添加项目对应的服务
      // '/sc/**' : {target: 'http://172.20.56.73:8082', secure: false},
      // '/course/**' : {target: 'http://172.20.56.73:8082', secure: false},
      // '/teacher/**' : {target: 'http://172.20.56.73:8082', secure: false},
      // '/student/**' : {target: 'http://172.20.56.73:8082', secure: false},
      // '/training/**' : {target: 'http://172.20.56.73:8082', secure: false},
      // '/archivement/**' : {target: 'http://172.20.56.73:8082', secure: false}
    }
  }
}
