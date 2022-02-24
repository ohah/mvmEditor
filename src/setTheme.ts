import * as monaco from 'monaco-editor';
import Color from "color";

/**
 * Converts a color string or a color to a hex string.
 *
 * @param color The value to convert.
 *
 * @returns A hex string of the given color, including the alpha value.
 */
export const colorToHex = (color: string | Color | undefined): string | undefined => {
    if (!color) {
        return;
    }

    if (typeof color === "string") {
        color = new Color(color);
    }

    // Hex color values have no alpha component, so we have to add that explicitly.
    if (color.alpha() < 1) {
        let alpha = Math.round((color.alpha() * 255)).toString(16);
        if (alpha.length < 2) {
            alpha = "0" + alpha;
        }

        return color.hex() + alpha;
    } else {
        return color.hex();
    }
};

export type Monaco = typeof monaco;
export interface ITokenThemeRule {
  token: string;
  foreground?: string;
  background?: string;
  fontStyle?: string;
}
export interface Colors { [key: string]: string }
export interface ITokenEntry {
  name?: string;
  scope: string[] | string;
  settings: {
    foreground?: string;
    background?: string;
    fontStyle?: string;
  };
}
export type languageType = "python" | "c" | "cpp" | "csharp" | "ruby" | "go" | "java" | "php" | "html" | "css" | "javascript" | "typescript" | "json" | "markdown"
// This is the structure of a vscode theme file.
export interface IThemeObject {
  name: string;
  type?: string;
  include?: string;
  colors?: Colors;

  settings?: ITokenEntry[];    // Old style specification.
  tokenColors?: ITokenEntry[]; // This is how it should be done now.
}
export interface Snippets {
  prefix: string;
  body: string[] | string; 
  description: string;
}

export interface ISnippetsObject {
  [key: string]: Snippets
}
class Load {
  async "javascript"(): Promise<string> {
    const result = { 
      ...await (await fetch('/extensions/javascript/snippets/javascript.code-snippets')).json(),
      ...await (await fetch('/extensions/jquery/snippets/jquery.code-snippets')).json(),
      ...await (await fetch('/extensions/javascript/snippets/react.code-snippets')).json(),
    }
    return result;
  }
  async "markdown"(): Promise<string> {
    return await (await fetch('/extensions/markdown-basics/snippets/markdown.code-snippets')).json()
  }
  async "typescript"(): Promise<string> {
    const result = { 
      ...await (await fetch('/extensions/typescript-basics/snippets/typescript.code-snippets')).json(),
      ...await (await fetch('/extensions/typescript-basics/snippets/react.code-snippets')).json(),
    }
    return result;
  }
  async "csharp"(): Promise<string> {
    return await (await fetch('/extensions/csharp/snippets/csharp.code-snippets')).json()
  }
  async "fsharp"(): Promise<string> {
    return await (await fetch('/extensions/fsharp/snippets/fsharp.code-snippets')).json()
  }
  async "groovy"(): Promise<string> {
    return await (await fetch('/extensions/groovy/snippets/groovy.code-snippets')).json()
  }
  async "java"(): Promise<string> {
    return await (await fetch('/extensions/java/snippets/java.code-snippets')).json()
  }
  async "php"(): Promise<string> {
    return await (await fetch('/extensions/php/snippets/php.code-snippets')).json()
  }
  async "powershell"(): Promise<string> {
    return await (await fetch('/extensions/powershell/snippets/powershell.code-snippets')).json()
    }
  async "swift"(): Promise<string> {
    return await (await fetch('/extensions/swift/snippets/swift.code-snippets')).json()
  }
  async "vb"(): Promise<string> {
    return await (await fetch('/extensions/vb/snippets/vb.code-snippets')).json()
  }
  async "batchfile"(): Promise<string> {
    return await (await fetch('/extensions/bat/snippets/batchfile.code-snippets')).json()
  }
  async "cpp"(): Promise<string> {
    return await (await fetch('/extensions/cpp/snippets/cpp.code-snippets')).json()
  }
  async "c"(): Promise<string> {
    return await (await fetch('/extensions/cpp/snippets/c.code-snippets')).json()
  }
  async run(language: languageType): Promise<ISnippetsObject> {
    const text = await this[language]();
    return text;
    console.log(text.trim());
    return JSON.parse(text.trim());
  }
}

/**
 * 
 * @param monaco Monaco Object
 * @param langauge langauge
 */
export async function updateSnippets(monaco: Monaco, langauge: languageType) {
  try{
  const load = new Load();
  const snippets = await load.run(langauge);
  monaco.languages.registerCompletionItemProvider(langauge, {
    provideCompletionItems: (model, position, contenxt, token)=> {
      const result:monaco.languages.CompletionList = {
        suggestions : [],
      };
      // const suggestion:monaco.languages.CompletionItem[] = [];
      Object.values(snippets).forEach((snippet)=>{
        const {prefix, body, description} = snippet;
        const getColumn = model.getWordAtPosition(position)
        if(getColumn) {
          const {startColumn, endColumn} = getColumn;
          const data:monaco.languages.CompletionItem = {
            label : prefix,
            insertText : typeof body === 'string' ? body : body.join('\n'),
            documentation : description,
            detail:description,
            kind: monaco.languages.CompletionItemKind.Interface,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: startColumn,
              endColumn: endColumn,
            },
            // command : {
            //   id : prefix,
            //   title : prefix,
            //   tooltip : description,
            // }
          }
          result.suggestions.push(data);
        }
      });
      return result;
    }
  })
  }catch(e) {
    console.log('자동완성을 지원하지 않는 언어입니다');
  }
  // snippets
  // console.log('javascript', JSON.parse(snippets));
  // Object.values(snippets).forEach(element => {
  //   console.log(element);
  // });
  // await (await fetch('/extensions/javascript/snippets/javascript.code-snippets')).text()
}
/**
 * Updates the theme used by all code editor instances.
 *
 * @param theme The theme name.
 * @param type The base type of the theme.
 * @param values The actual theme values.
 */
export function updateTheme(monaco: Monaco, theme: string, type: "vs" | "vs-dark", values: IThemeObject): void {
  // Convert all color values to CSS hex form.
  const entries: { [key: string]: string } = {};
  for (const [key, value] of Object.entries(values.colors || {})) {
    entries[key] = colorToHex(value) || "";
  }
  const tokenRules: ITokenThemeRule[] = [];
  (values.tokenColors || []).forEach((value: ITokenEntry): void => {
    const scopeValue = value.scope || [];
    const scopes = Array.isArray(scopeValue) ? scopeValue : scopeValue.split(",");
    scopes.forEach((scope: string): void => {
      tokenRules.push({
        token: scope,
        foreground: colorToHex(value.settings.foreground),
        background: colorToHex(value.settings.background),
        fontStyle: value.settings.fontStyle,
      });
    });
  });

  monaco.editor.defineTheme(theme, {
    base: type === "vs" ? "vs" : "vs-dark",
    inherit: true,
    rules: tokenRules,
    colors: entries,
  });
  monaco.editor.setTheme(theme);
}