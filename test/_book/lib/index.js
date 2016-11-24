import 'babel-polyfill';
import {resolve as Pathresolve} from 'path';
import {readFile, writeFile, stat} from 'fs';
import {parse} from 'markdown-to-ast';
/**
 * 检查文件是否存在
 */
const hasFile = path => {
	return new Promise(resolve => {
		stat(Pathresolve(process.cwd(),'./',path), (err, data) => {
			if(data.isFile()){
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
		readFile(Pathresolve(process.cwd(),'./',path), (err,data) => {
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
		writeFile(Pathresolve(process.cwd(),'./',path),content,'utf8',(err,data) => {
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
const getFileByArray = async function (arr) {

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
			let data = await getFielContent(content);
			const replaceTitleReg = /(\#+\ +)/img;
			data = data.toString();
			data = data.replace(replaceTitleReg, str => {
				return `##${str}`
			})
			result.push(`${title}\n\n${data}`)
		}
	}

	return new Promise(res=> {
		res(result)
	})
}

const get = async function () {

	const hasReadMe = await hasFile('./README.md');
	const hasSummary = await hasFile('./SUMMARY.md');

	if(!hasReadMe) {
		throw new Error('current dir do not have README.md');
		return false;
	}
	if(!hasSummary) {
		throw new Error('current dir do not have SUMMARY.md');
		return false;
	}

	let summaryContent = await getFielContent('./SUMMARY.md');

	const summaryStart2TitleReg = /[^\s]+\ +/img;
	summaryContent = summaryContent.replace(summaryStart2TitleReg,str=>{
		return `# `;
	})

	const URLMatch = /(\[.*\]\(.*\))/img;
	let fileArray = await getFileByArray(summaryContent.match(URLMatch));

	let index = 0;

	summaryContent = summaryContent.replace(URLMatch, function (reg){
		return fileArray[index++];
	})

	let result = await writeFileContent('./README.md',summaryContent)
	console.log(result.success ? '回写成功' : '回写失败，请重试')
}

get().then().catch(e=>console.log(e));