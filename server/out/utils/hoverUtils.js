"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const suggestions_1 = require("../suggestions");
exports.validateByPos = (pos, node) => node.posStart <= pos && node.posEnd >= pos;
exports.getExpressionType = (resultType) => {
    if ('type' in resultType) {
        return resultType.type;
    }
    if ('unionTypes' in resultType) {
        return resultType.unionTypes.map((t) => exports.getExpressionType(t)).join(' | ');
    }
    if ('listOf' in resultType) {
        return `${exports.getExpressionType(resultType.listOf)}[]`;
    }
    return '';
};
exports.getFuncHoverByNode = (n) => {
    const functionName = n.name.value;
    const args = n.argList;
    const argumentString = args.length !== 0
        ? args.map(({ argName: { value }, type }) => `${value}: ${!type.typeParam
            ? !!args ? type.typeName.value : ''
            : `${type.typeName.value}[${type.typeParam.value.typeList.map(x => x.typeName.value).join(' | ')}]`}`).join(', ')
        : '';
    return `${functionName}(${argumentString}): ${exports.getExpressionType(n.expr.resultType)}`;
};
exports.getFunctionCallHover = (n) => {
    const name = n.name.value;
    // @ts-ignore
    const args = n.args.length !== 0 ? n.args.map(x => `${x.resultType.type.toLowerCase()}: ${x.resultType.type}`).join(', ') : '';
    // @ts-ignore
    return `${name}(${args}): ${n.resultType.type}`;
};
exports.getFuncHoverByTFunction = (f) => {
    const args = f.args.map(({ name, type }) => {
        if (Array.isArray(type)) {
            const types = type.map((x) => x.typeName);
            return `${name}: ${types.join(' | ')}`;
        }
        else
            return `${name}: ${type}`;
    });
    return `${f.name}(${args.join(', ')}): ${convertResultType(f.resultType)}`;
};
exports.getFuncArgNameHover = ({ argName: { value: name }, type }) => {
    const argType = !type.typeParam
        ? type.typeName.value
        : `${type.typeName.value}[${type.typeParam.value.typeList.map(x => x.typeName.value).join(' | ')}]`;
    return (`${name}: ${argType}`);
};
exports.getTypeDoc = (item, isRec) => {
    const type = item.type;
    let typeDoc = 'Unknown';
    switch (true) {
        case suggestions_1.isPrimitive(type):
            typeDoc = type;
            break;
        case suggestions_1.isStruct(type):
            typeDoc = isRec ? type.typeName :
                `**${type.typeName}**(\n- ` + type.fields
                    .map((v) => `${v.name}: ${exports.getTypeDoc(v, true)}`).join('\n- ') + '\n\n)';
            break;
        case suggestions_1.isUnion(type):
            typeDoc = type.map(field => suggestions_1.isStruct(field) ? field.typeName : field).join('|');
            break;
        case suggestions_1.isList(type):
            typeDoc = `LIST[ ` +
                `${type.listOf.typeName || type.listOf}]`;
            break;
    }
    return typeDoc;
};
exports.getFuncArgumentOrTypeByPos = (node, pos) => {
    try {
        let out = null;
        node.argList.forEach((arg) => {
            if (exports.validateByPos(pos, arg.argName)) {
                out = exports.getFuncArgNameHover(arg);
            }
            else {
                // for (const {typeName} of arg.type) {
                const { typeName } = arg.type;
                if (exports.validateByPos(pos, typeName)) {
                    const type = suggestions_1.default.types.find(({ name }) => name === typeName.value);
                    out = type ? exports.getTypeDoc(type) : typeName.value;
                    // break;
                }
                // }
            }
        });
        return out;
    }
    catch (e) {
        throw new Error(e);
    }
};
function convertResultType(type) {
    const result = [];
    function recursiveFunc(type, result) {
        //primitive
        if (typeof type === 'string') {
            result.push(type);
        }
        //union
        if (Array.isArray(type)) {
            type.map(x => recursiveFunc(x, result));
        }
        //list
        if (type.listOf !== undefined) {
            const result = [];
            recursiveFunc(type.listOf, result);
            result.push(`List[${result.join(', ')}]`);
        }
        //struct
        if (type.typeName !== undefined) {
            result.push(type.typeName);
        }
    }
    recursiveFunc(type, result);
    return result.join(', ');
}
exports.convertResultType = convertResultType;
//# sourceMappingURL=hoverUtils.js.map