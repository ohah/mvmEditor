import { Registry, IGrammarDefinition } from 'monaco-textmate' // peer dependency
const languages = {
  html: 'text.html.basic',
  css: 'source.css',
  "html.php": 'text.html.php',
  "php": 'source.php',
  "cpp": 'source.cpp',
  c: 'source.c',
  javascript : "source.jsx",
  typescript : "source.tsx",
  markdown : "text.html.markdown",
  "java" : "source.java",
  "python" : "source.python",
  "shell" : "source.shell",
  "powershell" : "source.powershell",
  "ini" : "source.ini",
  "log" : "source.log",
  "lua" : "source.lua",
  "makefile" : "source.makefile",
  "r" : "source.r",
  "yaml" : "source.yaml",
  "bat" : "source.batchfile",
}
class Load {
  async "source.c" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/c.tmLanguage.json`)).text()
    }
  }
  async "source.ini" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/ini/syntaxes/ini.tmLanguage.json`)).text()
    }
  }
  async "source.lua" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/lua/syntaxes/lua.tmLanguage.json`)).text()
    }
  }
  async "source.makefile" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/make/syntaxes/make.tmLanguage.json`)).text()
    }
  }
  async "source.perl" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/perl/syntaxes/perl.tmLanguage.json`)).text()
    }
  }
  async "source.perl.6" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/perl/syntaxes/perl6.tmLanguage.json`)).text()
    }
  }
  async "source.r" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/r/syntaxes/r.tmLanguage.json`)).text()
    }
  }
  async "source.ruby" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/ruby/syntaxes/ruby.tmLanguage.json`)).text()
    }
  }
  async "source.asp.vb.net" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/vb/syntaxes/asp-vb-net.tmLanguage.json`)).text()
    }
  }
  async "text.xml.xsl" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/xml/syntaxes/xsl.tmLanguage.json`)).text()
    }
  }
  async "source.yaml" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/yaml/syntaxes/yaml.tmLanguage.json`)).text()
    }
  }
  async "source.batchfile" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/bat/syntaxes/batchfile.tmLanguage.json`)).text()
    }
  }
  async "source.clojure" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/clojure/syntaxes/clojure.tmLanguage.json`)).text()
    }
  }
  async "source.coffee" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/coffeescript/syntaxes/coffeescript.tmLanguage.json`)).text()
    }
  }
  async "source.diff" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/git/syntaxes/diff.tmLanguage.json`)).text()
    }
  }
  async "source.dockerfile" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/docker/syntaxes/docker.tmLanguage.json`)).text()
    }
  }
  async "text.git-commit" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/git/syntaxes/git-commit.tmLanguage.json`)).text()
    }
  }
  async "text.git-rebase" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/git/syntaxes/git-rebase.tmLanguage.json`)).text()
    }
  }
  async "source.go" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/go/syntaxes/go.tmLanguage.json`)).text()
    }
  }
  async "source.groovy" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/groovy/syntaxes/groovy.tmLanguage.json`)).text()
    }
  }
  async "source.powershell" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/powershell/syntaxes/powershell.tmLanguage.json`)).text()
    }
  }
  async "source.scala" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/scala/syntaxes/scala.tmLanguage.xml`)).text()
    }
  }
  async "source.erlang" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/erlang/syntaxes/erlang.tmLanguage.xml`)).text()
    }
  }
  async "source.elixir" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/elixir/syntaxes/elixir.tmLanguage.xml`)).text()
    }
  }
  async "text.elixir" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/elixir/syntaxes/elixir.tmLanguage.xml`)).text()
    }
  }
  async "source.postscript" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/postscript/syntaxes/postscript.tmLanguage.xml`)).text()
    }
  }
  async "source.fsharp" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/fsharp/syntaxes/fsharp.tmLanguage.json`)).text()
    }
  }
  async "source.dart" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/dart/syntaxes/dart.tmLanguage.json`)).text()
    }
  }
  async "source.log" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/log/syntaxes/log.tmLanguage.json`)).text()
    }
  }
  async "text.log" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/log/syntaxes/log.tmLanguage.json`)).text()
    }
  }
  async "text.html.handlebars" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/handlebars/syntaxes/Handlebars.tmLanguage.json`)).text()
    }
  }
  async "source.shell" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/shellscript/syntaxes/shell-unix-bash.tmLanguage.json`)).text()
    }
  }
  async "source.js.jquery" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/jquery/syntaxes/jQuery (JavaScript).tmLanguage.xml`)).text()
    }
  }
  async "source.rust" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/rust/syntaxes/rust.tmLanguage.json`)).text()
    }
  }
  async "source.swift" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/swift/syntaxes/swift.tmLanguage.json`)).text()
    }
  }
  async "source.objc" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/objective-c/syntaxes/objective-c.tmLanguage.json`)).text()
    }
  }
  async "source.css.less" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/less/syntaxes/less.tmLanguage.json`)).text()
    }
  }
  async "source.less" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/less/syntaxes/less.tmLanguage.json`)).text()
    }
  }
  async "source.stylus" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/stylus/syntaxes/stylus.tmLanguage.json`)).text()
    }
  }
  async "source.sass" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/sass/syntaxes/sass.tmLanguage.json`)).text()
    }
  }
  async "source.css.scss" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/scss/syntaxes/scss.tmLanguage.json`)).text()
    }
  }
  async "source.sassdoc" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/scss/syntaxes/sassdoc.tmLanguage.json`)).text()
    }
  }
  async "source.json.comments" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/json/syntaxes/JSONC.tmLanguage.json`)).text()
    }
  }
  async "source.js.regexp" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/javascript/syntaxes/Regular Expressions (JavaScript).tmLanguage`)).text()
    }
  }
  async "text.pug" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/pug/syntaxes/pug.tmLanguage.json`)).text()
    }
  }
  async "text.html.markdown" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/markdown-basics/syntaxes/markdown.tmLanguage.json`)).text()
    }
  }
  async "source.c++" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/cpp.tmLanguage.json`)).text()
    }
  }
  async "source.cpp" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/cpp.tmLanguage.json`)).text()
    }
  }
  async "source.asm" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/asm.tmLanguage.xml`)).text()
    }
  }
  async "source.applescript" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/applescript/syntaxes/applescript.tmLanguage.xml`)).text()
    }
  }
  async "text.html.textile" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/html/syntaxes/html-textile.tmLanguage.xml`)).text()
    }
  }
  async "source.x86" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/language-x86_64-assembly.tmLanguage.xml`)).text()
    }
  }
  async "source.x86_64" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/language-x86_64-assembly.tmLanguage.xml`)).text()
    }
  }
  async "source.arm" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/arm.tmLanguage.xml`)).text()
    }
  }
  async "source.cpp.embedded.macro" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/cpp.embedded.macro.tmLanguage.json`)).text()
    }
  }
  async "source.regexp.python" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/python/syntaxes/MagicRegExp.tmLanguage.json`)).text()
    }
  }
  async "source.python" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/python/syntaxes/MagicPython.tmLanguage.json`)).text()
    }
  }
  async "source.glsl" ():Promise<IGrammarDefinition> {
    return {
      format: 'plist',
      content: await (await fetch(`${this.path}/extensions/cpp/syntaxes/glsl.tmLanguage.xml`)).text()
    }
  }
  async "source.sql" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/sql/syntaxes/sql.tmLanguage.json`)).text()
    }
  }
  async "text.html.basic" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/html/syntaxes/html.tmLanguage.json`)).text()
    }
  }
  async "text.html.derivative" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/html/syntaxes/html-derivative.tmLanguage.json`)).text()
    }
  }
  async "source.css" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/css/syntaxes/css.tmLanguage.json`)).text()
    }
  }
  async "source.cs" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/csharp/syntaxes/csharp.tmLanguage.json`)).text()
    }
  }
  async "source.js" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/javascript/syntaxes/JavaScript.tmLanguage.json`)).text()
    }
  }
  async "source.jsx" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/javascript/syntaxes/JavaScriptReact.tmLanguage.json`)).text()
    }
  }
  async "source.ts" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/typescript-basics/syntaxes/TypeScript.tmLanguage.json`)).text()
    }
  }
  async "source.tsx" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/typescript-basics/syntaxes/TypeScriptReact.tmLanguage.json`)).text()
    }
  }
  async "text.html.php" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/php/syntaxes/html.tmLanguage.json`)).text()
    }
  }
  async "source.php" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/php/syntaxes/php.tmLanguage.json`)).text()
    }
  }
  async "source.json" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/json/syntaxes/JSON.tmLanguage.json`)).text()
    }
  }
  async "source.java" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/java/syntaxes/java.tmLanguage.json`)).text()
    }
  }
  async "text.html.javadoc" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/java/syntaxes/javadoc.tmLanguage.json`)).text()
    }
  }
  async "text.xml" ():Promise<IGrammarDefinition> {
    return {
      format: 'json',
      content: await (await fetch(`${this.path}/extensions/xml/syntaxes/xml.tmLanguage.json`)).text()
    }
  }
  private path:string;
  run (language:string, path):Registry {
    const self = this;
    this.path = path;
    return new Registry({
      getGrammarDefinition: async (scopeName, dependentScope) => {
        try{
          // console.log(scopeName);
          return self[scopeName]();
        }catch(e){
          console.log('error', scopeName);
        }
      },
      // getInjections: (scopeName) => {
      //   console.log('getInjections', scopeName);
      //   return ['s'];
      // }
    });
  }
}
export const getJSON = (language: string, path?:string): { grammars: Map<string, string>, registry: Registry } => {
  path = path ? path : '';
  const grammars = new Map<string, string>();
  grammars.set(language, languages[`${language}`]);
  const registry = new Load().run(language, path);
  return { grammars: grammars, registry: registry }
}