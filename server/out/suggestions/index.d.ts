import { CompletionItem } from 'vscode-languageserver-types';
import { IVarDoc, TFunction, TList, TStruct, TStructField, TType, TUnionItem } from '@waves/ride-js';
export declare const isPrimitive: (item: TType) => item is string;
export declare const isString: (item: any) => item is string;
export declare const isStruct: (item: TType) => item is TStruct;
export declare const isList: (item: TType) => item is TList;
export declare const listToString: (type: TList) => string;
export declare const isUnion: (item: TType) => item is TUnionItem[];
export declare const getUnionItemName: (item: TUnionItem) => string;
export declare const unionToString: (item: TUnionItem[]) => string;
declare class Suggestions {
    types: TStructField[];
    functions: TFunction[];
    globalVariables: IVarDoc[];
    globalSuggestions: CompletionItem[];
    constructor();
    updateSuggestions: (stdlibVersion?: number | undefined, isTokenContext?: boolean | undefined) => void;
}
declare const _default: Suggestions;
export default _default;
