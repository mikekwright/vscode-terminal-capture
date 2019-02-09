import * as vscode from 'vscode';

// Common data to be used elsewhere
let terminalData = {};

export function activate(context: vscode.ExtensionContext) {
  let options = vscode.workspace.getConfiguration('terminalCapture');
  terminalData = {};

  if (options.get('enable') === false) {
    console.log('Terminal Capture is disabled');
    return;
  }

  console.log('Terminal Capture extension is now active');

  if (options.get('useClipboard') === false) {
    vscode.window.terminals.forEach(t => {
      registerTerminalForCapture(t);
    });

    vscode.window.onDidOpenTerminal(t=> {
      registerTerminalForCapture(t);
    });
  }

  context.subscriptions.push(vscode.commands.registerCommand('extension.terminalCapture.runCapture', () => {
    if (options.get('enable') === false) {
      console.log('Command has been disabled, not running');
    }

    const terminals = <vscode.Terminal[]>(<any>vscode.window).terminals;
    if (terminals.length <= 0) {
      vscode.window.showWarningMessage('No terminals found, cannot run copy');
      return;
    }

    if (options.get('useClipboard') === true) {
      runClipboardMode();
    } else {
      runCacheMode();
    }
  }));
}

export function deactivate() {
  terminalData = {};
}


function runCacheMode() {
  let terminal = vscode.window.activeTerminal;
  if (terminal === undefined) {
    vscode.window.showWarningMessage('No active terminal found, can not capture');
    return;
  }

  terminal.processId.then(terminalId => {
    vscode.commands.executeCommand('workbench.action.files.newUntitledFile').then(() => {
      let editor = vscode.window.activeTextEditor;
      if (editor === undefined) {
        vscode.window.showWarningMessage('Failed to find active editor to paste terminal content');
        return;
      }

      let cache = cleanupCacheData((<any>terminalData)[terminalId]);
      editor.edit(builder => {
        builder.insert(new vscode.Position(0, 0), cache);
      });
    });
  });
}


function runClipboardMode() {
  vscode.commands.executeCommand('workbench.action.terminal.selectAll').then(() => {
    vscode.commands.executeCommand('workbench.action.terminal.copySelection').then(() => {
      vscode.commands.executeCommand('workbench.action.terminal.clearSelection').then(() => {
        vscode.commands.executeCommand('workbench.action.files.newUntitledFile').then(() => {
          vscode.commands.executeCommand('editor.action.clipboardPasteAction');
        });
      });
    });
  });
}


function cleanupCacheData(data: string): string {
  return data.replace(new RegExp('\x1b\[[0-9;]*m', 'g'), '');
}

function registerTerminalForCapture(terminal: vscode.Terminal) {
  terminal.processId.then(terminalId => {
    (<any>terminalData)[terminalId] = "";
    (<any>terminal).onDidWriteData((data: any) => {
      // TODO:
      //   - Need to remove (or handle) backspace
      //   - not sure what to do about carriage return???
      //   - might have some odd output
      (<any>terminalData)[terminalId] += data;
    });
  });
}
