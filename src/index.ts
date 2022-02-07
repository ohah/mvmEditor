import { VSCode } from "./vscode";

(async () => {
  const editor = await new VSCode({
    element : "#container",
    value : `
  # 1
  ## 2
  ### 삼번 ㅁㄴㅇㄹ
  #### 4
  ##### 5
  ###### 6
  \`\`\`javascript
  const vscode = new Vscode();
  console.log('asdf');
  \`\`\`
  ㅁㄴㅇㄹ
  ㅁㄴㅇㄻㄴㅇㄹ
  asdfㅁㄴㅇㄹ
  ㅁㄴㅇㄹ
  asdf
  ㅁㄴㅇㄹ
  asdf
  ![](https://i.esdrop.com/d/dLd7n17hg9.png)
  asdㅁㄴㅇ
  fadsf
  asdf
  rasdrasdrasd
  fadsfasdf
  asdfasdffasdffrasdrasdsdf
  asdf
  asdfasdffasdffrasdrasd

  asddfd![](https://i.esdrop.com/d/dLd7n17hg9.png)
  asdfasdffasdfrsdarasdrsad

  모또 키asdf키타이 꼬또가 하아나또니
  asdfasdf
  asdsdfasdf
  asdfasdffasdf

  g
  g
  g

  다따까우용~
  '''`,
  });
  editor.initialize();
  // console.log('test', await editor.getHtml());
  // await editor.setHtml("tq");
  // const editor2 = new VSCode({
  //   element : '#con',
  //   height:"300px",
  // });
  // await editor2.initialize();
})();