import { IConnection } from 'vscode-languageserver';
export declare class LspServer {
    private connection;
    private hasConfigurationCapability;
    private hasWorkspaceFolderCapability;
    private hasDiagnosticRelatedInformationCapability;
    private service;
    private documents;
    constructor(connection: IConnection);
    private getDocument;
    private applyChanges;
    private bindInit;
    private bindCallbacks;
    private sendDiagnostics;
}
