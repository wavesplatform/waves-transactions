"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
class WavesReplPanel {
    constructor(column, _appPath) {
        this._appPath = _appPath;
        this._disposables = [];
        // Create and show a new webview panel
        this._panel = vscode.window.createWebviewPanel(WavesReplPanel.viewType, "RideRepl", column, {
            // Enable javascript in the webview
            enableScripts: true,
            // Act as background tab
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.file(this._appPath)
            ]
        });
        // Set the webview's initial html content 
        this._panel.webview.html = this._getHtmlForWebview();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Handle commands from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'GetDefaultSettings':
                    this.updateWebviewSettings();
                    this.updateEditorsContent();
                    break;
                default:
                    console.log(`Unknown command ${message.command}`);
            }
        }, null, this._disposables);
        // Send message on settings update
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('rideExtension.repl')) {
                this.updateWebviewSettings();
            }
        });
        // Send message with current editors state on any relevant event
        vscode.workspace.onDidOpenTextDocument(() => this.updateEditorsContent());
        vscode.workspace.onDidCloseTextDocument(() => this.updateEditorsContent());
        vscode.workspace.onDidChangeTextDocument(() => this.updateEditorsContent());
        vscode.window.onDidChangeActiveTextEditor(() => this.updateEditorsContent());
    }
    static createOrShow(appPath) {
        const column = vscode.ViewColumn.Three;
        // If we already have a panel, show it.
        // Otherwise, create a new panel.
        if (WavesReplPanel.currentPanel) {
            WavesReplPanel.currentPanel._panel.reveal(column);
        }
        else {
            WavesReplPanel.currentPanel = new WavesReplPanel(column, appPath);
        }
    }
    updateEditorsContent() {
        const textDocuments = vscode.workspace.textDocuments.filter(document => document.languageId === 'ride');
        const activeTextEditor = vscode.window.visibleTextEditors.filter(editor => editor.document.languageId === 'ride')[0];
        const activeTextDocument = activeTextEditor ? activeTextEditor.document : undefined;
        const data = textDocuments.map(document => ({
            code: document.getText(),
            label: document.fileName.split('/')[document.fileName.split('/').length - 1]
        }));
        let selected = -1;
        if (activeTextDocument) {
            selected = textDocuments.findIndex(document => document.uri.path === activeTextDocument.uri.path);
        }
        // Todo: rename command
        this._panel.webview.postMessage({
            command: 'EditorsContent',
            value: { editors: data, selectedEditor: selected }
        });
    }
    updateWebviewSettings() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        if (this._panel) {
            const replSettings = vscode.workspace.getConfiguration('rideExtension.repl');
            this._panel.webview.postMessage({
                command: 'ReplSettings',
                value: replSettings
            });
        }
    }
    dispose() {
        WavesReplPanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _getHtmlForWebview() {
        const scriptPathOnDisk = vscode.Uri.file(path.join(this._appPath, 'main.js'));
        const scriptUri = scriptPathOnDisk.with({ scheme: 'vscode-resource' });
        // Use a nonce to whitelist which scripts can be run
        const nonce = getNonce();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>React App</title>
				<meta http-equiv="Content-Security-Policy" content="default-src https://*; img-src vscode-resource: https: data:; script-src 'nonce-${nonce}' 'unsafe-eval';style-src vscode-resource: 'unsafe-inline' http: https: data:;">
				<base href="${vscode.Uri.file(this._appPath).with({ scheme: 'vscode-resource' })}/">
			</head>
			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
    }
}
WavesReplPanel.viewType = 'react';
exports.WavesReplPanel = WavesReplPanel;
function getNonce() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
//# sourceMappingURL=WavesReplPanel.js.map