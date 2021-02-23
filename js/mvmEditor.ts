//import DOMPurify from './purify.min.js';
//import marked from "./marked.min.js";
//import 'https://cdn.jsdelivr.net/npm/monaco-editor/min/vs/loader.js';
//const TurndownService = require('./turndown')
declare var require: any;
declare var TurndownService: any;
declare var focuseditor: any;
declare var ApexCharts: any;
declare var Promise: any;
declare var codeEditor: any;
declare var hljs: any;
declare const nodifyString:any;
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
  editorurl:string,
  toolbar?:Array<string>,
  Upload?:(File:File)=>Object
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
  private codeKeyup:any;
  private ChartTempSave:HTMLElement;
  private TocWrapper:HTMLElement;
  private opt:editorOpt = {
    dom : "body",
    width : 100,
    height: 300,
    defaultValue:'',
    uploadurl: "",
    uploadname:"bf_file",
    editorurl: location.origin,
    toolbar : ['undo', 'redo', 'listul', 'listol','italic','bold','strikethrough','image','link','table','code','chart','fullscreen', 'Toc']
  };
  constructor (option:editorOpt) {
    this.opt = {
      width : 100,
      height: 300,
      defaultValue:'',
      toolbar : ['undo', 'redo', 'listul', 'listol','italic','bold','strikethrough','image','link','table','code','chart','fullscreen', 'Toc'],
      ...option
    }
    const self = this;
    this.TocWrapper = document.createElement('div');
    this.TocWrapper.classList.add('tocarea');
    this.TocWrapper.classList.add('hide');
    this.ChartTempSave = document.createElement('div');

    this.ImageInput = document.createElement('input');
    this.ImageInput.setAttribute('type', 'file');
    this.ImageInput.setAttribute('accept', 'image/*');
    this.ImageInput.classList.add('mvm-image-upload');
    this.ImageInput.addEventListener('change', async (e:any) => {
      const files = e.target.files;
      const selection = this.editor.getSelection();
      const res = await this.ImageUpload(files[0]);
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
    require.config({
      paths: { vs: `${this.opt.editorurl}/js/monaco-editor/min/vs` }
    });
    require(['vs/editor/editor.main'], function () {
      self.codeEditor = monaco.editor.create(self.codeArea, {
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
        while ( self.preview.hasChildNodes() ) {
          if(self.preview.firstChild) {
            if(((self.preview.firstChild as HTMLElement).querySelector('[data-chart]') as HTMLElement)) {
              let append = false;
              self.ChartTempSave.childNodes.forEach(element => {
                if(element === self.preview.firstChild) {
                  append = true;                  
                }
              });
              if(append === false) self.ChartTempSave.appendChild(self.preview.firstChild);
            }
            else {
              self.preview.removeChild(self.preview.firstChild);
            }
          }
        }
        //self.preview.innerHTML = sanitized;
        const nodeList = nodifyString(sanitized);
        const H:Array<HTMLElement> = [];
        nodeList.forEach((node: HTMLElement , i:Number) => {
          if((/h[1-6]/i).test(node.nodeName)) {
            H.push(node.cloneNode(true) as HTMLElement);
          }
          if(node.nodeName !== '#text') {
            const codeChart = node.querySelector('[data-chart]');
            if(codeChart) {
              let data = (codeChart as HTMLElement).dataset.chartdata;
              let append = false;
              self.ChartTempSave.childNodes.forEach(ChartTemp => {
                const temp = (ChartTemp as HTMLElement).querySelector('[data-chart]') as HTMLElement;                
                try {
                  if(temp.dataset.chartdata === data) {
                    self.preview.appendChild(ChartTemp);
                    append = true;
                  }
                }catch(e) {
                  console.log(e);
                }
              });
              if(append === false && data) {
                self.preview.appendChild(node);
                const chart = new ApexCharts(codeChart, JSON.parse(data));
                codeChart.textContent = "";
                chart.render();
              }
            }else{
              self.preview.appendChild(node);
            }
          }
        });
        //const tokens = marked.lexer(value);
        //const html = marked.parser(tokens);
        self.Toc(H);
        //console.log(H);
      });
      marked.setOptions({
        highlight: (code:string, lang:string) => {
          if(lang === 'apexchart') {
            //console.log('callback', callback);
            //callback(chartDiv);
            return `<div data-chart='apexchart' data-chartdata='${code}'></div>`;
          }
          else {
            return hljs.highlightAuto(code).value;
          }
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
  TocToggle(){
    if(this.TocWrapper.classList.contains('hide')) {
      this.TocWrapper.classList.remove('hide');
    }else {
      this.TocWrapper.classList.add('hide');
    } 
  }
  Toc(H:Array<HTMLElement>) {
    let paddingH:number = -1;
    let padding:number;
    //console.log('H', H);
    this.TocWrapper.innerHTML = '';
    const Wrapper = document.createElement('div');
    Wrapper.classList.add('mvm-Toc');
    H.forEach((node, i) => {
      const Num = /h([1-6])/i.exec(node.nodeName);
      const div = document.createElement('div');
      div.classList.add('mvm-Toc-List');
      if(Num) {
        if(i === 0) {
          paddingH = parseInt(Num[1]);
        }
        if(paddingH > parseInt(Num[1])) {
          paddingH = parseInt(Num[1]);
        }
        padding = (parseInt(Num[1]) - 1) - (paddingH - 1);
        div.style.paddingLeft = `${padding * 11}px`;
      }
      div.textContent = node.textContent;
      Wrapper.appendChild(div);
    });
    this.TocWrapper.appendChild(Wrapper);
    //console.log(TocWrapper);
    this.editorWrapper.insertBefore(this.TocWrapper, this.editarea);
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
    const strikethrough = this.iconAppend('fas fa-strikethrough');
    strikethrough.dataset.tooptip = "취소선";
    strikethrough.addEventListener('click', ()=>this.InsertTemplate("~~", "~~"))
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
    const chart = this.iconAppend('fas fa-chart-bar');
    chart.addEventListener('click', ()=>this.CreateChartModal())
    chart.dataset.tooptip = "차트";
    const fullscreen = this.iconAppend('fas fa-expand');
    fullscreen.addEventListener('click', ()=>this.FullScreeen())
    fullscreen.dataset.tooptip = "전체화면";
    const Toc = this.iconAppend('far fa-address-book');
    Toc.addEventListener('click', ()=>this.TocToggle())
    Toc.dataset.tooptip = "Toc(Table of Contents)";
    Toc.classList.add('balloon-right');
    Toc.style.float = "right";
    const info = this.iconAppend('fas fa-question');
    info.addEventListener('click', ()=>this.CreateInfo())
    info.dataset.tooptip = "에디터 정보";
    info.classList.add('balloon-right');
    info.style.float = "right";
    const preveiw = this.iconAppend('far fa-eye');
    preveiw.addEventListener('click', ()=>this.previewToggle())
    preveiw.dataset.tooptip = "미리보기";
    preveiw.classList.add('balloon-right');
    preveiw.style.float = "right";
    this.menuArea.appendChild(info);
    this.menuArea.appendChild(preveiw);
    this.opt.toolbar?.forEach(name => {
      if(name.toLowerCase() === "undo") this.menuArea.appendChild(undo);
      if(name.toLowerCase() === "redo") this.menuArea.appendChild(redo);
      if(name.toLowerCase() === "listul") this.menuArea.appendChild(listul);
      if(name.toLowerCase() === "listol") this.menuArea.appendChild(listol);
      if(name.toLowerCase() === "italic") this.menuArea.appendChild(italic);
      if(name.toLowerCase() === "bold") this.menuArea.appendChild(bold);
      if(name.toLowerCase() === "strikethrough") this.menuArea.appendChild(strikethrough);
      if(name.toLowerCase() === "image") this.menuArea.appendChild(image);
      if(name.toLowerCase() === "link") this.menuArea.appendChild(link);
      if(name.toLowerCase() === "table") this.menuArea.appendChild(table);
      if(name.toLowerCase() === "code") this.menuArea.appendChild(code);
      if(name.toLowerCase() === "blockquote") this.menuArea.appendChild(blockquote);
      if(name.toLowerCase() === "chart") this.menuArea.appendChild(chart);
      if(name.toLowerCase() === "fullscreen") this.menuArea.appendChild(fullscreen);
      if(name.toLowerCase() === "toc") this.menuArea.appendChild(Toc);
    });
    //this.menuArea.appendChild(Toc)
    /*
    this.menuArea.appendChild(undo);
    this.menuArea.appendChild(redo);
    this.menuArea.appendChild(listul);
    this.menuArea.appendChild(listol);
    this.menuArea.appendChild(italic);
    this.menuArea.appendChild(bold);
    this.menuArea.appendChild(strikethrough);
    this.menuArea.appendChild(image);
    this.menuArea.appendChild(link);
    this.menuArea.appendChild(table);
    this.menuArea.appendChild(code);
    this.menuArea.appendChild(blockquote);
    this.menuArea.appendChild(chart);
    this.menuArea.appendChild(fullscreen);
    this.menuArea.appendChild(info);
    */
  }
  CreateChartModal() {
    const self = this;
    const Modal = document.createElement('div');
    const chartMenu = document.createElement('div');
    const formatDocument = document.createElement('button');
    formatDocument.textContent = 'JSON 포맷 정렬';
    formatDocument.setAttribute('type', 'button');
    formatDocument.addEventListener('click', ()=>self.codeEditor.trigger('anyString','editor.action.formatDocument'));
    formatDocument.classList.add('mvm-popup-button');
    chartMenu.appendChild(formatDocument);
    const confirm = document.createElement('button');
    const chartWrapper = document.createElement('div');
    chartWrapper.classList.add('mvm-chartWrapper');
    const chartArea = document.createElement('div');
    chartArea.classList.add('mvm-chartArea');
    const preview = document.createElement('div');
    preview.classList.add('mvm-chartPreview');
    chartArea.appendChild(this.codeArea);
    chartWrapper.appendChild(chartArea);
    chartWrapper.appendChild(preview);

    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('mvm-tableWrapper');
    const selectType = document.createElement('select');
    selectType.add(this.optionElement('line'));
    selectType.add(this.optionElement('area'));
    selectType.add(this.optionElement('bar'));
    selectType.add(this.optionElement('rader'));
    selectType.add(this.optionElement('histogram'));
    selectType.add(this.optionElement('pie'));
    selectType.add(this.optionElement('donut'));
    selectType.add(this.optionElement('radialBar'));
    selectType.add(this.optionElement('scatter'));
    selectType.add(this.optionElement('bubble'));
    selectType.add(this.optionElement('heatmap'));
    selectType.add(this.optionElement('candelstick'));
    tableWrapper.appendChild(selectType);
    selectType.addEventListener('change', (e:any)=>{
      const value = e.target.value;
      try {
        const opt = JSON.parse(this.codeEditor.getValue());
        opt.chart.type = value;
        this.codeEditor.setValue(JSON.stringify(opt));
        this.codeEditor.trigger('anyString','editor.action.formatDocument');
        const chart = new ApexCharts(preview, opt);
        preview.innerHTML = '';
        chart.render();
      } catch (error) {
        console.log('error');
        throw new Error("JSON 파일이 아닙니다.");
      }
    });

    const table = document.createElement('table');
    table.classList.add('mvm-chart-table');
    const row = table.insertRow( table.rows.length ); // 하단에 추가
    row.insertCell(0);
    row.insertCell(1);
    tableWrapper.appendChild(table);

    confirm.addEventListener('click', ()=>this.InsertCode('apexchart'));
    confirm.classList.add('mvm-button');
    confirm.textContent = '확인';
    Modal.classList.add('mvm-modal');
    Modal.style.height = "90%";
    Modal.addEventListener('click', (e)=>e.stopPropagation());
    Modal.appendChild(chartMenu);
    Modal.appendChild(chartWrapper);
    Modal.appendChild(tableWrapper);
    Modal.appendChild(confirm);
    this.codeArea.style.height = "300px";
    const options = {
      chart: {
        type: 'line'
      },
      series: [{
        name: 'sales',
        data: [30,40,35,50,49,60,70,91,125]
      }],
      xaxis: {
        categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
      }
    }
    this.modalWrapper.appendChild(Modal);
    document.body.appendChild(this.modalWrapper);
    monaco.editor.setModelLanguage(this.codeEditor.getModel(), 'json');
    this.codeEditor.setValue(JSON.stringify(options));
    // this.codeEditor.getAction('editor.action.formatDocument').run().then(() => console.log('finished'));
    setTimeout(() => {
      console.log('실행')
      this.codeEditor.trigger('anyString','editor.action.formatDocument');
    }, 50);

    this.codeKeyup = this.codeEditor.onDidChangeModelContent((e:any) => {
      try {
        const opt = JSON.parse(this.codeEditor.getValue());
        const chart = new ApexCharts(preview, opt);
        preview.innerHTML = '';        
        chart.render();
      } catch (error) {
        throw new Error("JSON 파일이 아닙니다.");
      }
    })
  }
  FullScreeen() {
    if(this.wrapper?.classList.contains('mvm-fullscreen')) {
      this.wrapper?.classList.remove('mvm-fullscreen')
      this.editarea.style.height = `${this.opt.height}px`;
      this.preview.style.height = `${this.opt.height}px`;
    } else {
      this.wrapper?.classList.add('mvm-fullscreen')
      this.editarea.style.height = (window.innerHeight - 51) + "px";
      this.preview.style.height = (window.innerHeight - 51) + "px";
    }
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
    this.codeArea.style.height = (window.innerHeight - 200) + "px";
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
    if(this.codeKeyup) this.codeKeyup.dispose();
    this.modalWrapper.remove();
  }
  InsertCode(langTitle?:String) {
    const value = this.codeEditor.getValue();
    const selection = this.editor.getSelection();
    const lang:any = this.modalWrapper.querySelector('select');
    this.editor.executeEdits("", [{
      range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
      text: "\r\n```"+ (langTitle ? langTitle : lang.value) +"\r\n"+value+"\r\n```\r\n"
    }])
    this.RemoveModal();
  }
  async ImageUpload(File:File) {
    if(this.opt.Upload) {
      return this.opt.Upload(File);
    } else {
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
}

interface ViewerOpt{
  ele:string,
  cssClass:string,
  content?:string,
  tocPos?:string,
}
class mvmEditorViewer {
  private opt:ViewerOpt = {
    ele:"body",
    cssClass:'markdown-body',
    tocPos : "right",
  };
  private TocWrapper:HTMLElement = document.createElement('div');
  constructor(option:ViewerOpt) {
    const self = this;
    this.opt = {
      ...option
    }
    document.addEventListener('DOMContentLoaded', (event) => {
      if(this.opt.content) {
        this.innerHTML(this.opt.content);
      }
      document.querySelector(self.opt.ele)?.classList.add(self.opt.cssClass);
      hljs.initHighlightingOnLoad();
    });
  }
  async innerHTML (Html:string) {
    const viewer = document.querySelector(this.opt.ele);
    if(viewer) {
      viewer.innerHTML = Html;
      this.Toc();
    }
  }
  getMarkdown () {
    const turndownService:any = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced',
    })
    const markdown = turndownService.turndown(document.querySelector(this.opt.ele)?.innerHTML);
    return markdown;
  }
  Toc () {
    const H:Array<HTMLElement> = [];
    const pos = document.querySelector(this.opt.ele)?.getBoundingClientRect();
    const nodeList = document.querySelector(this.opt.ele)?.children;
    this.TocWrapper.style.position = "fixed";
    this.TocWrapper.style.zIndex = '1000';
    this.TocWrapper.style.left = `${pos?.right - this.TocWrapper.clientWidth}px`;
    this.TocWrapper.style.top = `${pos?.y}px`;

    console.log('nodeList', nodeList);
    Array.prototype.forEach.call(nodeList, (node:HTMLElement) => {
      if((/h[1-6]/i).test(node.nodeName)) {
        H.push(node.cloneNode(true) as HTMLElement);
      }
    });
    let paddingH:number = -1;
    let padding:number;
    const Wrapper = document.createElement('div');
    Wrapper.classList.add('mvm-Toc');
    H.forEach((node, i) => {
      const Num = /h([1-6])/i.exec(node.nodeName);
      const div = document.createElement('div');
      div.classList.add('mvm-Toc-List');
      if(Num) {
        if(i === 0) {
          paddingH = parseInt(Num[1]);
        }
        if(paddingH > parseInt(Num[1])) {
          paddingH = parseInt(Num[1]);
        }
        padding = (parseInt(Num[1]) - 1) - (paddingH - 1);
        div.style.paddingLeft = `${padding * 11}px`;
      }
      div.textContent = node.textContent;
      Wrapper.appendChild(div);
    });
    this.TocWrapper.appendChild(Wrapper);
    document.body.appendChild(this.TocWrapper);
    console.log(this.TocWrapper);
  }
}