"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
function getFunctionDefinition(exprAst, node) {
    const defPos = node.ctx.find(({ name }) => name === node.name.value);
    if (defPos) {
        const def = index_1.getNodeByOffset(exprAst, defPos.posStart);
        if (index_1.isIFunc(def))
            return def;
    }
    return null;
}
exports.getFunctionDefinition = getFunctionDefinition;
// export function getNodeDefinitionByName(node: TNode, name: string, refPos: number): TNode | null {
//     const out: TNode[] = [];
//
//     const validateNodeByName = (n: TNode): boolean => ((isIFunc(n) || isILet(n)) && n.name.value === name);
//
//     function go(n: TNode) {
//         const children = getNodeChildren(n);
//         children.forEach(child => {
//             validateNodeByName(child) && out.push(child);
//             go(child)
//         })
//     }
//
//     go(node);
//     return out
//         .map(node => ({distance: refPos - node.posStart, node}))
//         .filter(({distance}) => distance > 0)
//         .map(({node}) => node)
//         .pop() || null
//
// }
// const getNodeChildren = (node: TNode): TNode[] => {
//     if (isIBlock(node)) {
//         return [node.dec, node.body]
//     } else if (isILet(node) || isIMatch(node) || isIMatchCase(node) || isIFunc(node) || isIScript(node) || isIDApp(node)) {
//         return [node.expr]
//     } else if (isIIf(node)) {
//         return [node.cond, node.ifTrue, node.ifFalse]
//     } else if (isIFunctionCall(node)) {
//         return node.args
//     } else if (isIGetter(node)) {
//         return [node.ref]
//     } else if (isIMatch(node)) {
//         return node.cases
//     } else {
//         return []
//     }
// };
//
//# sourceMappingURL=definitionUtils.js.map