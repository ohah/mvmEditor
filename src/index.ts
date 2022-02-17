import VSCode from "./vscode";

(async () => {
  const editor = await new VSCode({
    element : "#container",
    theme:"vs-dark",
    markdownStyle : "github-dark",
    preview : true,
    imageUpload : function (files) {
      console.log(files);
      return new Promise(function(resolve, reject) {
        resolve('tq');
      });
    },
    value : ``,
  });
  editor.initialize();
  // document.getElementById('viewer').innerHTML = await editor.getHtml();
})();