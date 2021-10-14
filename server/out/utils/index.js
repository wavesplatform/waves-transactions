"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hoverUtils_1 = require("./hoverUtils");
exports.getExpressionType = hoverUtils_1.getExpressionType;
exports.getFuncArgumentOrTypeByPos = hoverUtils_1.getFuncArgumentOrTypeByPos;
exports.getFuncHoverByNode = hoverUtils_1.getFuncHoverByNode;
exports.getFuncHoverByTFunction = hoverUtils_1.getFuncHoverByTFunction;
exports.getTypeDoc = hoverUtils_1.getTypeDoc;
exports.validateByPos = hoverUtils_1.validateByPos;
const completionUtils_1 = require("./completionUtils");
exports.convertToCompletion = completionUtils_1.convertToCompletion;
exports.getCompletionDefaultResult = completionUtils_1.getCompletionDefaultResult;
exports.getNodeType = completionUtils_1.getNodeType;
exports.getPostfixFunctions = completionUtils_1.getPostfixFunctions;
exports.intersection = completionUtils_1.intersection;
const definitionUtils_1 = require("./definitionUtils");
exports.getFunctionDefinition = definitionUtils_1.getFunctionDefinition;
exports.isIConstByteStr = (node) => node != null && node.type === 'CONST_BYTESTR';
exports.isIConstLong = (node) => node != null && node.type === 'CONST_LONG';
exports.isIConstStr = (node) => node != null && node.type === 'CONST_STRING';
exports.isITrue = (node) => node != null && node.type === 'TRUE';
exports.isIFalse = (node) => node != null && node.type === 'FALSE';
exports.isIRef = (node) => node != null && node.type === 'REF';
exports.isIBlock = (node) => node != null && node.type === 'BLOCK';
exports.isILet = (node) => node != null && node.type === 'LET';
exports.isIIf = (node) => node != null && node.type === 'IF';
exports.isIFunctionCall = (node) => node != null && node.type === 'FUNCTION_CALL';
exports.isIGetter = (node) => node != null && node.type === 'GETTER';
exports.isIMatch = (node) => node != null && node.type === 'MATCH';
exports.isIFunc = (node) => node != null && node.type === 'FUNC';
exports.isIScript = (node) => node != null && node.type === 'SCRIPT';
exports.isIDApp = (node) => node != null && node.type === 'DAPP';
exports.isIAnnotatedFunc = (node) => node != null && node.type === 'ANNOTATEDFUNC';
exports.isIAnnotation = (node) => node != null && node.type === 'ANNOTATION';
exports.isParseError = (res) => 'error' in res;
exports.isPrimitiveNode = (node) => exports.isIConstStr(node) || exports.isIConstByteStr(node) || exports.isIConstLong(node) || exports.isITrue(node) || exports.isIFalse(node);
const findNodeByFunc = (node, f) => {
    if (exports.isIBlock(node)) {
        return node.dec.name.value.startsWith('$match')
            ? (f(node.body.ifTrue) || f(node.body.ifFalse))
            : (f(node.body) || f(node.dec));
    }
    else if (exports.isIDApp(node)) {
        return node.decList.find(node => f(node) != null) || node.annFuncList.find(node => f(node) != null) || null;
    }
    else if (exports.isILet(node)) {
        return f(node.expr);
    }
    else if (exports.isIFunc(node) || exports.isIScript(node)) {
        return f(node.expr);
    }
    else if (exports.isIIf(node)) {
        return f(node.ifTrue) || f(node.ifFalse) || f(node.cond);
    }
    else if (exports.isIFunctionCall(node)) {
        return node.args.find(node => f(node) != null) || null;
    }
    else if (exports.isIGetter(node)) {
        return f(node.ref);
    }
    else {
        return null;
    }
};
const findNodeByDApp = (node, position) => {
    const validateNodeByPos = (node, pos) => (node.posStart <= pos && node.posEnd >= pos) ? node : null;
    const annotatedFunc = findAnnotatedFunc(node.annFuncList, position);
    const constants = !!annotatedFunc ? getConstantsFromFunction(annotatedFunc.func) : [];
    const constant = getSelectedConst(constants, position);
    return node.decList.find(node => validateNodeByPos(node, position) != null) || constant || validateNodeByPos(annotatedFunc.func, position);
};
function offsetToRange(startOffset, content) {
    const sliced = content.slice(0, startOffset).split('\n');
    const line = sliced.length - 1, character = sliced[line].length === 0 ? 0 : sliced[line].length - 1;
    return { line, character };
}
exports.offsetToRange = offsetToRange;
function rangeToOffset(line, character, content) {
    const split = content.split('\n');
    const position = Array.from({ length: line }, (_, i) => i)
        .reduce((acc, i) => acc + split[i].length + 1, 0) + character;
    return line !== 0 ? position + 1 : position;
}
exports.rangeToOffset = rangeToOffset;
function getNodeByOffset(node, pos) {
    console.log(node.type);
    const validateNodeByPos = (node, pos) => (node) => {
        console.log(node);
        return (node.posStart <= pos && node.posEnd >= pos) ? node : null;
    };
    if (!exports.isIDApp(node)) {
        const goodChild = findNodeByFunc(node, validateNodeByPos(node, pos));
        return (goodChild) ? getNodeByOffset(goodChild, pos) : node;
    }
    else {
        const goodChild = findNodeByDApp(node, pos);
        return (goodChild) ? getNodeByOffset(goodChild, pos) : node;
    }
}
exports.getNodeByOffset = getNodeByOffset;
function findAnnotatedFunc(funcList, pos) {
    return Array.isArray(funcList) ? funcList.find(i => (i.posStart <= pos) && (i.posEnd >= pos)) : null;
}
exports.findAnnotatedFunc = findAnnotatedFunc;
function getConstantsFromFunction(funcNode) {
    const result = [];
    const recursiveFunc = (node) => {
        if (exports.isIBlock(node)) {
            result.push(node.dec);
            recursiveFunc(node.body);
        }
    };
    recursiveFunc(funcNode.expr);
    return result;
}
exports.getConstantsFromFunction = getConstantsFromFunction;
function getSelectedConst(constants, position) {
    const validateNodeByPos = (node, pos) => !!node && !!node.posStart && pos >= node.posStart && pos <= node.posEnd;
    return constants.find(node => {
        return validateNodeByPos(node, position);
    });
}
exports.getSelectedConst = getSelectedConst;
//# sourceMappingURL=index.js.map