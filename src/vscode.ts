import loader, { Monaco } from '@monaco-editor/loader';
import * as monaco from 'monaco-editor';
import { setMonaco } from './setMonaco';
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkToc from 'remark-toc'
import remarkHtml from 'remark-html'
import rehypeHighlight from 'rehype-highlight'
import { unified } from 'unified'
import { rehype } from 'rehype'
import rehypeParse from 'rehype-parse'
import rehypeRemark from 'rehype-remark'
import remarkRehype from "remark-rehype";
import rehypeFormat from 'rehype-format';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse'
import { all } from 'mdast-util-to-hast'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize, {defaultSchema} from 'rehype-sanitize'
import remarkStringify from 'remark-stringify';
import rehypeSlug from 'rehype-slug'
import remarkMath from "remark-math";
import rehypeKatex from 'rehype-katex'
import remarkFrontmatter from 'remark-frontmatter'

import { remarkMermaid } from "remark-mermaidjs"
import {is} from 'unist-util-is'
import {toText} from 'hast-util-to-text'

// import moncaoHighlight from './monaco-highlight';
// import "URL";
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'
import { visit } from 'unist-util-visit'
import { codeIcon, moonIcon, sunIcon, uploadIcon } from './icon';


type Languages = "markdown" | "javascript" | "typescript" | "python" | "cpp" | "c" | "php"
type Theme = "vs-dark" | "vs"
type MarkdownStyle = "github" | "github-dark" | "github-light"

interface Images {
  code:string
  url?:string
  name?:string
}
interface CustomIScrollEvent extends monaco.IScrollEvent{
  readonly _oldScrollHeight:number
  readonly _oldScrollLeft:number
  readonly _oldScrollTop:number
  readonly _oldScrollWidth:number
}
interface Option {
  element : string
  path?:string,
  value?:string
  html?:boolean
  theme?:Theme
  height?:string
  language?:Languages
  preview?:boolean
  markdownStyle? : MarkdownStyle
  imageUpload?:(e:FileList)=>Promise<any> | undefined
  mobile?:boolean
}

