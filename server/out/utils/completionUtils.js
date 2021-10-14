"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const suggestions_1 = require("../suggestions");
const index_1 = require("./index");
exports.getPostfixFunctions = (type) => {
    return suggestions_1.default.functions.filter(({ args }) => {
        if (!args[0] || !type)
            return false;
        if (suggestions_1.isPrimitive(type) && suggestions_1.isPrimitive(args[0].type) && type === args[0].type)
            return true;
        if (suggestions_1.isStruct(type) && suggestions_1.isStruct(args[0].type) && type.typeName === args[0].type.typeName)
            return true;
        if (suggestions_1.isStruct(type) && suggestions_1.isUnion(args[0].type)) {
            let currentType = args[0].type[0];
            if (suggestions_1.isStruct(currentType) && type.typeName === currentType.typeName) {
                return true;
            }
        }
        if (args[0].type === 'PARAMETERIZEDUNION(List(TYPEPARAM(84), Unit))' && suggestions_1.isUnion(type)) {
            return type.some(item => suggestions_1.isStruct(item) && item.typeName === 'Unit');
        }
        return false;
    });
};
exports.convertToCompletion = (field) => {
    let detail = '';
    if (suggestions_1.isPrimitive(field.type)) {
        detail = field.type;
    }
    else if (suggestions_1.isList(field.type)) {
        detail = suggestions_1.listToString(field.type);
    }
    else if (suggestions_1.isStruct(field.type)) {
        detail = field.type.typeName;
    }
    else if (suggestions_1.isUnion(field.type)) {
        detail = suggestions_1.unionToString(field.type);
    }
    return { label: field.name, detail, kind: vscode_languageserver_types_1.CompletionItemKind.Field };
};
exports.getCompletionDefaultResult = (ctx = []) => [
    ...ctx.map(({ name: label }) => ({ label, kind: vscode_languageserver_types_1.CompletionItemKind.Variable })),
    ...suggestions_1.default.globalVariables.map(({ name: label, doc: detail }) => ({ label, kind: vscode_languageserver_types_1.CompletionItemKind.Variable, detail })),
    ...suggestions_1.default.globalSuggestions,
    ...suggestions_1.default.types.filter(({ type }) => suggestions_1.isStruct(type)).map(({ name: label }) => ({ kind: vscode_languageserver_types_1.CompletionItemKind.Class, label })),
];
function getNodeType(node) {
    const go = (node) => {
        if (index_1.isIGetter(node)) {
            const def = go(node.ref);
            const field = def.find(({ name }) => name === node.field.value);
            if (!field)
                return [];
            return intersection(suggestions_1.isUnion(field.type) ? field.type : [field.type]);
        }
        else if (index_1.isIRef(node)) {
            //todo add ctx search
            let def = suggestions_1.default.globalVariables.find(({ name }) => name === node.name);
            if (!def)
                return [];
            return intersection(suggestions_1.isUnion(def.type) ? def.type : [def.type]);
        }
        return [];
    };
    return go(node);
}
exports.getNodeType = getNodeType;
function intersection(types) {
    const items = [...types];
    let structs = [];
    if (types === [] || items.length === 0) {
        return [];
    }
    let next;
    while (items.length > 0) {
        next = items.pop();
        if (suggestions_1.isStruct(next)) {
            structs.push(next);
        }
        else if (suggestions_1.isUnion(next)) {
            items.push(...next);
        }
        else {
            return [];
        }
    }
    const firstArg = structs[0];
    let out = firstArg.fields;
    for (let i = 1; i < structs.length; i++)
        out = intersect(out, structs[i].fields);
    return out;
}
exports.intersection = intersection;
function intersect(a, b) {
    let list = [], out = [];
    a.forEach((val) => list.push(val.name));
    b.forEach(val => (~list.indexOf(val.name)) ? out.push(val) : false);
    return out;
}
//# sourceMappingURL=completionUtils.js.map