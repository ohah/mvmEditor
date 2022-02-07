import { VSCode } from "./vscode";

(async () => {
  const editor = await new VSCode({
    element : "#container",
    value : `
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
\`\`\`
이게 불나기양?
어? 불낙이냐고
\`\`\`
`,

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