export default class VSCode {
  private monaco:typeof monaco;
  private option:Option = {
    element : 'container',
    path:'',
    value : '',
    html : false,
    theme : 'vs-dark',
    height : "500px",
    language : 'markdown',
    markdownStyle : "github-dark",
    preview:true,
    mobile:false,
  }
  private wrapper : {
    parent:HTMLElement
    editor:HTMLElement
    preview:HTMLElement
    mobile:HTMLElement,
    body:HTMLElement,
    header:HTMLElement,
  }
  private editor:monaco.editor.IStandaloneCodeEditor;
  private preview:HTMLElement
  private upload:HTMLInputElement;
  private menu : {
    imageupload : HTMLElement,
    preview : HTMLElement,
    theme : HTMLElement,
  }
  private MARKDOWN_LINE_HEIGHT = 19;
  private CSS_ID = 'MarkdownStyleCss';  // you could encode the css path itself to generate id..
  /* 모나코 에디터 라인 높이(단위 px) */
  constructor (option:Option) {
    this.option = {
      element : option.element ? option.element : this.option.element,
      path : option.path ? option.path : this.option.path,
      value : option.value ? option.value : this.option.value,
      html : option.html ? option.html : this.option.html,
      height : option.height ? option.height : this.option.height,
      theme : option.theme ? option.theme : this.option.theme,
      language : option.language ? option.language : this.option.language,
      preview : option.preview === false ? option.preview : this.option.preview,
      markdownStyle : option.markdownStyle ? option.markdownStyle : this.option.markdownStyle,
      mobile : option.mobile ? option.mobile : this.option.mobile,
      imageUpload : option.imageUpload ? option.imageUpload : undefined,
    }
    this.upload = document.createElement("input");
    this.upload.addEventListener('change', (e)=>{
      this.option.imageUpload((e.target as HTMLInputElement).files).then((row)=>{
        if(row.url) {
          const selection = this.editor.getSelection();
          const id = { majonr : 1, minor : 1}
          const imageText = `\n![image](${row.url})`;
          const op = {identifier: id, range: selection, text: imageText, forceMoveMarkers: true};
          this.editor.executeEdits("my-source", [op]);
        }
      }).then(()=>{
        this.upload.value = '';
      });
    })
    this.upload.type = "file";
    this.wrapper = {
      editor : document.createElement('div'),
      preview:  document.createElement('div'),
      parent : document.querySelector(this.option.element) ? document.querySelector(this.option.element) : document.createElement('div'),
      mobile : document.createElement('div'),
      body : document.createElement('div'),
      header : document.createElement('header'),
    }
    this.menu = {
      imageupload : document.createElement('button'),
      preview : document.createElement('button'),
      theme : document.createElement('button'),
    }
    Object.values(this.menu).forEach((button:HTMLButtonElement) => {
      button.classList.add('mobile-btn');
      button.type = "button";
    });
    this.wrapper.parent.classList.add('mvm-wrapper');
    this.wrapper.mobile.classList.add("mobile-menu");
    this.wrapper.mobile.classList.add(this.option.theme === "vs" ? "" : "menu-dark");
    this.menu.imageupload.appendChild(uploadIcon());
    this.menu.imageupload.addEventListener("click", ()=>{this.upload.click()})
    this.menu.preview.appendChild(codeIcon());
    this.menu.preview.addEventListener("click", ()=>{this.togglePreview()})
    this.menu.theme.appendChild(this.option.theme === "vs-dark" ? sunIcon() : moonIcon())
    this.menu.theme.addEventListener("click", ()=>{this.themeChange()})
    this.wrapper.header.classList.add('menu-');
    this.wrapper.body.classList.add('body-');
    this.preview = document.createElement('div');
    this.wrapper.body.style.display = "flex";
    this.wrapper.editor.style.width = "50%";
    this.wrapper.editor.style.height = "100%";
    this.wrapper.editor.style.display = "flex";
    this.wrapper.editor.style.flexGrow = "1";
    this.wrapper.preview.style.width = "50%";
    this.wrapper.preview.style.flex = "none";
    this.wrapper.preview.style.position = "relative";
    this.wrapper.preview.style.padding = "0.5rem 0.75rem";
    this.preview.style.overflowY = "auto";
    this.preview.style.overflowX = "hidden";
    this.preview.style.height = "100%";
    this.wrapper.parent.appendChild(this.wrapper.header);
    this.wrapper.parent.appendChild(this.wrapper.body);
    this.wrapper.preview.classList.add('markdown-body');
    if(this.option.mobile === true) {
      Object.values(this.menu).forEach((button:HTMLButtonElement) => {
        this.wrapper.mobile.appendChild(button);  
      });
      this.wrapper.header.appendChild(this.wrapper.mobile);
    }
    if(this.option.markdownStyle.indexOf("dark") !== -1) {
      this.wrapper.preview.classList.add('dark');
    }
    this.wrapper.body.appendChild(this.wrapper.editor);
    if(this.option.preview === true) {
      this.wrapper.body.appendChild(this.wrapper.preview);
      this.wrapper.preview.appendChild(this.preview);
    }
  }  
  /**
   * 편집시 싱크.
   * 편집 Element를 표시해줌.
   * @returns 
   */
  private async MonacoSync() {
    const { lineNumber } = this.editor.getPosition();
    // console.log(Event.selection, line)
    const nodes = this.wrapper.preview.querySelectorAll(`[data-start-line]`)
    const list = Array.from(nodes).map((node)=>{
      const start = parseInt(node.getAttribute('data-start-line'));
      const end = parseInt(node.getAttribute('data-end-line'));
      return {
        node : node,
        between : end - start === 0 ? Array.from({length : 1}, ()=> start) : Array.from({length : end + 1 - start}, (v, i)=> i + start),
      }
    })
    const between = list.find((data) => {
      const { between, node } = data;
      if(between.includes(lineNumber)) {
        return true;
      }
    })
    // console.log(line, _oldScrollTop - scrollTop > 0, between)
    if(between) {
      between.node.scrollIntoView({behavior: "auto", block:"end", inline: "end"});
      const isFocus = this.preview.querySelector('.isFocus');
      if(isFocus) isFocus.classList.remove('isFocus');
      between.node.classList.add('isFocus');
    } 
  }

