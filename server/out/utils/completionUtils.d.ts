import { IContext, TFunction, TNode, TStructField, TType } from '@waves/ride-js';
import { CompletionItem } from 'vscode-languageserver-types';
export declare const getPostfixFunctions: (type: TType) => TFunction[];
export declare const convertToCompletion: (field: TStructField) => CompletionItem;
export declare const getCompletionDefaultResult: (ctx?: IContext[]) => (CompletionItem | {
    label: string;
    kind: 6;
} | {
    kind: 7;
    label: string;
})[];
export declare function getNodeType(node: TNode): TStructField[];
export declare function intersection(types: TType[]): TStructField[];
