import { scriptView } from './views/ScriptView';
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Extension activated');

    context.subscriptions.push(
        scriptView,
        vscode.commands.registerCommand('extension.openT2Tools', () => {
            const panel = vscode.window.createWebviewPanel(
                'tabUITools',
                'Team 2 Tools UI',
                vscode.ViewColumn.One,
                {
                    enableScripts: true
                }
            );

            panel.webview.html = getWebviewContent();

            panel.webview.onDidReceiveMessage(
                message => {
                    switch (message.command) {
                        case 'format':
                            runYarnScript();
                            return;
                    }
                },
                undefined,
                context.subscriptions
            );
        })
    );
}

function getWebviewContent() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Tab UI</title>
        </head>
        <body>
            <h1>Tab UI</h1>
            <button onclick="format()">Format</button>
            <script>
                const vscode = acquireVsCodeApi();
                function format() {
                    console.log('Button clicked: format');
                    vscode.postMessage({ command: 'format' });
                }
            </script>
        </body>
        </html>
    `;
}

function runYarnScript() {
    console.log('Running yarn script');
    const terminal = vscode.window.createTerminal('Yarn Script');
    terminal.sendText('yarn format');
    terminal.show();
}

export function deactivate() {
    console.log('Extension deactivated');
}