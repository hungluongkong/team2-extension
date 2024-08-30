import * as vscode from 'vscode';
import { executeAllFiles } from '../utils';

class ScriptView {
    private panel: vscode.WebviewPanel | undefined;

    constructor() {
        this.panel = vscode.window.createWebviewPanel(
            'scriptView',
            'Script View',
            vscode.ViewColumn.One,
            {
                enableScripts: true
            }
        );

        this.panel.webview.html = this.getWebviewContent();

        this.panel.webview.onDidReceiveMessage(
            message => {
                switch (message.command) {
                    case 'Optimize Import':
                        vscode.window.showInformationMessage('Optimize Import');
                        async function organizeImportsInWorkspace() {
                            // get root path of the workspace
                            const rootPath = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
                            console.log(rootPath);
                            executeAllFiles(rootPath || '', {
                                callback: (sourceFile) => {
                                    sourceFile.organizeImports({});
                                    // format with prettier
                                    sourceFile.formatText({
                                        ensureNewLineAtEndOfFile: false
                                    });
                                    // execute prettier.forceFormatDocument
                                    sourceFile.saveSync();
                                },
                                exclude: /(node_modules|.git|.dist|.github|.core|assets|.tools)/,
                            });
                        }
                        organizeImportsInWorkspace();
                        break;
                    case 'action2':
                        vscode.window.showInformationMessage('Action 2 executed');
                        break;
                    case 'action3':
                        vscode.window.showInformationMessage('Action 3 executed');
                        break;
                }
            },
            undefined,
            []
        );

        this.panel.onDidDispose(() => {
            this.dispose();
        }, null, []);
    }

    private getWebviewContent(): string {
        return `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Script View</title>
                <style>
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: left;
                    }
                </style>
            </head>
            <body>
                <h1>Team 2 Scripts</h1>
                <table>
                    <tr>
                        <th>Button</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td><button onclick="action1()">Optimize Import</button></td>
                        <td>Description for Action 1</td>
                    </tr>
                    <tr>
                        <td><button onclick="action2()">Action 2</button></td>
                        <td>Description for Action 2</td>
                    </tr>
                    <tr>
                        <td><button onclick="action3()">Action 3</button></td>
                        <td>Description for Action 3</td>
                    </tr>
                </table>
                <script>
                    const vscode = acquireVsCodeApi();
                    function action1() {
                        vscode.postMessage({ command: 'Optimize Import' });
                    }
                    function action2() {
                        vscode.postMessage({ command: 'action2' });
                    }
                    function action3() {
                        vscode.postMessage({ command: 'action3' });
                    }
                </script>
            </body>
            </html>
        `;
    }

    dispose() {
        if (this.panel) {
            this.panel.dispose();
        }
    }
}

export const scriptView = new ScriptView();