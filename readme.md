## mvmeditor

monaco-editor, higlightjs, markedjs, purifyjs, turndownjs를 활용한 마크다운 에디터입니다.

현재 개발중인 에디터로 수정 재배포 불가 합니다.


##사용법

```typescript
interface editorOpt {
  dom:string
  width?:number
  height?:number
  defaultValue?:string,
  uploadurl:string,
  uploadname:string,
  editorurl:string,
  toolbar?:Array<string>
  Upload?:(File:File)=>Object
}
```
에디터의 기본값 타입은 위와 같으며 옵션의 예제는 다음과 같습니다.

```javascript
const ed = new mvmEditor({
    dom: "#mvmEditor", //변환할 div
    uploadurl : "https://test", // 이미지를 업로드해야 할 경우 이미지 업로드를 받는 백앤드 서버의 주소
    editorurl:"http://127.0.0.1:5500", //에디터가 올려진 파일의 경로.
    toolbar : ['listul', 'listol','italic','bold','strikethrough','image','link','table','code','chart','fullscreen'] //툴바 옵션
});
```


커스텀 업로드 함수 기능 추가

예제 코드

```javascript
Upload: async function uploadImage(blob) {
  console.log("console log from uploadImage function")
  const f = new FormData();
  f.append("getImageUpload", "1");
  f.append("access_token", window.access_token);
  const clientkey = document.getElementById("clientkey").value;
  const SecretKey = document.getElementById("SecretKey").value;
  f.append('client_id', clientkey)
  f.append('secret_key', SecretKey)
  f.append('blogName', document.querySelector(`[name='blogName']`).value)
  f.append("uploadedfile", blob, blob.name);
  const res = await axios({
    method: 'post',
    url : 'tistory.php',
    headers: {'Content-Type': 'multipart/form-data'},
    data : f
  });
  if(res.data.tistory.status == "200"){
    let original = res.data.tistory.url.split('/');
    original = original[original.length - 1].slice(0,-4);
    original = 'https://t1.daumcdn.net/cfile/tistory/' + original + '?original';
    ImageStack.push(res.data);
    return {success : true, url : original};
  }
}
```

### UPLOAD Return Value

업로드 실패시 {status : '404', url : ''}
업로드 성공시 {status : '200', url : 'imgurl'}