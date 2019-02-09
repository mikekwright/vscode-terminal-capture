Dev Notes
==============================================

## Ideas

Here is the flow that I would like to see if I can get access to the underlying terminal content...
  **NOTE:** The terminal is based on `xterm.js` - https://github.com/xtermjs/xterm.js#readme   
  I also think that getting access to the `Buffer` might make this solution a bit easier

**NOTE**: This code was all found on commit `c110d84460b3e45842a8fe753562341003595e1d` from the vscode source.  

1. `terminalInstance.selectAll()` - `src/vs/workbench/contrib/terminal/electron-browser/terminalActions.ts:185`
2. `terminalInstance.copySelection()`  - `src/vs/workbench/contrib/terminal/electron-browser/terminalActions.ts:164`
  `this._xterm.getSelection()` - `src/vs/workbench/contrib/terminal/electron-browser/terminalInstance.ts:684`
3. `terminalInstance.clearSelection()` - `src/vs/workbench/contrib/terminal/electron-browser/terminalActions.ts:164`
  `this._xterm.clearSelection()` - `src/vs/workbench/contrib/terminal/electron-browser/terminalInstance.ts:695`

## Clearning Special Characters

One of the first issues that I ran into is that the dat captured from the
terminal included special characters (like color selections).  

This regex can be used in js to select all color code special characters so
that they can be cleaned from the data.   

```\x1b\[[0-9;]*m```

## External Pages

* VSCode extension getting started - [https://code.visualstudio.com/api/get-started/your-first-extension](https://code.visualstudio.com/api/get-started/your-first-extension)
* `xterm.js` site - [https://xtermjs.org/](https://xtermjs.org)
* Terminal Sample code for vscode api - [https://github.com/Microsoft/vscode-extension-samples/blob/master/terminal-sample/src/extension.ts](https://github.com/Microsoft/vscode-extension-samples/blob/master/terminal-sample/src/extension.ts)
* Using the proposed api (Never did) - [https://code.visualstudio.com/api/advanced-topics/using-proposed-api](https://code.visualstudio.com/api/advanced-topics/using-proposed-api)


