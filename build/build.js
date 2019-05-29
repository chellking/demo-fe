const fs = require('fs')
const path = require('path')
const ora = require('ora')
const rm = require('rimraf')
const cpr = require('cpr').cpr
const execSync = require('child_process').execSync
const fis3 = require('fis3')
const uglifyjs = require('uglify-js')
const CleanCSS = require('clean-css')
const cssMinify = new CleanCSS()
const crypto = require('crypto')
const config = require('../config')
const pkg = require('../package.json')
//const pkgName = 'project1/' + pkg.name
const pkgName = 'mydemo/' + pkg.name
// const pkgName = pkg.name
// const pkgName = 'project-name/' + pkg.name


const spinner = ora('building for production... \n')
spinner.start()

// 获取 script 参数
// npm run build -- pages/busi/doc widget/todo
const processArgv = process.argv;
let patchPaths;
let same_path_flag = "";
if (Array.isArray(processArgv) && processArgv.length > 2) {
	patchPaths = processArgv.slice(2);
}

rm(path.resolve(__dirname, '../dist'), err => {
	if (err) {
		throw err
		spinner.stop()
		process.exit()
	}
	cpr(path.resolve(__dirname, '../src/widget/'), path.resolve(__dirname, '../dist/' + pkgName + '/widget/'), {}, err => {
		if (err) {
			throw err
			spinner.stop()
			process.exit()
		}
		cpr(path.resolve(__dirname, '../src/apps/assets/'), path.resolve(__dirname, '../dist/' + pkgName + '/assets/'), {}, err => {
			if (err) {
				throw err
				spinner.stop()
				process.exit()
			}
			// 通过fis3将vue文件产出为js
			// execSync('fis3 release -d ./dist/' + pkgName + '/output')
			fis3.cli.run({
				_: ['release'],
				d: './dist/' + pkgName + '/output'

			}, {
				cwd: path.resolve(__dirname, '../'),
				configPath: path.resolve(__dirname, '../fis-conf.js'),
			})

			const buildFun = function (lang) {
				// 遍历pages下面的index.js，将对应的文件合并
				const srcBasePath = __dirname + '/../src/apps/pages'
				let langStr = lang ? '/' + lang : '';
				const distBasePath = __dirname + '/../dist/' + pkgName + langStr
				const distPagesBasePath = __dirname + '/../dist/' + pkgName + langStr + '/pages'
				const distCommonBasePath = __dirname + '/../dist/' + pkgName + langStr + '/common'
				const outputBasePath = __dirname + '/../dist/' + pkgName + '/output' + langStr
				const outputPagesBasePath = __dirname + '/../dist/' + pkgName + '/output' + langStr + '/pages'
				// 补丁文件夹
				const patchBasePath = __dirname + '/../patch/' + pkgName + langStr;
				const timeStr = '/patch_' + new Date().getTime();
				const patchPath = patchBasePath + timeStr;
				// widget相关
				const srcBasePathWidget = __dirname + '/../src/widgetVue/';
				const distWidgetBasePath = __dirname + '/../dist/' + pkgName + '/widget/';
				const distWidgetCssBasePath = __dirname + '/dist/' + pkgName + '/widget';
				const outputWidgetBasePath = __dirname + '/../dist/' + pkgName + '/output' + langStr + '/src/widgetVue/'
				const distWidgetCommonBasePath = __dirname + '/../dist/' + pkgName + '/output' + langStr + '/src/widgetVue/commonVue/common'




				const parseWidgetFile = function (curPath, name) {
					let filePath = path.join(srcBasePathWidget, curPath, name)
					let state = fs.statSync(filePath)
					if (state.isDirectory()) {
						let dir = fs.readdirSync(filePath)
						if (name.length > 0) {
							curPath = curPath + '/' + name
						}
						dir.forEach((index) => {
							if (index != 'pages')
								parseWidgetFile(curPath, index)
						})
					} else if (name == 'index.vue') {
                        // console.log('get a.txt in ' + curPath)
						buildWidgetFile(curPath)
					}
				}
				const buildWidgetFile = function (curPath) {
					fs.mkdirSync(path.resolve(distWidgetBasePath + curPath))

					// 创建ifbp-fe/zh-cn目录下的文件
					let jsPath = path.join(distWidgetBasePath + curPath, curPath + '.js')
					let cssPath = path.join(distWidgetBasePath + curPath, curPath + '.css')

					fs.writeFileSync(jsPath, '')
                    fs.writeFileSync(cssPath, '')
                    concatFileWidget(curPath, '', 'js')
                    same_path_flag = "";
					concatFileWidget(curPath, '', 'css')
				}

				//读取output代码 写入ifbp-fe/zh-cn目录
				const concatFileWidget = function (srcBasePathWidget, curPath, type) {
					let filePath = path.join(outputWidgetBasePath, srcBasePathWidget, curPath)
					let state = fs.statSync(filePath)
					if (state.isDirectory()) {
						let dir = fs.readdirSync(filePath)
						dir.forEach((index) => {
							concatFileWidget(srcBasePathWidget, curPath + '/' + index, type)
						})
					} else {
						if (endsWith(filePath, type)) {
							// console.log('get (' + type + ') at :' + filePath)
							// console.log('srcBasePathWidget:' + srcBasePathWidget + '\n\n')
							let c = fs.readFileSync(filePath)
                            let p,common
                            
							if (type === 'js') {
                                p = path.join(distWidgetBasePath, srcBasePathWidget + srcBasePathWidget + '.js');
                                common = path.join(distWidgetCommonBasePath + '.js');
							} else if (type === 'css') {
                                p = path.join(distWidgetBasePath, srcBasePathWidget + srcBasePathWidget + '.css')
                                common = path.join(distWidgetCommonBasePath + '.css');
							}
                            let b = fs.readFileSync(p);
                            let com, d;
							if (type === 'js' && same_path_flag != srcBasePathWidget + srcBasePathWidget) {
                                com = fs.readFileSync(common);
								d = ` define(function () {
										function init(el) {
											require(['${ pkgName }^./widgetVue${ srcBasePathWidget }/index.vue','css!/${ pkgName + '/widget' + srcBasePathWidget + srcBasePathWidget }.css'], function (obj) {
														 var comp = Vue.extend(obj.default);
														 var newComp = new comp();
											 var compMount = newComp.$mount();
											 $('#' + el).html("");
											 $('#' + el)[0].appendChild(compMount.$el);
											});
										}
										return {
											init: init
										}
									});`
                            } else {
                                d = '';
                                com = '';
                            }
                            if (type === 'css' && same_path_flag != srcBasePathWidget + srcBasePathWidget) {
                                com = fs.readFileSync(common);
                            }
                            let bReplacedAssets = b.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
                            let cReplacedAssets = c.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
							fs.writeFileSync(p, bReplacedAssets + ' \n ' + cReplacedAssets + com.toString() + d)
                            same_path_flag = srcBasePathWidget + srcBasePathWidget;
						}
					}
				}

				// console.log('===================== patch base: ', patchPath);
				let relObj = {} // 用于产出config.js
				relArr = relObj[pkgName] = {}
				relArr.curLang = lang ? lang : '';
				relArr['routers'] = []

				const fonts = config.build.fonts;
				if(fonts.length > 0){
					for(var i = 0; i < fonts.length; i++){
						fonts[i].fontsPath = fonts[i].fontsPath.replace(/^\/assets/g, '/' + pkgName + '/assets');
						fonts[i].fontFamilyName = fonts[i].fontFamilyName || '';
						fonts[i].fontsName = fonts[i].fontsName || (pkgName + ' fonts');
					}
					relArr.fonts = fonts;
				}


				const parsePagesFile = function (curPath, name) {
					let filePath = path.join(srcBasePath, curPath, name)
					let state = fs.statSync(filePath)
					if (state.isDirectory()) {
						let dir = fs.readdirSync(filePath)
						if (name.length > 0) {
							curPath = curPath + '/' + name
						}
						dir.forEach((index) => {
							if (index != 'src')
								parsePagesFile(curPath, index)
						})
					} else if (name === 'index.js') {
						// console.log('get index.js in ' + curPath)
						buildPagesFile(curPath)
					}
				}
				const buildPagesFile = function (curPath) {
					// 合并目录下的文件
					let jsPath = path.join(distPagesBasePath, curPath + '.js')
					let cssPath = path.join(distPagesBasePath, curPath + '.css')

					fs.writeFileSync(jsPath, '')
					fs.writeFileSync(cssPath, '')
					concatFile(curPath, '', 'js')
					concatFile(curPath, '', 'css')
					// 压缩产出的js及css
					// let md5jsFileName = minJsFun(distPagesBasePath, curPath)
					// let md5cssFileName = minCssFun(distPagesBasePath, curPath)
					let md5jsFileName = md5Fun(distPagesBasePath, curPath, 'js')
					let md5cssFileName = md5Fun(distPagesBasePath, curPath, 'css')
					// 记录路由与js css的对应关系
					let routerFile = require(path.join(srcBasePath, curPath, 'index.js'))
					relArr[curPath.slice(1)] = {}
					relArr[curPath.slice(1)]['js'] = md5jsFileName.slice(1)
					relArr[curPath.slice(1)]['css'] = md5cssFileName.slice(1)
					for (let i in routerFile.routes) {
						let oldComponent = routerFile.routes[i]['component'];
						if (oldComponent.indexOf('.') === 0) {
							oldComponent = oldComponent.substring(1);
						}
						routerFile.routes[i]['realComponent'] = curPath.slice(1) + oldComponent;
						routerFile.routes[i]['pkgName'] = pkgName
						routerFile.routes[i]['curPage'] = curPath.slice(1)
					}
					relArr['routers'] = relArr['routers'].concat(routerFile.routes)
				}


				const concatFile = function (srcBasePath, curPath, type) {
					let filePath = path.join(outputPagesBasePath, srcBasePath, curPath)
					let state = fs.statSync(filePath)
					if (state.isDirectory()) {
						let dir = fs.readdirSync(filePath)
						dir.forEach((index) => {
							concatFile(srcBasePath, curPath + '/' + index, type)
						})
					} else {
						if (endsWith(filePath, type) && !endsWith(curPath, 'index.js')) {
							// console.log('get (' + type + ') at :' + filePath)
							// console.log('srcBasePath:' + srcBasePath + '\n\n')
							let c = fs.readFileSync(filePath)
							let p
							if (type === 'js') {
								p = path.join(distPagesBasePath, srcBasePath + '.js')
							} else if (type === 'css') {
								p = path.join(distPagesBasePath, srcBasePath + '.css')
							}
							let b = fs.readFileSync(p)
							let cReplacedAssets = c.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
                            let bReplacedAssets = b.toString().replace(/'\/assets/g, '\'/' + pkgName + '/assets');
							fs.writeFileSync(p, bReplacedAssets + ' \n ' + cReplacedAssets)
						}
					}
				}
				const minJsFun = function (basePath, name) {
					let b = fs.readFileSync(path.join(basePath, name + '.js'))
					let minJs = uglifyjs.minify(b.toString())
					let md5js = crypto.createHash('md5')
					let md5jsStr = md5js.update(minJs.code).digest('hex')
					let md5jsFileName = name + '.' + md5jsStr + '.js'
					fs.writeFileSync(path.join(basePath, md5jsFileName), minJs.code)
					return md5jsFileName
				}

				const minCssFun = function (basePath, name) {
					let data = fs.readFileSync(path.join(basePath, name + '.css'))
					let minCss = cssMinify.minify(data.toString())
					let md5css = crypto.createHash('md5')
					let md5cssStr = md5css.update(minCss.styles).digest('hex')
					let md5cssFileName = name + '.' + md5cssStr + '.css'
					fs.writeFileSync(path.join(basePath, md5cssFileName), minCss.styles)
					return md5cssFileName
				}

				const md5Fun = function (basePath, name, type) {
					let b = fs.readFileSync(path.join(basePath, name + '.' + type))
					let md5js = crypto.createHash('md5')
					let md5jsStr = md5js.update(b.toString()).digest('hex')
					let md5jsFileName = name + '.' + md5jsStr + '.' + type
					fs.writeFileSync(path.join(basePath, md5jsFileName), b.toString())
					return md5jsFileName
				}
				const endsWith = function (str, endStr) {
					return str.slice(-endStr.length) == endStr
				}
				try {
					fs.mkdirSync(path.resolve(distBasePath))
				} catch (e) {

				}
				fs.mkdirSync(path.resolve(distPagesBasePath))
				fs.mkdirSync(path.resolve(distPagesBasePath + '/demo'))
				// 处理output产出的pages
				parsePagesFile('', '')
				parseWidgetFile('', '')

				// 处理output其他的产出
				const parseOtherFile = function (curPath, name) {
                    
					let filePath = path.join(outputBasePath, curPath, name)
					if (curPath === '/pages' || curPath === '/src')
						return
					let state = fs.statSync(filePath)
					if (state.isDirectory()) {
						let dir = fs.readdirSync(filePath)
						if (name.length > 0) {
							curPath = curPath + '/' + name
						}
						dir.forEach((index) => {
							parseOtherFile(curPath, index)
						})
					} else {
						let c = fs.readFileSync(filePath)
						let p
						if (endsWith(filePath, 'js')) {
							p = path.join(distCommonBasePath, '/index.js')
						} else if (endsWith(filePath, 'css')) {
							p = path.join(distCommonBasePath, '/index.css')
						}
						if (p) {
							let b = fs.readFileSync(p)
							fs.writeFileSync(p, b.toString() + ' \n ' + c.toString())
						}

					}
				}
				fs.mkdirSync(path.resolve(distCommonBasePath))
				let commonJsPath = path.join(distCommonBasePath, '/index.js')
				let commonCssPath = path.join(distCommonBasePath, '/index.css')
				fs.writeFileSync(commonJsPath, '')
				fs.writeFileSync(commonCssPath, '')
                parseOtherFile('', '')

				// 压缩产出的js及css
				// let md5jsFileName = minJsFun(distCommonBasePath, '/index')
				// let md5cssFileName = minCssFun(distCommonBasePath, '/index')
				let md5jsFileName = md5Fun(distCommonBasePath, '/index', 'js')
				let md5cssFileName = md5Fun(distCommonBasePath, '/index', 'css')
				relArr['common'] = {}
				relArr['common']['js'] = md5jsFileName.slice(1)
				relArr['common']['css'] = md5cssFileName.slice(1)

				fs.writeFileSync(distBasePath + '/config.js', JSON.stringify(relObj))

				//调用rm存在问题因此直接调用系统命令
				// execSync('rm -rf ./dist/output')
				const emptyDir = function (fileUrl) {
					let files = fs.readdirSync(fileUrl); //读取该文件夹
					files.forEach(function (file) {
						let stats = fs.statSync(fileUrl + '/' + file);
						if (stats.isDirectory()) {
							emptyDir(fileUrl + '/' + file);
						} else {
							fs.unlinkSync(fileUrl + '/' + file);
							//  console.log("删除文件"+fileUrl+'/'+file+"成功");
						}
					});
				}
				const rmEmptyDir = function (fileUrl) {
					let files = fs.readdirSync(fileUrl);
					if (files.length > 0) {
						let tempFile = 0;
						files.forEach(function (fileName) {
							tempFile++;
							rmEmptyDir(fileUrl + '/' + fileName);
						});
						if (tempFile == files.length) { //删除母文件夹下的所有字空文件夹后，将母文件夹也删除
							fs.rmdirSync(fileUrl);
							// console.log('删除空文件夹'+fileUrl+'成功');
						}
					} else {
						fs.rmdirSync(fileUrl);
						// console.log('删除空文件夹'+fileUrl+'成功');
					}
				}
				// emptyDir(path.resolve(__dirname, '../dist/' + pkgName + '/output' + langStr + '/'));
				// rmEmptyDir(path.resolve(__dirname, '../dist/' + pkgName + '/output' + langStr + '/'));
				console.log('Build completed' + lang);

				/**
				 * patch 相关
				 */
				// 复制文件到patch目录
				const buildPatch = function (targetPath) {
					if (targetPath.indexOf('/') === 0) {
						targetPath = targetPath.slice(1);
					}
					let patchDirsToMake = targetPath.split('/');
					let fileName;
					// 若目标目录不存在, 则表示指向文件, pop出文件名
					if (!fs.existsSync(path.resolve(distBasePath + '/' + targetPath))) {
						fileName = patchDirsToMake.pop();
					}
					makePatchDirs(patchDirsToMake);
					const realTargetPath = patchDirsToMake.join('/');
					copyFilesToPatch(realTargetPath, fileName);
				};
				// 在patch目录中创建目标目录
				const makePatchDirs = function (dirArr) {
					let currentPath = patchPath;
					for (i = 0; i < dirArr.length; i++) {
						currentPath += '/' + dirArr[i];
						if (!fs.existsSync(path.resolve(currentPath))) {
							fs.mkdirSync(path.resolve(currentPath));
						}
					}
				};
				const copyFilesToPatch = function (targetPath, fileName) {
					console.log('copying files to patch');
					const targetFilePath = path.resolve(distBasePath + '/' + targetPath);
					const dirs = fs.readdirSync(targetFilePath);
					dirs.forEach(dir => {
						// console.log('===========----------================', dir);
						const dirPath = path.resolve(targetFilePath + '/' + dir);
						const state = fs.statSync(dirPath);
						const patchFilePath = path.resolve(patchPath + '/' + targetPath);
						if (state.isDirectory()) {
							if (!fs.existsSync(patchFilePath)) {
								fs.mkdirSync(patchFilePath);
							}
							copyFilesToPatch(targetPath, fileName);
						} else if (fileName) {
							if (dir.slice(0, fileName.length + 1) === fileName + '.') {
								const fileContent = fs.readFileSync(dirPath);
								fs.writeFileSync(path.resolve(patchFilePath + '/' + dir), fileContent.toString());
							}
						} else {
							const fileContent = fs.readFileSync(dirPath);
							fs.writeFileSync(path.resolve(patchFilePath + '/' + dir), fileContent.toString());
						}
					});
					console.log('files copied');
				};
				const buildPatchConfig = function (configObj, targetRouter) {
					console.log('building patch config');
					let oldRoutersArr = configObj[pkgName].routers;
					// build router in config
					oldRoutersArr = oldRoutersArr.filter(router => {
						return targetRouter.indexOf(router.curPage) === -1;
					});
					const newRouterPatch = relArr.routers.filter(router => {
						return targetRouter.indexOf(router.curPage) !== -1;
					});
					configObj[pkgName].routers = oldRoutersArr.concat(newRouterPatch);
					// build file path in config
					let oldPkgConfig = configObj[pkgName];
					Object.keys(oldPkgConfig).forEach(key => {
						if (targetRouter.indexOf(key) !== -1) {
							delete oldPkgConfig[key];
						}
					});
					const newPkgConfig = relObj[pkgName];
					Object.keys(newPkgConfig).forEach(key => {
						if (targetRouter.indexOf(key) !== -1) {
							oldPkgConfig[key] = newPkgConfig[key];
						}
					});
					console.log('patch config built');
					return configObj;
				};

				// patch
				if (Array.isArray(patchPaths) && patchPaths.length > 0) {
					// patch根目录
					if (!fs.existsSync(patchBasePath)) {
						fs.mkdirSync(path.resolve(patchBasePath));
					}
					// patch子目录
					fs.mkdirSync(path.resolve(patchPath));
					// console.log('patch dir built: ', patchPath);
					// const testExists = fs.existsSync(path.resolve(distBasePath + '/pages/base/doc'));
					// console.log('=========================', path.resolve(distBasePath + '/pages/base/doc'),testExists);
					// spinner.stop()
					// process.exit()

					// patch config object
					const oldConfigContent = fs.readFileSync(path.resolve(__dirname + '/../config/oldConfig.js'));
					let oldConfig;
					try {
						oldConfig = JSON.parse(oldConfigContent);
					} catch (err) {
						oldConfig = {};
					}
					oldConfig[pkgName] = oldConfig[pkgName] || {};
					oldConfig[pkgName].routers = oldConfig[pkgName].routers || [];
					// build patch files
					patchPaths.forEach(patch => {
						buildPatch(patch);
						buildPatchConfig(oldConfig, patch);
					});
					fs.writeFileSync(path.resolve(patchPath + '/config.json'), JSON.stringify(oldConfig));
				}
			}

			let langues = config.build.languages;

			if (langues.length > 0) {
				for (let i = 0; i < langues.length; i++) {
					buildFun(langues[i]);
				}
			} else {
				buildFun();
			}


			spinner.stop()
			process.exit()
		});
	});
});