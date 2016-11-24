import 'babel-polyfill';
import {resolve as Pathresolve} from 'path';
import {readFile, writeFile, stat, mkdir} from 'fs';
import color from 'colors'
/**
 * 检查文件是否存在
 */
let currentMenu = process.cwd();

const hasFile = path => {
	return new Promise(resolve => {
		stat(Pathresolve(currentMenu,'./',path), (err, data) => {
			if(err) {
				resolve(undefined)
			}else if(data.isFile()){
				resolve({
					type : 'file'
				})
			}else if(data.isDirectory()) {
				resolve({
					type : 'dir'
				})
			}else{
				resolve(undefined)
			}
		})		
	})
}
/**
 * 查看文件内容
 */
const getFielContent = path => {
	return new Promise(resolve => {
		readFile(Pathresolve(currentMenu,'./',path), (err,data) => {
			if(err) throw new Error(err);
			resolve(data.toString());
		})
	})
}
/**
 * 写文件
 */
const writeFileContent = (path,content) => {
	return new Promise(reslove => {
		writeFile(Pathresolve(currentMenu,'./',path),content,'utf8',(err,data) => {
			if(err) throw new Error(err);

			reslove({
				success : true
			})
		})
	})
}
/**
 * 批量获取文件内容
 */
const getFileByArray = async function (arr,gdir) {

	let result = [];

	for(let i = 0; i < arr.length; i++) {
		let reg = arr[i];

		const titleReg = /(\[.*\])/;
		const contentReg = /(\(.*\))/;
		let title;
		let content;

		if(titleReg.test(reg)) {
			title = RegExp.$1 && 
						RegExp.$1.replace(/^\[/,'').replace(/\]$/,'');
		}
		if(contentReg.test(reg)) {
			content = RegExp.$1 && 
						  RegExp.$1.replace(/^\(/,'').replace(/\)$/,'');
		}

		if(content != 'README.md') {

			let data = await getFielContent(Pathresolve(currentMenu,'./',gdir,content));
			const replaceTitleReg = /(\#+\ +)/img;
			data = data.toString();
			data = data.replace(replaceTitleReg, str => {
				return `##${str}`
			})

			result.push(`<a name="${content.replace(/\.md$/,'')}">${title}</a>\n\n${data}`)
		}
	}

	return new Promise(res=> {
		res(result)
	})
}

const get = async function (gdir,rdir) {

	const hasReadMe = await hasFile(Pathresolve(rdir,'./README.md'));
	const hasSummary = await hasFile(Pathresolve(gdir,'./SUMMARY.md'));
	const URLMatch = /(\[.*\]\(.*\))/img;

	if(!hasReadMe) {
		console.log('不存在README文件，自动创建中....'.green)
		writeFile(Pathresolve(currentMenu,rdir,'./README.md'),'','utf8')
		console.log('README文件创建成功...'.green)
	}
	if(!hasSummary) {
		throw new Error('current dir do not have SUMMARY.md, program will break');
		return false;
	}

	let summaryContent = await getFielContent(Pathresolve(gdir,'./SUMMARY.md'));
	let currentContent = await getFielContent(Pathresolve(gdir,'./SUMMARY.md'));

	currentContent = currentContent.replace(URLMatch, str => {
		str = str.replace(/\.md/,'');
		let temp = str.split(/\]\ *\(/img);
		return temp.join('](#');
	})

	const summaryStart2TitleReg = /[^\s]+\ +/img;
	summaryContent = summaryContent.replace(summaryStart2TitleReg,str=>{
		return `# `;
	})

	
	let fileArray = await getFileByArray(summaryContent.match(URLMatch),gdir);

	let index = 0;

	summaryContent = summaryContent.replace(URLMatch, function (reg){
		return fileArray[index++];
	})

	let result = await writeFileContent(Pathresolve(currentMenu,'./',rdir,'./README.md'),`${currentContent}\n\n${summaryContent}`)

	console.log(result.success ? 'gitbook相关内容回写成功'.green : '回写失败，请重试'.red)
}

export default get;