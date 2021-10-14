import { IFunc, IFunctionCall, IPos, TArgument, TExprResultType, TFunction, TStructField, TType } from '@waves/ride-js';
export declare const validateByPos: (pos: number, node: IPos & {
    value: string;
}) => boolean;
export declare const getExpressionType: (resultType: TExprResultType) => string;
export declare const getFuncHoverByNode: (n: IFunc) => string;
export declare const getFunctionCallHover: (n: IFunctionCall) => string;
export declare const getFuncHoverByTFunction: (f: TFunction) => string;
export declare const getFuncArgNameHover: ({ argName: { value: name }, type }: TArgument) => string;
export declare const getTypeDoc: (item: TStructField, isRec?: Boolean | undefined) => string;
export declare const getFuncArgumentOrTypeByPos: (node: IFunc, pos: number) => string | null;
export declare function convertResultType(type: TType): string;
