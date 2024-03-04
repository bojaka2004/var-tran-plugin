const vscode = require('vscode');
const { baiduTranslator, bingTranslator, iflyrecTranslator, Languages } = require('node-translates');



var TRAN_SELECT = null;


// 翻译函数
async function translate(text) {
	try {
		// 输出翻译引擎
		vscode.window.showInformationMessage(`Translator: ${TRAN_SELECT}`);
		if (TRAN_SELECT === "baiduTranslator") {
			return await baiduTranslator(text);
		} else if (TRAN_SELECT === "iflyrecTranslator") {
			return await iflyrecTranslator(text);
		}
		else {
			return await bingTranslator(text);
		}
	} catch (error) {
		vscode.window.showErrorMessage('Translation failed: ' + error.message);
	}
}


// 英文翻译为中文
async function translate_en_to_zh(text) {
	try {
		// 输出翻译引擎
		vscode.window.showInformationMessage(`Translator: ${TRAN_SELECT}`);
		if (TRAN_SELECT === "baiduTranslator") {
			return await baiduTranslator({ text, from: Languages.EN, to: Languages.ZH });
		} else if (TRAN_SELECT === "iflyrecTranslator") {
			return await iflyrecTranslator({ text, from: Languages.EN, to: Languages.ZH });
		}
		else {
			return await bingTranslator({ text, from: Languages.EN, to: Languages.ZH });
		}
	} catch (error) {
		vscode.window.showErrorMessage('Translation failed: ' + error.message);
	}
}


// 处理翻译后的文本转化为小写下划线命名发去除空格
function toUnderlineCase(str) {
	return str.toLowerCase().replace(/\s+/g, '_');
}


// 处理翻译后的文本转化为小驼峰命名 发去除空格
function toCamelCase(str) {
	return str.toLowerCase().replace(/\s+/g, '_').replace(/_([a-z])/g, (all, letter) => letter.toUpperCase());
}


