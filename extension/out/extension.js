'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_1 = require("vscode");
//import * as child_process from 'child_process'
const vscode_languageclient_1 = require("vscode-languageclient");
const WavesReplPanel_1 = require("./WavesReplPanel");
let client;
function activate(context) {
    // Activate REPL window
    const appPath = context.asAbsolutePath(path.join('extension', 'out', 'repl'));
    //const appPath = '/Users/siem/PycharmProjects/ride-repl/dist'
    const startCommand = vscode_1.commands.registerCommand('waves-repl.start', () => {
        WavesReplPanel_1.WavesReplPanel.createOrShow(appPath);
    });
    if (WavesReplPanel_1.WavesReplPanel.currentPanel) {
        WavesReplPanel_1.WavesReplPanel.currentPanel;
    }
    context.subscriptions.push(startCommand);
    // runReplServer(appPath, appPort)
    // Language Server
    // The server is implemented in node
    let serverModule = context.asAbsolutePath(path.join('server', 'out', 'main.js'));
    // The debug options for the server
    // --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
    let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    let serverOptions = {
        run: { module: serverModule, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    // Options to control the language client
    let clientOptions = {
        // Register the server for plain text documents
        documentSelector: [{ scheme: 'file', language: 'ride' }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: vscode_1.workspace.createFileSystemWatcher('**/.clientrc')
        }
    };
    // Create the language client and start the client.
    client = new vscode_languageclient_1.LanguageClient('rideLanguage', 'Ride Language Server', serverOptions, clientOptions);
    // Start the client. This will also launch the server
    client.start();
}
exports.activate = activate;
function deactivate() {
    if (!client) {
        return undefined;
    }
    return client.stop();
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map