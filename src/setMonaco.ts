import { Monaco } from "@monaco-editor/loader";
import { loadWASM } from "onigasm";
import { wireTmGrammars } from 'monaco-editor-textmate'
import { IThemeObject, updateTheme } from "./setTheme";
import { getJSON } from "./getJSON";
import { vslight } from "./theme/vslight";
import { vsdark } from "./theme/vsdark";

export const setMonaco = async (monaco:Monaco, language: string, theme:"vs-dark" | "vs" | "solarized-dark", path?:string) => {
  try {
    await loadWASM(`${path}/extensions/onigasm.wasm`);
  } catch (e) {
  }
  await monaco.languages.register({ id: language });
  const { registry, grammars } = getJSON(language, path);
  // validation settings
  monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true,
  });
  // compiler options
  monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.Latest,
    allowNonTsExtensions: true,
    allowJs: true
  });
  if(theme === "vs") {
    await monaco.editor.defineTheme(theme, vslight);
    const ITheme:IThemeObject = await (await fetch(`${path}/extensions/theme-defaults/themes/light_vs.json`)).json();
    await updateTheme(monaco, "vs", "vs", ITheme);
  }else if(theme === "solarized-dark") {
    await monaco.editor.defineTheme("solarized-dark", vsdark);
    const ITheme:IThemeObject = await (await fetch(`${path}/extensions/theme-solarized-dark/themes/solarized-dark-color-theme.json`)).json();
    await updateTheme(monaco, "solarized-dark", "vs-dark", ITheme);
  }else {
    await monaco.editor.defineTheme(theme, vsdark);
    await monaco.editor.setTheme(theme);
  }
  await wireTmGrammars(monaco, registry, grammars);
  return monaco;
}