// 处理翻译后的文本转化为大驼峰命名 发去除空格
function toPascalCase(str) {
	return str.toLowerCase().replace(/\s+/g, '_').replace(/_([a-z])/g, (all, letter) => letter.toUpperCase()).replace(/^[a-z]/, letter => letter.toUpperCase());
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// 读取配置选择翻译
	TRAN_SELECT = vscode.workspace.getConfiguration('varTranPlugin').TranslatorSelection;

	// 监听配置变化
	vscode.workspace.onDidChangeConfiguration(event => {
		if (event.affectsConfiguration && event.affectsConfiguration('varTranPlugin.TranslatorSelection')) {
			TRAN_SELECT = vscode.workspace.getConfiguration('varTranPlugin').TranslatorSelection;
			vscode.window.showInformationMessage(`Change Translator: ${TRAN_SELECT}`);
		}
	});


	// 普通翻译
	let disposable = vscode.commands.registerCommand('var-tran-plugin.translate', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// 获取选中的文本
			const text = document.getText(selection);

			// 如果选中的文本为空
			if (!text) {
				vscode.window.showErrorMessage('No text selected');
				return;
			}

			try {
				// 异步调用翻译函数并等待其结果
				const replacedObject = await translate({ text, from: Languages.ZH, to: Languages.EN });


				// 确保replacedObject有text属性和dst属性
				if (replacedObject.text && replacedObject.dst) {
					// 用替换后的文本替换原本选中的文本
					await editor.edit(editBuilder => {
						editBuilder.replace(selection, replacedObject.dst);
					});
				} else {
					// 如果 replacedText 不是字符串，处理错误
					vscode.window.showErrorMessage('Translation did not return a string.');
				}
			} catch (error) {
				// 处理可能出现的错误
				vscode.window.showErrorMessage('Error replacing text: ' + error.message);
			}
		}
	});


	// 小驼峰命名
	let disposable_1 = vscode.commands.registerCommand('var-tran-plugin.translate_camelCase', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// 获取选中的文本
			const text = document.getText(selection);

			// 如果选中的文本为空
			if (!text) {
				vscode.window.showErrorMessage('No text selected');
				return;
			}

			try {
				// 异步调用翻译函数并等待其结果
				const replacedObject = await translate({ text, from: Languages.ZH, to: Languages.EN });


				// 确保replacedObject有text属性和dst属性
				if (replacedObject.text && replacedObject.dst) {
					// 用替换后的文本替换原本选中的文本
					await editor.edit(editBuilder => {
						editBuilder.replace(selection, toCamelCase(replacedObject.dst));
					});
				} else {
					// 如果 replacedText 不是字符串，处理错误
					vscode.window.showErrorMessage('Translation did not return a string.');
				}
			} catch (error) {
				// 处理可能出现的错误
				vscode.window.showErrorMessage('Error replacing text: ' + error.message);
			}
		}
	});



	// 大驼峰命名
	let disposable_2 = vscode.commands.registerCommand('var-tran-plugin.translate_PascalCase', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// 获取选中的文本
			const text = document.getText(selection);

			// 如果选中的文本为空
			if (!text) {
				vscode.window.showErrorMessage('No text selected');
				return;
			}

			try {
				// 异步调用翻译函数并等待其结果
				const replacedObject = await translate({ text, from: Languages.ZH, to: Languages.EN });


				// 确保replacedObject有text属性和dst属性
				if (replacedObject.text && replacedObject.dst) {
					// 用替换后的文本替换原本选中的文本
					await editor.edit(editBuilder => {
						editBuilder.replace(selection, toPascalCase(replacedObject.dst));
					});
				} else {
					// 如果 replacedText 不是字符串，处理错误
					vscode.window.showErrorMessage('Translation did not return a string.');
				}
			} catch (error) {
				// 处理可能出现的错误
				vscode.window.showErrorMessage('Error replacing text: ' + error.message);
			}
		}
	});


	// 下划线命名
	let disposable_3 = vscode.commands.registerCommand('var-tran-plugin.translate_snake_case', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// 获取选中的文本
			const text = document.getText(selection);

			// 如果选中的文本为空
			if (!text) {
				vscode.window.showErrorMessage('No text selected');
				return;
			}

			try {
				// 异步调用翻译函数并等待其结果
				const replacedObject = await translate({ text, from: Languages.ZH, to: Languages.EN });


				// 确保replacedObject有text属性和dst属性
				if (replacedObject.text && replacedObject.dst) {
					// 用替换后的文本替换原本选中的文本
					await editor.edit(editBuilder => {
						editBuilder.replace(selection, toUnderlineCase(replacedObject.dst));
					});
				} else {
					// 如果 replacedText 不是字符串，处理错误
					vscode.window.showErrorMessage('Translation did not return a string.');
				}
			} catch (error) {
				// 处理可能出现的错误
				vscode.window.showErrorMessage('Error replacing text: ' + error.message);
			}
		}
	});

	// 英文翻译为中文
	let disposable_4 = vscode.commands.registerCommand('var-tran-plugin.translate_china', async () => {
		const editor = vscode.window.activeTextEditor;
		if (editor) {
			const document = editor.document;
			const selection = editor.selection;

			// 获取选中的文本
			const text = document.getText(selection);

			// 如果选中的文本为空
			if (!text) {
				vscode.window.showErrorMessage('No text selected');
				return;
			}

			try {
				// 异步调用翻译函数并等待其结果
				const replacedObject = await translate_en_to_zh(text);


				// 确保replacedObject有text属性和dst属性
				if (replacedObject.text && replacedObject.dst) {
					// 用替换后的文本替换原本选中的文本
					await editor.edit(editBuilder => {
						editBuilder.replace(selection, replacedObject.dst);
					});
				} else {
					// 如果 replacedText 不是字符串，处理错误
					vscode.window.showErrorMessage('Translation did not return a string.');
				}
			} catch (error) {
				// 处理可能出现的错误
				vscode.window.showErrorMessage('Error replacing text: ' + error.message);
			}
		}
	});





	// 注册命令
	context.subscriptions.push(disposable);
	context.subscriptions.push(disposable_1);
	context.subscriptions.push(disposable_2);
	context.subscriptions.push(disposable_3);
	context.subscriptions.push(disposable_4);

}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