  public async initialize() {
    if (this.monaco === undefined) {
      await this._doInitialize();
    }
  }
  
  private async _doInitialize() {
    loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.32.1/min/vs" }, 'vs/nls': { availableLanguages: { '*': 'ko' }} });
    const { value, theme, language, height } = this.option;
    this.wrapper.body.style.height = height;
    this.monaco = await loader.init();
    if(this.option.html === true) {
      const markdown = unified()
      .use(rehypeParse, {
        fragment : true,
        emitParseErrors: true, // Emit all.
        missingWhitespaceBeforeDoctypeName: 2, // Mark one as a fatal error.
        nonVoidHtmlElementStartTagWithTrailingSolidus: false // Ignore one.
      })
      .use(remarkFrontmatter)
      .use(remarkGfm)
      // .use(remarkMath)
      // .use(rehypeKatex)
      .use(rehypeFormat)
      .use(rehypeRemark)
      .use(remarkStringify)
      .processSync(value)
      .toString();
      this.editor = this.monaco.editor.create(this.wrapper.editor, {
        value: markdown,
        language: language,
        theme: theme,
        scrollBeyondLastLine: false,
      })
    }else {
      this.editor = this.monaco.editor.create(this.wrapper.editor, {
        value: value,
        language: language,
        theme: theme,
        scrollBeyondLastLine: false,
      })
    }
    
    this.editor.addAction({
      id : "Image Upload",
      label : "이미지 업로드",
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run : (ed) => {
        this.upload.click();
      }
    });
    this.editor.addAction({
      id : "preveiw on/off",
      label : "미리보기 열기/닫기",
      contextMenuGroupId: 'navigation',
      contextMenuOrder: 1.5,
      run : (ed) => {
        this.togglePreview();
      }
    });
    this.editor.onDidChangeModelContent(async (e)=>{
      await this.Viewer(e);
      await this.MonacoSync();
    });
    this.editor.onDidChangeCursorSelection((e)=>{this.MonacoSync()})
    if(this.option.preview === true) {
      this.preview.addEventListener("scroll", (e) => {
      })
    }
    window.onresize = () => {
      this.editor.layout()
    }
    await setMonaco(this.monaco, language, theme, this.option.path);
    this.addmarkdownStyle(this.option.markdownStyle);
    if(value) {this.Viewer()}
  }
  /**
   * markdownChange
   * @param theme MarkdownStyle "github" | "github-dark" | "github-theme"
   */
  public async themeChange () {
    const toggleTheme:Theme =  this.option.theme === "vs" ? "vs-dark" : "vs";
    const toggleStyle:MarkdownStyle =  this.option.theme === "vs" ? "github-dark" : "github-light";
    setMonaco(this.monaco, this.option.language, toggleTheme, this.option.path);
    this.addmarkdownStyle(toggleStyle);
    this.option.theme = toggleTheme;
    this.menu.theme.innerHTML = toggleTheme === "vs" ? moonIcon().outerHTML : sunIcon().outerHTML;
    this.option.markdownStyle = toggleStyle;
    if (toggleTheme === "vs") {
      this.wrapper.mobile.classList.remove('menu-dark');
    } else {
      this.wrapper.mobile.classList.add('menu-dark');
    }
  }
  /**
   * 미리보기 토글
   */
  public togglePreview () {
    if(this.option.preview === false) {
      this.wrapper.body.appendChild(this.wrapper.preview);
      this.wrapper.preview.appendChild(this.preview);
      this.option.preview = true;
    }else if(this.option.preview === true) {
      this.option.preview = false;
      this.wrapper.preview.remove();
      this.preview.remove();
    }
    this.editor.layout();
  }

