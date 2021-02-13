//import DOMPurify from './purify.min.js';
//import marked from "./marked.min.js";
//import 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js';
//const TurndownService = require('./turndown')
declare var require: any;
declare var TurndownService: any;
declare var focuseditor: any;
declare var Promise: any;
declare var codeEditor: any;
declare var hljs: any;
//declare const window:any;
declare const monaco:any;
declare const DOMPurify:any;
declare const marked:any;
//declare const marked:any;
interface editorOpt {
  dom:string
  width?:number
  height?:number
  defaultValue?:string,
  uploadurl:string,
  uploadname:string,
  editorurl:string
}

class mvmEditor {
  private wrapper!: HTMLElement | null;
  private preview:HTMLElement;
  private editorWrapper:HTMLElement;
  private editarea:HTMLElement;
  private menuArea:HTMLElement;
  private previewBtn:HTMLElement;
  private editor:any;
  private codeEditor:any;
  private codeArea:HTMLElement;
  private ImageInput:HTMLInputElement;
  private modalWrapper:HTMLElement;
  private opt:editorOpt = {
    dom : "body",
    width : 100,
    height: 300,
    defaultValue:'',
    uploadurl: "",
    uploadname:"bf_file",
    editorurl: location.origin,
  };
  constructor (option:editorOpt) {
    this.opt = {
      width : 100,
      height: 300,
      defaultValue:'',
      ...option
    }
    const self = this;
    this.ImageInput = document.createElement('input');
    this.ImageInput.setAttribute('type', 'file');
    this.ImageInput.classList.add('mvm-image-upload');
    this.ImageInput.addEventListener('change', async (e:any) => {
      const files = e.target.files;
      const selection = this.editor.getSelection();
      console.log(files);
      const res = await this.ImageUpload(files[0]);
      console.log(res);
      if(res.status !== "404") {
        this.editor.executeEdits("", [
          {
            range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
            text: `![image](${res.url})`
          }
        ])
        const { endLineNumber, endColumn } = this.editor.getSelection()
        this.editor.setPosition({ lineNumber: endLineNumber, column: endColumn })
      }
      e.target.value = "";
    })
    this.codeArea = document.createElement('div');
    this.codeArea.style.height = (window.innerHeight - 200) + "px";
    this.modalWrapper = document.createElement('div');
    this.modalWrapper.classList.add('mvm-modal-wrapper');
    this.modalWrapper.addEventListener('click', ()=>this.RemoveModal());


    document.addEventListener('DOMContentLoaded', (event) => {
      self.wrapper = document.querySelector(this.opt.dom)
      self.wrapper?.classList.add('mvm-wrapper');
      self.previewBtn.addEventListener('click', ()=>self.previewToggle());
    });

    this.editorWrapper = document.createElement('div');
    this.editorWrapper.classList.add('mvm-edit-wrapper');

    this.menuArea = document.createElement('div');
    this.menuArea.className = 'mvm-menuArea';
    this.CreateMenu();

    this.previewBtn = document.createElement('button');
    this.previewBtn.setAttribute('type', 'button')
    this.previewBtn.textContent = '미리보기';
    this.previewBtn.classList.add('previewBtn');
    

    this.editarea = document.createElement('div');
    this.editarea.classList.add('editorarea');
    this.editarea.style.height = `${this.opt.height}px`;
    this.preview = document.createElement('div');
    this.preview.classList.add('preivewarea', 'markdown-body');
    this.preview.style.height = `${this.opt.height}px`;
    this.preview.style.overflow = "auto";
    const defaultValue = this.opt.defaultValue ? this.opt.defaultValue :'';
    console.log(this.opt.editorurl);
    require.config({
      paths: { vs: `${this.opt.editorurl}/js/monaco-editor/min/vs` }
    });
    require(['vs/editor/editor.main'], function () {
      self.codeEditor = monaco.editor.create(self.codeArea, {
        //theme: 'vs-dark',
        theme: "vs",
        wordWrap: true,
        fontFamily: 'Nanum Gothic Coding',
        automaticLayout: true,
        value: '',
        lineNumbers : true,
        //fontSize : 20,
        wrappingStrategy: "advanced",
        language: 'javsacript',
        //readOnly: true,
        minimap: { enabled: true },
        scrollBeyondLastLine: false
      });
      self.editor = monaco.editor.create(self.editarea, {
        //theme: 'vs-dark',
        theme: "vs",
        wordWrap: true,
        fontFamily: 'Nanum Gothic Coding',
        automaticLayout: true,
        value: defaultValue,
        lineNumbers : false , 
        //fontSize : 20,
        wrappingStrategy: "advanced",
        //language: 'javascript'
        language: 'markdown',
        //readOnly: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false
      });
      self.editor.onDidPaste((e:any) => {
      })
      self.editor.onDidFocusEditorText((e:any)=>{
        focuseditor = self.editor;
      });
      window.addEventListener('paste', async (e: any) => {
        const items = e.clipboardData.files;
        for (let i = 0; i < items.length; i++) {
          const matches = items[i].type.match(/^image\/(png|jpg|jpeg|gif)$/i)
          //const selection = self.editor.getSelection();
          const selection = focuseditor.getSelection();
          let pastePosition = e;
          const range = new monaco.Range(
            pastePosition.startLineNumber || selection.endLineNumber,
            pastePosition.startColumn || selection.endColumn,
            pastePosition.endLineNumber || selection.endLineNumber,
            pastePosition.endColumn || selection.endColumn,
          );
          if (matches) {
            const file = items[i];
            const res = await self.ImageUpload(file);
            if(res.status !== 404) {
              focuseditor.executeEdits("", [
                {
                  range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
                  text: `![image](${res.url})`
                }
              ])
              const { endLineNumber, endColumn } = focuseditor.getSelection()
              focuseditor.setPosition({ lineNumber: endLineNumber, column: endColumn })
            }
          }
        }
      });
      self.editor.onDidChangeModelContent((e:any) => {
        const html = marked(self.editor.getValue());
        const sanitized = DOMPurify.sanitize(html, '');
        self.preview.innerHTML = sanitized;
        //const tokens = marked.lexer(value);
        //const html = marked.parser(tokens);
      }); 
      marked.setOptions({
        highlight: (code:string, lang:string) => {
          return hljs.highlightAuto(code).value;
        }
      })
      const html = marked(self.editor.getValue());
      const sanitized = DOMPurify.sanitize(html, '');
      self.preview.innerHTML = sanitized;
      self.editorWrapper.appendChild(self.editarea);
      self.editorWrapper.appendChild(self.preview);
      self.wrapper?.appendChild(self.menuArea);
      self.wrapper?.appendChild(self.editorWrapper);
      self.wrapper?.appendChild(self.previewBtn);

    });
  }
  getMarkdown () {
    const turndownService:any = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })
    return this.editor.getValue();
  }
  setMarkdown(text:string) {
    this.editor.setValue(text);
  }
  setHtml(text:string) {
    const turndownService:any = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })
    const markdown = turndownService.turndown(text);
    this.editor.setValue(markdown);
  }
  getHtml() {
    return marked(this.editor.getValue())
  }
  iconAppend(className:string) {
    const btn = document.createElement('button');
    btn.classList.add('balloon');
    btn.setAttribute('type', 'button')
    const i = document.createElement('i');
    i.className = className;
    btn.appendChild(i);
    return btn;
  }
  previewToggle(){
    if(this.preview.classList.contains('hide')) {
      this.preview.classList.remove('hide');
      this.editarea.classList.remove('editorarea2');
      this.previewBtn.classList.remove('active');
    }else {
      this.preview.classList.add('hide');
      this.editarea.classList.add('editorarea2');
      this.previewBtn.classList.add('active');
    } 
  }
  CreateMenu() {
    const undo = this.iconAppend('fas fa-undo');
    undo.dataset.tooptip = "취소";
    undo.addEventListener('click', ()=>this.editor.getModel().undo())
    const redo = this.iconAppend('fas fa-redo');
    redo.addEventListener('click', ()=>this.editor.getModel().redo())
    redo.dataset.tooptip = "되돌리기";
    const listul = this.iconAppend('fas fa-list-ul');
    const listulDefalut = [
      ``,
      `-  `,
      `-  `,
      `-  `,
      ``,
    ].join('\r\n');
    listul.addEventListener('click', ()=>this.InsertTemplate("", listulDefalut))
    listul.dataset.tooptip = "목록(숫자)";
    const listol = this.iconAppend('fas fa-list-ol');
    const listolDefalut = [
      ``,
      `1.  `,
      `2.  `,
      `3.  `,
      ``,
    ].join('\r\n');
    listol.addEventListener('click', ()=>this.InsertTemplate("", listolDefalut))
    listol.dataset.tooptip = "목록";
    const italic = this.iconAppend('fas fa-italic');
    italic.dataset.tooptip = "기울임";
    italic.addEventListener('click', ()=>this.InsertTemplate("_", "_"))
    const bold = this.iconAppend('fas fa-bold');
    bold.dataset.tooptip = "굵게";
    bold.addEventListener('click', ()=>this.InsertTemplate("**", "**"))
    const image = this.iconAppend('fas fa-image');
    image.addEventListener('click', ()=>this.ImageInput.click())
    image.dataset.tooptip = "이미지 업로드";
    const link = this.iconAppend('fas fa-link');
    link.addEventListener('click', ()=>{
      const text = this.getSelectionText();
      this.InsertTemplate(`)`, `[${text}](`)
    })
    link.dataset.tooptip = "링크";
    const table = this.iconAppend('fas fa-table');
    const tableDefalut = [
      ``,
      `| H1  | H2  | H3`,
      `| ---  | ---  | ---`,
      `| R1  | R2  | R3`,
      ``,
    ].join('\r\n');
    table.dataset.tooptip = "표(3X3)";
    table.addEventListener('click', ()=>this.InsertTemplate("", tableDefalut))
    const code = this.iconAppend('fas fa-code');
    code.addEventListener('click', ()=>this.CreateCodeModal());
    code.dataset.tooptip = "코드";
    const blockquote = this.iconAppend('fas fa-quote-right');
    blockquote.dataset.tooptip = "주석";
    blockquote.addEventListener('click', ()=>this.InsertTemplate(">", ""))
    const info = this.iconAppend('fas fa-question');
    info.addEventListener('click', ()=>this.CreateInfo())
    info.dataset.tooptip = "에디터 정보";
    info.classList.add('balloon-right');
    info.style.float = "right";
    this.menuArea.appendChild(undo)
    this.menuArea.appendChild(redo)
    this.menuArea.appendChild(listul)
    this.menuArea.appendChild(listol)
    this.menuArea.appendChild(italic)
    this.menuArea.appendChild(bold)
    this.menuArea.appendChild(image)
    this.menuArea.appendChild(link)
    this.menuArea.appendChild(table)
    this.menuArea.appendChild(code)
    this.menuArea.appendChild(blockquote)
    this.menuArea.appendChild(info)
  }
  getSelectionText(){
    return this.editor.getModel().getValueInRange(this.editor.getSelection())
  }
  CreateInfo() {
    const self = this;
    const Modal = document.createElement('div');
    Modal.style.background = "#fff";
    Modal.style.padding="30px"
    Modal.innerHTML = "개발 버전. 재배포 수정 불가";
    Modal.addEventListener('click', (e)=>e.stopPropagation());
    this.modalWrapper.appendChild(Modal);
    document.body.appendChild(this.modalWrapper);
  }
  InsertTemplate(prefix:string, lastfix:string) {
    //console.log('클릭', lastfix);
    const selection = this.editor.getSelection();
    this.editor.executeEdits("", [{
      range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
      text: prefix
    }])
    this.editor.executeEdits("", [{
      range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
      text: lastfix
    }])
  }
  optionElement(value:string, text?:string) {
    const opt = document.createElement("option");
    opt.value = value;
    opt.text = text ? text : value;
    return opt;
  }
  CreateCodeModal () {
    const self = this;
    const Modal = document.createElement('div');
    const codeMenu = document.createElement('div');
    const selectLang = document.createElement('select');
    const confirm = document.createElement('button');
    confirm.addEventListener('click', ()=>this.InsertCode());
    confirm.classList.add('mvm-button');
    confirm.textContent = '확인';
    selectLang.add(this.optionElement('javascript'))
    selectLang.add(this.optionElement('typescript'))
    selectLang.add(this.optionElement('html'))
    selectLang.add(this.optionElement('json'))
    selectLang.add(this.optionElement('css'))
    selectLang.add(this.optionElement('python'))
    selectLang.add(this.optionElement('mysql'))
    selectLang.add(this.optionElement('c'))
    selectLang.add(this.optionElement('cpp'))
    selectLang.add(this.optionElement('java'))
    selectLang.add(this.optionElement('csharp'))
    selectLang.add(this.optionElement('go'))
    selectLang.add(this.optionElement('php'))
    selectLang.add(this.optionElement('rust'))
    selectLang.addEventListener('change', (e:any)=>{
      const value = e.target.value;
      monaco.editor.setModelLanguage(self.codeEditor.getModel(), value);
    });
    codeMenu.appendChild(selectLang);
    Modal.classList.add('mvm-modal');
    Modal.addEventListener('click', (e)=>e.stopPropagation());
    Modal.appendChild(codeMenu);
    Modal.appendChild(this.codeArea);

    Modal.appendChild(confirm);

    this.modalWrapper.appendChild(Modal);
    document.body.appendChild(this.modalWrapper);
    monaco.editor.setModelLanguage(this.codeEditor.getModel(), 'javascript');
    this.codeEditor.setValue('');
  }
  RemoveModal() {
    while ( this.modalWrapper.hasChildNodes() ) {
      if(this.modalWrapper.firstChild)
        this.modalWrapper.removeChild(this.modalWrapper.firstChild);
    }
    this.modalWrapper.remove();
  }
  InsertCode() {
    const value = this.codeEditor.getValue();
    const selection = this.editor.getSelection();
    const lang:any = this.modalWrapper.querySelector('select');
    this.editor.executeEdits("", [{
      range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
      text: "\r\n```"+lang.value+"\r\n"+value+"\r\n```\r\rn"
    }])
    this.RemoveModal();
  }
  async ImageUpload(File:File) {
    const formData = new FormData();
    formData.append(this.opt.uploadname, File);
    try{
      const res = await fetch(this.opt.uploadurl, {
        method: 'POST',
        body: formData
      })
      return res.json()
    }catch(err){
      return {success:false}
    }
  }
}

interface ViewerOpt{
  ele:string,
  cssClass:string,
}
class mvmEditorViewer {
  private opt:ViewerOpt = {
    ele:"body",
    cssClass:'markdown-body',
  };
  constructor(option:ViewerOpt) {
    const self = this;
    this.opt = {
      ...option
    }
    document.addEventListener('DOMContentLoaded', (event) => {
      document.querySelector(self.opt.ele)?.classList.add(self.opt.cssClass);
      hljs.initHighlightingOnLoad();
    });
  }
}