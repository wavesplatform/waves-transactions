'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_languageserver_1 = require("vscode-languageserver");
const LspServer_1 = require("./LspServer");
const connection = vscode_languageserver_1.createConnection();
new LspServer_1.LspServer(connection);
//# sourceMappingURL=main.js.map