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
import {is} from 'unist-util-is'
import {toText} from 'hast-util-to-text'

// import moncaoHighlight from './monaco-highlight';
// import "URL";
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'
import { visit } from 'unist-util-visit'

type Languages = "markdown" | "javascript" | "typescript" | "python" | "cpp" | "c" | "php"
type Theme = "vs-dark" | "vs"
type MarkdownStyle = "github" | "github-dark" | "github-light"

interface CustomIScrollEvent extends monaco.IScrollEvent{
  readonly _oldScrollHeight:number
  readonly _oldScrollLeft:number
  readonly _oldScrollTop:number
  readonly _oldScrollWidth:number
}
interface Option {
  element : string
  value?:string
  theme?:Theme
  height?:string
  language?:Languages
  preview?:boolean
  markdownStyle? : MarkdownStyle
}
type IScrollEvent = monaco.IScrollEvent;

export class VSCode {
  private monaco:typeof monaco;
  private option:Option = {
    element : 'container',
    value : 'Hello World',
    theme : 'vs-dark',
    height : "500px",
    language : 'markdown',
    markdownStyle : "github-dark",
    preview:true,
  }
  private wrapper : {
    parent:HTMLElement
    editor:HTMLElement
    preview:HTMLElement
  }
  private editor:monaco.editor.IStandaloneCodeEditor;
  private preview:HTMLElement
  private MARKDOWN_LINE_HEIGHT = 19;
  /* 모나코 에디터 라인 높이(단위 px) */
  constructor (option:Option) {
    this.option = {
      element : option.element ? option.element : this.option.element,
      value : option.value ? option.value : this.option.value,
      height : option.height ? option.height : this.option.height,
      theme : option.theme ? option.theme : this.option.theme,
      language : option.language ? option.language : this.option.language,
      preview : option.preview ? option.preview : this.option.preview,
      markdownStyle : option.markdownStyle ? option.markdownStyle : this.option.markdownStyle,
    }
    this.wrapper = {
      editor : document.createElement('div'),
      preview:  document.createElement('div'),
      parent : document.querySelector(this.option.element) ? document.querySelector(this.option.element) : document.createElement('div')
    }
    this.preview = document.createElement('div');
    this.wrapper.parent.style.display = "flex";
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
    this.wrapper.preview.classList.add('markdown-body');
    if(this.option.markdownStyle.indexOf("dark") !== -1) {
      this.wrapper.preview.classList.add('dark');
    }
    this.wrapper.parent.appendChild(this.wrapper.editor);
    this.wrapper.parent.appendChild(this.wrapper.preview);
    this.wrapper.preview.appendChild(this.preview);
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
    loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.31.1/min/vs" }, 'vs/nls': { availableLanguages: { '*': 'ko' }} });
    const { value, theme, language, height } = this.option;
    this.wrapper.parent.style.height = height;
    this.monaco = await loader.init();
    this.editor = this.monaco.editor.create(this.wrapper.editor, {
      value: value,
      language: language,
      theme: theme,
      scrollBeyondLastLine: false,
    })
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
    await setMonaco(this.monaco, language, theme);
    this.addmarkdownStyle(this.option.markdownStyle);
    if(value) {this.Viewer()}
  }
  
  private addmarkdownStyle (style:MarkdownStyle) {
    const cssId = 'MarkdownStyleCss';  // you could encode the css path itself to generate id..
    if (!document.getElementById(cssId)) {
      const head  = document.getElementsByTagName('head')[0];
      const link  = document.createElement('link');
      link.id   = cssId;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = `./css/${style}.css`;
      link.media = 'all';
      head.appendChild(link);
    } else {
      const link = document.getElementById(cssId) as HTMLLinkElement;
      if(link.tagName === "LINK") {
        link.href = `./css/${style}.css`;
      }
    }
  }

  /**
   * 미리보기
   * @param e monaco.editor.IModelContentChangedEvent
   */
  private async Viewer(e?:monaco.editor.IModelContentChangedEvent) {    
    const highlight = [];
    const html = await unified()
    .data('seetings', {fragment : true})
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(()=>{
      return (tree, file) => {
        visit(tree, 'element', (node) => {
          if(['table', 'tbody', 'thead'].includes(node.tagName) === false) {
            node.properties = {
              ...node.properties,
              "data-start-line" : node.position.start.line,
              "data-start-column" : node.position.start.column,
              "data-end-line" : node.position.end.line,
              "data-end-column" : node.position.end.column,
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
  public async getValue():Promise<string> {
    await this.initialize();
    return await this.editor.getValue();
  }

  /**
   * 에디터 값 세팅
   * @param value string
   */
  public async setValue(value:string):Promise<void> {
    await this.initialize();
    this.editor.setValue(value);
  }

  /**
   * markdown to html
   * @returns html(string)
   */
  public async getHtml():Promise<string> {
    await this.initialize();
    const mark = unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .processSync(this.editor.getValue())
    .toString()
    return mark;
  }

  /**
   * 
   * @param value markdown(string)
   */
  public async setHtml(value:string):Promise<void>{
    await this.initialize();
    const markdown = unified()
    .use(rehypeParse, {fragment : false})
    .use(rehypeFormat)
    .use(rehypeRemark)
    .use(remarkStringify)
    .processSync(await this.getHtml())
  }
}