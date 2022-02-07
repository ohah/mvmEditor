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

// import moncaoHighlight from './monaco-highlight';
// import "URL";
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide'
import { visit } from 'unist-util-visit'

type Languages = "markdown" | "javascript" | "typescript" | "python" | "cpp" | "c" | "php"
type Theme = "vs-dark" | "vs"
type MarkdownStyle = "github" | "github-dark" | "github-light"
interface Option {
  element : string
  value?:string
  theme?:Theme
  height?:string
  language?:Languages
  preview?:boolean
  markdownStyle? : MarkdownStyle
}

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
  private MARKDOWN_LINE_HEIGHT = 17;
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
    this.wrapper.parent.appendChild(this.wrapper.editor);
    this.wrapper.parent.appendChild(this.wrapper.preview);
    this.wrapper.preview.appendChild(this.preview);
  }  
    

  private async MonacoScrollSync(ScrollEvent:monaco.IScrollEvent) {
    const { scrollTop } = ScrollEvent;
    const line = parseInt(`${Math.ceil(scrollTop / this.MARKDOWN_LINE_HEIGHT)}`) + 1;
    const preview = this.wrapper.preview.querySelector(`[data-start-line="${line}"]`);
    preview.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
  }

  public async initialize() {
    if (this.monaco === undefined) {
      await this._doInitialize();
      window.onresize = () => {
        this.editor.layout()
      }
      this.editor.onDidScrollChange((e)=>this.MonacoScrollSync(e))
      if(this.option.preview === true) {
        this.wrapper.preview.addEventListener("scroll", (e) => {
          console.log('preview', e);
        })
      }
    }
  }
  

  private async _doInitialize() {
    loader.config({ paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.31.1/min/vs" }, 'vs/nls': { availableLanguages: { '*': 'ko' } } });
    const { value, theme, language, height } = this.option;
    this.wrapper.parent.style.height = height;
    this.monaco = await loader.init();
    this.editor = this.monaco.editor.create(this.wrapper.editor, {
      value: value,
      language: language,
      theme: theme,
      scrollBeyondLastLine: false,
    })
    this.editor.onDidChangeModelContent((e)=>this.Viewer(e));
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
    const html = unified()
    .data('seetings', {fragment : true})
    .use(remarkParse)
    .use(remarkRehype)
    .use(remarkGfm)
    .use(rehypeStringify)
    .use(rehypeSlug)
    .use(()=>{
      return (tree, file) => {
        visit(tree, 'element', (node) => {
          node.properties = {
            ...node.properties,
            "data-start-line" : node.position.start.line,
            "data-start-column" : node.position.start.column,
            "data-end-line" : node.position.end.line,
            "data-end-column" : node.position.end.column,
          }
        })
      }
    })
    .processSync(this.editor.getValue())
    .toString();
    this.preview.innerHTML = html;
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

    const html = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(()=>{
      return (tree) => {
        tree.children.map((children)=>{
          if(children.type === "inlineCode") {
            console.log('씨바"')
          }
        })
        return tree;
        // eslint-disable-next-line
        visit(tree, 'element', (node:any) => {
          if(node.tagName === 'code') {
            let html = '';
            const className = node.properties && node.properties.className;
            const { start , end } = node.position;
            const lang = className.map((cls)=> {
              if(cls.slice(0, 5) === 'lang-') {
                return cls.slice(5)
              }
              if(cls.slice(0, 9) === 'language-') {
                return cls.slice(9)
              }
            }).join('')
            if(!lang) {
              return false;
            }
            let k = 0;         
            const childrens = [];
            node.children.forEach((children)=>{
              if(children.value && lang) {
                const text = children.value.split('\n');
                for(let i = start.line + 1; i < end.line; i++) {
                  const div = document.createElement('div');
                  const high = monaco.editor.colorizeModelLine(this.editor.getModel(), i);
                  html += high;
                  div.insertAdjacentHTML('beforeend', high);
                  // spans.replaceWith(...spans.childNodes as any)
                  // console.log('spans', spans);
                  const highlight = div.querySelectorAll('span');
                  console.log('spans', div, highlight);

                  highlight.forEach(span => {
                    const element = {
                      type : "element",
                      tagName : "span",
                      properties : {
                        className : [span.className]
                      },
                      children : [
                        {type:'text', value : span.textContent}
                      ]
                    }
                    if(span.className) {
                      childrens.push(element)
                    }
                  });
                  childrens.push({
                    type : 'element',
                    tagName : 'span',
                    properties : {},
                    children : [
                      {type:'text', value : '\n'}
                    ]
                  });
                }
              }
            })
            // console.log(childrens);
            // console.log(node);
            node = {
              type : 'text',
              value : `<pre class="language-${lang}"><code>${html}</code></pre>`
            }
            console.log(node);
          }
        })
      }
    })
    .use(rehypeFormat) // 추가
    .use(rehypeStringify)
    .processSync(this.editor.getValue())
    .toString();
    // console.log(this.option);
    // setMonaco(this.monaco, this.option.language, this.option.theme);
    return html;
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
    console.log(markdown);
  }
}