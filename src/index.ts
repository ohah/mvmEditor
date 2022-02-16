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
    value : `
\`\`\`mermaid
graph LR
A(입력)-->B[연산]
B-->C(출력)
\`\`\`

\`\`\`sequence
Alice->Bob: Hello Bob, how are you?
Note right of Bob: Bob thinks
Bob-->Alice: I am good thanks!
\`\`\`

# 제목 1


### 제목 3


##### 제목 5

본문내용  스페이스 두번 개행  
스페이스 두번 후 리얼 그냥 개행
그냥개행쓰 
\`\`\`javascript
const editor = await new VSCode({
  element: "#container",
  value : "test";
})
\`\`\`

\`
그냥 코드블럭 테스트입니다.
달달하다
\`

| 테이블 | 제목 | 제목 |
| --- | --- | --- |
| 행1   | 무야 | 리얼 |
| 행2   | 무야 | 리얼 |
| 행3   | 무야 | 리얼 |
| 행4   | 무야 | 리얼 |
| 행5   | 무야 | 리얼 |
| 행6   | 무야 | 리얼 |
| 행7   | 무야 | 리얼 |
| 행8   | 무야 | 리얼 |
| 행9   | 무야 | 리얼 |
| 행10   | 무야 | 리얼 |
| 행12  | 무야 | 리얼 |
| 행13   | 무야 | 리얼 |
| 행14   | 무야 | 리얼 |
| 행15   | 무야 | 리얼 |
| 행16   | 무야 | 리얼 |

# 다시 코드불낙
\`\`\`aaa
이게 불나기양?
어? 불낙이냐고
\`\`\`
`,

  });
  editor.initialize();
  // document.getElementById('viewer').innerHTML = await editor.getHtml();
})();