"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const suggestions = require("./suggestions.json");
const ride_js_1 = require("@waves/ride-js");
//----------------------TPrimitive-------------------------
exports.isPrimitive = (item) => typeof item === 'string';
exports.isString = (item) => typeof item === 'string';
//----------------------TStruct----------------------------
exports.isStruct = (item) => typeof item === 'object' && 'typeName' in item;
//----------------------TList------------------------------
exports.isList = (item) => typeof item === 'object' && 'listOf' in item;
exports.listToString = (type) => `LIST[ ${exports.isStruct(type.listOf) ? type.listOf.typeName : type.listOf}]`;
//----------------------TUnion-----------------------------
exports.isUnion = (item) => Array.isArray(item);
exports.getUnionItemName = (item) => {
    if (exports.isStruct(item))
        return item.typeName;
    if (exports.isList(item))
        return exports.listToString(item);
    return item;
};
exports.unionToString = (item) => item.map(type => exports.getUnionItemName(type)).join('|');
//----------------------------------------------------------
class Suggestions {
    constructor() {
        this.types = ride_js_1.getTypes();
        this.functions = ride_js_1.getFunctionsDoc();
        this.globalVariables = ride_js_1.getVarsDoc();
        this.globalSuggestions = [];
        this.updateSuggestions = (stdlibVersion, isTokenContext) => {
            const types = ride_js_1.getTypes(stdlibVersion, isTokenContext);
            const functions = ride_js_1.getFunctionsDoc(stdlibVersion, isTokenContext);
            const globalVariables = ride_js_1.getVarsDoc(stdlibVersion, isTokenContext);
            this.types.length = 0;
            this.functions.length = 0;
            this.globalVariables.length = 0;
            this.globalSuggestions.length = 0;
            this.types.push(...types);
            this.functions.push(...functions);
            this.globalVariables.push(...globalVariables);
            this.globalSuggestions.push(...suggestions.directives.map(directive => ({ label: directive, kind: vscode_languageserver_types_1.CompletionItemKind.Reference })), ...suggestions.keywords.map((label) => ({ label, kind: vscode_languageserver_types_1.CompletionItemKind.Keyword })), ...suggestions.snippets.map(({ label }) => ({ label, kind: vscode_languageserver_types_1.CompletionItemKind.Snippet })), ...functions.map(({ name, doc }) => ({ detail: doc, kind: vscode_languageserver_types_1.CompletionItemKind.Function, label: name })));
        };
        this.updateSuggestions();
    }
}
exports.default = new Suggestions();
//# sourceMappingURL=index.js.map