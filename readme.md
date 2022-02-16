# Monaco Use Makrdown Web-Rich-Text Editor
Created By Ohah https://github.com/ohah/mvmEditor

## Example


```javascript
(async () => {
  const editor = await new VSCode({
    element : "#container",
    theme:"vs-dark",
    markdownStyle : "github-dark",
    preview : false,
    imageUpload : function (files) {
      console.log(files);
      return new Promise(function(resolve, reject) {
        resolve('tq');
      });
    },
    value : ``,

  });
  editor.initialize();
})();
```

```typescript
interface Option{
  element:HTMLInputElement
  value?:string
  height?:string /* defalut 500px */
  theme? : "vs" | "vs-dark" /* defalut vs */
  language? : "markdown" | "javascript" | "typescript" | "python" | "cpp" | "c" | "php" // defalut markdown\
  preview:boolean //only use language markdown
  markdownStyle : "github" | "github-dark" | "github-light"  /* defalut github (prefers-color-scheme) */
  imageUpload?:(e:FileList)=>Promise<Object> | undefined
}
```

## Document

| Function | Document | 
| ---------| -------- |
| initialize() | editor initialize |
| getValue():Promise<string> | editor getValue |
| setValue(value:string) | editor setValue |
| getHtml():Promise<string> |  Markdown to Html |
| setHtml(value:string |  Html to markdown string |

### LICENSE

Copyright <2022-2022> COPYRIGHT ohah

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.