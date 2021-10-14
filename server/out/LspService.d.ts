import { CompletionItem, CompletionList, Definition, Diagnostic, Hover, Position, SignatureHelp, TextDocument } from 'vscode-languageserver-types';
export declare class LspService {
    validateTextDocument(document: TextDocument): Diagnostic[];
    completion(document: TextDocument, position: Position): CompletionItem[] | CompletionList;
    hover(document: TextDocument, position: Position): Hover;
    definition(document: TextDocument, { line, character }: Position): Definition | null;
    signatureHelp(document: TextDocument, position: Position): SignatureHelp;
    completionResolve(item: CompletionItem): CompletionItem;
}
