"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const ride_js_1 = require("@waves/ride-js");
const suggestions_1 = require("./suggestions");
const index_1 = require("./utils/index");
const hoverUtils_1 = require("./utils/hoverUtils");
class LspService {
    validateTextDocument(document) {
        const text = document.getText();
        try {
            const parsedResult = ride_js_1.parseAndCompile(text, 3);
            if (index_1.isParseError(parsedResult))
                throw parsedResult.error;
            const info = ride_js_1.scriptInfo(text);
            if ('error' in info)
                throw info.error;
            const { stdLibVersion, scriptType } = info;
            suggestions_1.default.updateSuggestions(stdLibVersion, scriptType === 2);
            return (parsedResult.errorList || [])
                .map(({ posStart, posEnd, msg: message }) => {
                const start = index_1.offsetToRange(posStart, text);
                const end = index_1.offsetToRange(posEnd, text);
                return ({
                    range: vscode_languageserver_types_1.Range.create(vscode_languageserver_types_1.Position.create(start.line, start.character), vscode_languageserver_types_1.Position.create(end.line, end.character)),
                    severity: vscode_languageserver_types_1.DiagnosticSeverity.Error,
                    message: `${message}, start: ${start.line + 1}:${start.character + 1}; len: ${posEnd - posStart}`
                });
            });
        }
        catch (e) {
            console.error(e);
        }
        return [];
    }
    completion(document, position) {
        const offset = document.offsetAt(position);
        const text = document.getText();
        const character = text.substring(offset - 1, offset);
        const cursor = index_1.rangeToOffset(position.line, position.character, text);
        let items = [];
        const parsedResult = ride_js_1.parseAndCompile(text, 3);
        if (index_1.isParseError(parsedResult))
            throw parsedResult.error;
        const ast = parsedResult.exprAst || parsedResult.dAppAst;
        if (!ast)
            return [];
        const node = index_1.getNodeByOffset(ast, cursor);
        if (character === '@') {
            items = [
                { label: 'Callable', kind: vscode_languageserver_types_1.CompletionItemKind.Interface },
                { label: 'Verifier', kind: vscode_languageserver_types_1.CompletionItemKind.Interface }
            ];
        }
        else if (character === ':') {
            items = suggestions_1.default.types.reduce((acc, t) => [...acc, index_1.convertToCompletion(t)], new Array());
        }
        else if (index_1.isIBlock(node) && index_1.isILet(node.dec)) {
            if (index_1.isIGetter(node.dec.expr)) {
                items = index_1.getNodeType(node.dec.expr).map((item) => index_1.convertToCompletion(item));
            }
            if (index_1.isPrimitiveNode(node.dec.expr) && 'type' in node.dec.expr.resultType) {
                items = index_1.getPostfixFunctions(node.dec.expr.resultType.type)
                    .map(({ name: label, doc: detail }) => ({ label, detail, kind: vscode_languageserver_types_1.CompletionItemKind.Field }));
            }
            if (index_1.isIRef(node.dec.expr)) {
                const refDocs = suggestions_1.default.globalVariables
                    .filter(({ name, doc }) => node.dec.expr.name === name);
                if (refDocs) {
                    items = index_1.intersection(refDocs.map(({ type }) => type)).map((item) => index_1.convertToCompletion(item));
                }
            }
            if ('type' in node.dec.expr.resultType) {
                items = [...items, ...index_1.getPostfixFunctions(node.dec.expr.resultType.type)
                        .map(({ name: label, doc: detail }) => ({ label, detail, kind: vscode_languageserver_types_1.CompletionItemKind.Function }))];
            }
        }
        if (items.length === 0 && character != '.') {
            const { ctx } = index_1.isIScript(node) ? node.expr : node;
            items = index_1.getCompletionDefaultResult(ctx);
        }
        const obj = {};
        items.forEach(function (d) {
            if (!obj[d.label]) {
                obj[d.label] = { label: d.label, kind: d.kind, detail: d.detail };
            }
        });
        items = Object.values(obj);
        return { isIncomplete: false, items };
    }
    hover(document, position) {
        const text = document.getText();
        const range = index_1.rangeToOffset(position.line, position.character, document.getText());
        const parsedResult = ride_js_1.parseAndCompile(text, 3);
        if (index_1.isParseError(parsedResult))
            throw parsedResult.error;
        const ast = parsedResult.exprAst || parsedResult.dAppAst;
        // console.log('ast', JSON.stringify(ast))
        if (!ast)
            return { contents: [] };
        const cursor = index_1.rangeToOffset(position.line, position.character, text);
        // console.log('cursor', cursor)
        const node = index_1.getNodeByOffset(ast, cursor);
        // console.log('node', JSON.stringify(node))
        let contents = [];
        if (index_1.isILet(node)) {
            contents.push(`${node.name.value}: ${index_1.getExpressionType(node.expr.resultType)}`);
        }
        else if (index_1.isIGetter(node)) {
            contents.push(index_1.getExpressionType(node.resultType));
        }
        else if (index_1.isIRef(node)) {
            const refDocs = suggestions_1.default.globalVariables
                .filter(({ name, doc }) => node.name === name && doc != null).map(({ doc }) => doc);
            const defCtx = node.ctx.find(({ name }) => name === node.name);
            if (defCtx) {
                const def = index_1.getNodeByOffset(ast, defCtx.posStart);
                if (index_1.isILet(def)) {
                    contents.push(`${def.name.value}: ${index_1.getExpressionType(def.expr.resultType)}`);
                }
            }
            // @ts-ignore
            // node.name && node.resultType.type && contents.push(`${node.name}: ${getExpressionType(node.resultType.type)}`)
            contents = [...contents, ...refDocs];
        }
        else if (index_1.isIFunc(node)) {
            contents.push(index_1.getFuncArgumentOrTypeByPos(node, cursor) || index_1.getFuncHoverByNode(node));
        }
        else if (index_1.isIFunctionCall(node)) {
            const findedGlobalFunc = suggestions_1.default.functions.find(({ name }) => node.name.value === name);
            let result = !!findedGlobalFunc ? index_1.getFuncHoverByTFunction(findedGlobalFunc) : hoverUtils_1.getFunctionCallHover(node);
            contents = [...contents, result];
        }
        contents = [...contents, `line: ${position.line}, character: ${position.character}, position: ${range}, posStart: ${ast.posStart}`];
        return { contents };
    }
    definition(document, { line, character }) {
        const text = document.getText();
        const parsedResult = ride_js_1.parseAndCompile(text, 3);
        if (index_1.isParseError(parsedResult))
            throw parsedResult.error;
        const ast = parsedResult.exprAst || parsedResult.dAppAst;
        if (!ast)
            return null;
        // console.log('ast', JSON.stringify(ast))
        const node = index_1.getNodeByOffset(ast, index_1.rangeToOffset(line, character, text));
        // console.log('node', node)
        // console.log('Offset', rangeToOffset(line, character, text))
        if (!node.ctx)
            return null;
        let nodeName = null;
        // console.log('node', JSON.stringify(node))
        if (index_1.isIRef(node))
            nodeName = node.name;
        else if (index_1.isIFunctionCall(node))
            nodeName = node.name.value;
        // console.log('nodeName', nodeName)
        const def = node.ctx
            .find(({ name, posEnd, posStart }) => name === nodeName && posEnd !== -1 && posStart !== -1);
        // console.log('def', def)
        if (def == null)
            return null;
        const start = index_1.offsetToRange(def.posStart + 1, text), end = index_1.offsetToRange(def.posEnd, text);
        // console.log('start', start)
        return vscode_languageserver_types_1.Location.create(document.uri, { start, end });
    }
    signatureHelp(document, position) {
        const text = document.getText();
        const cursor = index_1.rangeToOffset(position.line, position.character, text);
        const parsedResult = ride_js_1.parseAndCompile(text, 3);
        if (index_1.isParseError(parsedResult))
            throw parsedResult.error;
        const ast = parsedResult.exprAst || parsedResult.dAppAst;
        // @ts-ignore
        const node = index_1.getNodeByOffset(ast, cursor);
        console.log('node', JSON.stringify(node));
        const func = suggestions_1.default.functions.find(x => x.name === node.name.value)
            || suggestions_1.default.types.find(x => x.name === node.name.value);
        let args;
        if (!!func) {
            if (func.args) {
                args = func.args.reduce((acc, x) => [...acc, { label: x.name }], []);
            }
            // @ts-ignore
            if (func.type.fields) {
                // @ts-ignore
                args = func.type.fields.reduce((acc, x) => [...acc, { label: x.name }], []);
            }
        }
        return {
            activeParameter: null,
            activeSignature: null,
            signatures: args
        };
    }
    // public completion(document: TextDocument, position: Position) {
    //     const offset = document.offsetAt(position);
    //     const text = document.getText();
    //     const character = text.substring(offset - 1, offset);
    //     const line = document.getText({start: {line: position.line, character: 0}, end: position});
    //     const p: TPosition = {row: position.line, col: position.character + 1};
    //
    //     utils.ctx.updateContext(text);
    //
    //     let result: CompletionItem[] = [];
    //     try {
    //         let wordBeforeDot = line.match(/([a-zA-z0-9_]+)\.[a-zA-z0-9_]*\b$/);     // get text before dot (ex: [tx].test)
    //         let firstWordMatch = (/([a-zA-z0-9_]+)\.[a-zA-z0-9_.]*$/gm).exec(line) || [];
    //         switch (true) {
    //             case (character === '.' || wordBeforeDot !== null):                 //auto completion after clicking on a dot
    //                 let inputWord = (wordBeforeDot === null)                        //get word before dot or last word in line
    //                     ? (utils.getLastArrayElement(line.match(/\b(\w*)\b\./g))).slice(0, -1)
    //                     : wordBeforeDot[1];
    //
    //                 //TODO Make fashionable humanly
    //                 if (firstWordMatch.length >= 2 && utils.ctx.getVariable(firstWordMatch[1])) {
    //                     result = [
    //                         ...utils.getCompletionResult(firstWordMatch[0].split('.')),
    //                         ...utils.checkPostfixFunction(inputWord).map(({name}) => ({label: name}))
    //                     ];
    //                 }
    //                 break;
    //             //auto completion after clicking on a colon or pipe
    //             case (line.match(/([a-zA-z0-9_]+)[ \t]*[|:][ \t]*[a-zA-z0-9_]*$/) !== null):
    //                 result = utils.getColonOrPipeCompletionResult(text, p);
    //                 break;
    //             case (['@'].indexOf(character) !== -1):
    //                 result = [
    //                     {label: 'Callable', kind: CompletionItemKind.Interface},
    //                     {label: 'Verifier', kind: CompletionItemKind.Interface}
    //                 ];
    //                 break;
    //             default:
    //                 result = utils.getCompletionDefaultResult(p);
    //                 break;
    //         }
    //     } catch (e) {
    //         // console.error(e);
    //     }
    //
    //     return {
    //         isIncomplete: false,
    //         items: result
    //     } as CompletionList;
    // }
    //
    // public signatureHelp(document: TextDocument, position: Position): SignatureHelp {
    //
    //     const offset = document.offsetAt(position);
    //     const character = document.getText().substring(offset - 1, offset);
    //
    //     const textBefore = document.getText({start: {line: 0, character: 0}, end: position});
    //     const line = document.getText({start: {line: position.line, character: 0}, end: position});
    //
    //     const isPostfix = /[a-zA-z0-9_]+\.\b([a-zA-z0-9_]+)\b[ \t]*\(/.test(line);
    //
    //     const lastFunction = utils.getLastArrayElement(textBefore.match(/\b([a-zA-z0-9_]*)\b[ \t]*\(/g));
    //     const functionArguments = utils.getLastArrayElement(textBefore.split(lastFunction || ''));
    //
    //     let fail = false;
    //
    //     if (character === ')' || functionArguments.split(')').length > 1)
    //         fail = true;
    //
    //     return {
    //         activeParameter: fail ? null : functionArguments.split(',').length - 1,
    //         activeSignature: fail ? null : 0,
    //         //get result by last function call
    //         signatures: fail ? [] : utils.getSignatureHelpResult(lastFunction.slice(0, -1), isPostfix),
    //     };
    // }
    completionResolve(item) {
        return item;
    }
}
exports.LspService = LspService;
//# sourceMappingURL=LspService.js.map