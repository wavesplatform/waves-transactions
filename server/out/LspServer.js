'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const fs = require("fs");
const LspService_1 = require("./LspService");
class LspServer {
    constructor(connection) {
        this.connection = connection;
        this.hasConfigurationCapability = false;
        this.hasWorkspaceFolderCapability = false;
        this.hasDiagnosticRelatedInformationCapability = false;
        this.documents = {};
        this.service = new LspService_1.LspService();
        // Bind connection events to server methods
        // Init
        this.bindInit(connection);
        this.bindCallbacks(connection);
        // Listen
        this.connection.listen();
    }
    getDocument(uri) {
        return __awaiter(this, void 0, void 0, function* () {
            let document = this.documents[uri];
            if (!document) {
                const path = vscode_languageserver_1.Files.uriToFilePath(uri) || './';
                document = yield new Promise((resolve) => {
                    fs.access(path, (err) => {
                        if (err) {
                            resolve(undefined);
                        }
                        else {
                            fs.readFile(path, (_, data) => {
                                resolve(vscode_languageserver_1.TextDocument.create(uri, "ride", 1, data.toString()));
                            });
                        }
                    });
                });
            }
            return document;
        });
    }
    applyChanges(document, didChangeTextDocumentParams) {
        let buffer = document.getText();
        let changes = didChangeTextDocumentParams.contentChanges;
        for (let i = 0; i < changes.length; i++) {
            if (!changes[i].range && !changes[i].rangeLength) {
                // no ranges defined, the text is the entire document then
                buffer = changes[i].text;
                break;
            }
            let offset, end, range = changes[i].range;
            if (range !== undefined) {
                offset = document.offsetAt(range.start);
                end = null;
                if (range.end) {
                    end = document.offsetAt(range.end);
                }
                else {
                    end = offset + (changes[i].rangeLength || 0);
                }
            }
            buffer = buffer.substring(0, offset) + changes[i].text + buffer.substring(end || 0);
        }
        const changedDocument = vscode_languageserver_1.TextDocument.create(didChangeTextDocumentParams.textDocument.uri, document.languageId, didChangeTextDocumentParams.textDocument.version || 0, buffer);
        return changedDocument;
    }
    bindInit(connection = this.connection, service = this.service) {
        connection.onInitialize((params) => {
            let capabilities = params.capabilities;
            // Does the client support the `workspace/configuration` request?
            // If not, we will fall back using global settings
            this.hasConfigurationCapability =
                !!capabilities.workspace && !!capabilities.workspace.configuration;
            this.hasWorkspaceFolderCapability =
                !!capabilities.workspace && !!capabilities.workspace.workspaceFolders;
            this.hasDiagnosticRelatedInformationCapability =
                !!capabilities.textDocument &&
                    !!capabilities.textDocument.publishDiagnostics &&
                    !!capabilities.textDocument.publishDiagnostics.relatedInformation;
            return {
                capabilities: {
                    textDocumentSync: vscode_languageserver_1.TextDocumentSyncKind.Incremental,
                    // Tell the client that the server supports code completion
                    completionProvider: {
                        resolveProvider: true,
                        triggerCharacters: ['.', ':', '|', '@']
                    },
                    hoverProvider: true,
                    signatureHelpProvider: {
                        "triggerCharacters": ['(']
                    },
                    definitionProvider: true
                }
            };
        });
        connection.onInitialized(() => {
            if (this.hasConfigurationCapability) {
                // Register for all configuration changes.
                connection.client.register(vscode_languageserver_1.DidChangeConfigurationNotification.type, undefined);
            }
            if (this.hasWorkspaceFolderCapability) {
                connection.workspace.onDidChangeWorkspaceFolders(_event => {
                    connection.console.log('Workspace folder change event received.');
                });
            }
        });
    }
    bindCallbacks(connection = this.connection, service = this.service) {
        // Document changes
        connection.onDidOpenTextDocument((didOpenTextDocumentParams) => {
            let document = vscode_languageserver_1.TextDocument.create(didOpenTextDocumentParams.textDocument.uri, didOpenTextDocumentParams.textDocument.languageId, didOpenTextDocumentParams.textDocument.version, didOpenTextDocumentParams.textDocument.text);
            this.documents[didOpenTextDocumentParams.textDocument.uri] = document;
            const diagnostics = service.validateTextDocument(document);
            this.sendDiagnostics(document.uri, diagnostics);
        });
        connection.onDidCloseTextDocument((didCloseTextDocumentParams) => {
            delete this.documents[didCloseTextDocumentParams.textDocument.uri];
        });
        connection.onDidChangeTextDocument((didChangeTextDocumentParams) => {
            const document = this.documents[didChangeTextDocumentParams.textDocument.uri];
            const changedDocument = this.applyChanges(document, didChangeTextDocumentParams);
            this.documents[didChangeTextDocumentParams.textDocument.uri] = changedDocument;
            if (document.getText() !== changedDocument.getText()) {
                const diagnostics = service.validateTextDocument(changedDocument);
                this.sendDiagnostics(document.uri, diagnostics);
            }
        });
        // Lsp callbacks
        // connection.onCodeAction(service.codeAction.bind(service));
        connection.onCompletion((textDocumentPosition) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocument(textDocumentPosition.textDocument.uri);
            return service.completion(document, textDocumentPosition.position);
        }));
        connection.onHover((textDocumentPosition) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocument(textDocumentPosition.textDocument.uri);
            return service.hover(document, textDocumentPosition.position);
        }));
        connection.onSignatureHelp((textDocumentPosition) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocument(textDocumentPosition.textDocument.uri);
            return service.signatureHelp(document, textDocumentPosition.position);
        }));
        connection.onDefinition((textDocumentPosition) => __awaiter(this, void 0, void 0, function* () {
            const document = yield this.getDocument(textDocumentPosition.textDocument.uri);
            return service.definition(document, textDocumentPosition.position);
        }));
        connection.onCompletionResolve(this.service.completionResolve.bind(service));
        // connection.onImplementation(service.implementation.bind(service));
        // connection.onTypeDefinition(service.typeDefinition.bind(service));
        // connection.onDocumentFormatting(service.documentFormatting.bind(service));
        // connection.onDocumentHighlight(service.documentHighlight.bind(service));
        // connection.onDocumentSymbol(service.documentSymbol.bind(service));
        // connection.onExecuteCommand(service.executeCommand.bind(service));
        // connection.onReferences(service.references.bind(service));
        // connection.onRenameRequest(service.rename.bind(service));
        // connection.onWorkspaceSymbol(service.workspaceSymbol.bind(service));
        // connection.onFoldingRanges(service.foldingRanges.bind(service));
    }
    sendDiagnostics(uri, diagnostics) {
        this.connection.sendDiagnostics({ uri, diagnostics });
    }
}
exports.LspServer = LspServer;
//# sourceMappingURL=LspServer.js.map