  /**
   * 마크다운 스타일
   * @param style Markdown;
   */
  private addmarkdownStyle (style:MarkdownStyle) {
    if (!document.getElementById(this.CSS_ID)) {
      const head  = document.getElementsByTagName('head')[0];
      const link  = document.createElement('link');
      link.id   = this.CSS_ID;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = `${this.option.path ? this.option.path : '.'}/css/${style}.css`;
      link.media = 'all';
      head.appendChild(link);
    } else {
      const link = document.getElementById(this.CSS_ID) as HTMLLinkElement;
      if(link.tagName === "LINK") {
        link.href = `${this.option.path ? this.option.path : '.'}/css/${style}.css`;
      }
    }
  }

  /**
   * 미리보기
   * @param e monaco.editor.IModelContentChangedEvent
   */
  public async Viewer(e?:monaco.editor.IModelContentChangedEvent) {    
    const highlight = [];
    const html = await unified()
    .data('seetings', {fragment : true})
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    // .use(remarkMath)
    // .use(rehypeKatex)
    // .use(reamrkMermaid)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(()=>{
      return (tree, file) => {
        visit(tree, 'element', (node) => {
          if(['table', 'tbody', 'thead'].includes(node.tagName) === false) {
            if(node.position) {
              node.properties = {
                ...node.properties,
                "data-start-line" : node.position.start.line,
                "data-start-column" : node.position.start.column,
                "data-end-line" : node.position.end.line,
                "data-end-column" : node.position.end.column,
              }
            }
          }
          if(['code', 'pre'].includes(node.tagName) === true) {
            node.children.map((children)=>{
              if(children.type === 'element') {
                children.children?.forEach((child)=>{
                  if(child) {
                    const code = this.wrapper.preview.querySelector(`[data-start-line="${children.position.start.line}"]:not(table)`);
                    const length = (child as any).value.split('\n').filter(row=>{if(row) return row}).length; //text line개수 구하기
                    let text = '';
                    for (let i = 0; i < length; i++) {
                      text += this.monaco.editor.colorizeModelLine(this.editor.getModel(), children.position.start.line + 1 + i)+"\n";                      
                    }
                    highlight.push({
                      startline : children.position.start.line,
                      text : text
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
    .processSync(this.editor.getValue())
    .toString();
    this.preview.innerHTML = html;
    highlight.forEach(code => {
      this.preview.querySelector(`[data-start-line="${code.startline}"]:not(table)`).innerHTML = code.text;
    });
  }
  
  /**
   * 에디터 값 가져오기
   * @returns language string
   */
  public getValue():string {
    // await this.initialize();
    return this.editor.getValue();
  }

  /**
   * 에디터 값 세팅
   * @param value string
   */
  public async setValue(value:string):Promise<void> {
    await this.initialize();
    await this.editor.setValue(value);
  }

  /**
   * markdown to html
   * @returns html(string)
   */
  public getHtml():string {
    // await this.initialize();
    const html = unified()
    .data('seetings', {fragment : true})
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    // .use(remarkMath)
    // .use(rehypeKatex)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .processSync(this.editor.getValue())
    .toString();
    const result = document.createElement('div');
    result.innerHTML = html;    
    return result.innerHTML;
  }

  /**
   * 
   * @param value markdown(string)
   */
  public async setHtml(value:string):Promise<void>{
    await this.initialize();
    const markdown = unified()
    .use(rehypeParse, {
      fragment : true,
      emitParseErrors: true, // Emit all.
      missingWhitespaceBeforeDoctypeName: 2, // Mark one as a fatal error.
      nonVoidHtmlElementStartTagWithTrailingSolidus: false // Ignore one.
    })
    .use(remarkFrontmatter)
    .use(remarkGfm)
    // .use(remarkMath)
    // .use(rehypeKatex)
    .use(rehypeFormat)
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(value)
    .toString();

    await this.editor.setValue(markdown)
  }
}