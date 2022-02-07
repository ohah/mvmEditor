import {editor} from "monaco-editor/esm/vs/editor/editor.api"

export const csdark:editor.IStandaloneThemeData= {
  "base": "vs-dark",
  "inherit": true,
  "rules": [
    {
      "background": "d4d4d4",
      "token": ""
    },
    {
      "foreground": "e1efff",
      "token": "punctuation - (punctuation.definition.string || punctuation.definition.comment)"
    },
    {
      "foreground": "ff628c",
      "token": "constant"
    },
    {
      "foreground": "4ec9b0",
      "token": "entity"
    },
    {
      "foreground": "c586c0",
      "token": "keyword"
    },
    {
      "foreground": "569cd6",
      "token": "storage"
    },
    {
      "foreground": "3ad900",
      "token": "string -string.unquoted.old-plist -string.unquoted.heredoc"
    },
    {
      "foreground": "3ad900",
      "token": "string.unquoted.heredoc string"
    },
    {
      "foreground": "0088ff",
      "fontStyle": "italic",
      "token": "comment"
    },
    {
      "foreground": "80ffbb",
      "token": "support"
    },
    {
      "foreground": "9cdcfe",
      "token": "variable"
    },
    {
      "foreground": "ff80e1",
      "token": "variable.language"
    },
    {
      "foreground": "ffee80",
      "token": "meta.function-call"
    },
    {
      "foreground": "f8f8f8",
      "background": "800f00",
      "token": "invalid"
    },
    {
      "foreground": "ffffff",
      "background": "223545",
      "token": "text source"
    },
    {
      "foreground": "ffffff",
      "background": "223545",
      "token": "string.unquoted.heredoc"
    },
    {
      "foreground": "ffffff",
      "background": "223545",
      "token": "source source"
    },
    {
      "foreground": "80fcff",
      "fontStyle": "italic",
      "token": "entity.other.inherited-class"
    },
    {
      "foreground": "9eff80",
      "token": "string.quoted source"
    },
    {
      "foreground": "80ff82",
      "token": "string constant"
    },
    {
      "foreground": "80ffc2",
      "token": "string.regexp"
    },
    {
      "foreground": "edef7d",
      "token": "string variable"
    },
    {
      "foreground": "ffb054",
      "token": "support.function"
    },
    {
      "foreground": "eb939a",
      "token": "support.constant"
    },
    {
      "foreground": "ff1e00",
      "token": "support.type.exception"
    },
    {
      "foreground": "8996a8",
      "token": "meta.preprocessor.c"
    },
    {
      "foreground": "afc4db",
      "token": "meta.preprocessor.c keyword"
    },
    {
      "foreground": "73817d",
      "token": "meta.sgml.html meta.doctype"
    },
    {
      "foreground": "73817d",
      "token": "meta.sgml.html meta.doctype entity"
    },
    {
      "foreground": "73817d",
      "token": "meta.sgml.html meta.doctype string"
    },
    {
      "foreground": "73817d",
      "token": "meta.xml-processing"
    },
    {
      "foreground": "73817d",
      "token": "meta.xml-processing entity"
    },
    {
      "foreground": "73817d",
      "token": "meta.xml-processing string"
    },
    {
      "foreground": "9effff",
      "token": "meta.tag"
    },
    {
      "foreground": "9effff",
      "token": "meta.tag entity"
    },
    {
      "foreground": "9effff",
      "token": "meta.selector.css entity.name.tag"
    },
    {
      "foreground": "ffb454",
      "token": "meta.selector.css entity.other.attribute-name.id"
    },
    {
      "foreground": "5fe461",
      "token": "meta.selector.css entity.other.attribute-name.class"
    },
    {
      "foreground": "9df39f",
      "token": "support.type.property-name.css"
    },
    {
      "foreground": "f6f080",
      "token": "meta.property-group support.constant.property-value.css"
    },
    {
      "foreground": "f6f080",
      "token": "meta.property-value support.constant.property-value.css"
    },
    {
      "foreground": "f6aa11",
      "token": "meta.preprocessor.at-rule keyword.control.at-rule"
    },
    {
      "foreground": "edf080",
      "token": "meta.property-value support.constant.named-color.css"
    },
    {
      "foreground": "edf080",
      "token": "meta.property-value constant"
    },
    {
      "foreground": "eb939a",
      "token": "meta.constructor.argument.css"
    },
    {
      "foreground": "f8f8f8",
      "background": "000e1a",
      "token": "meta.diff"
    },
    {
      "foreground": "f8f8f8",
      "background": "000e1a",
      "token": "meta.diff.header"
    },
    {
      "foreground": "f8f8f8",
      "background": "4c0900",
      "token": "markup.deleted"
    },
    {
      "foreground": "f8f8f8",
      "background": "806f00",
      "token": "markup.changed"
    },
    {
      "foreground": "f8f8f8",
      "background": "154f00",
      "token": "markup.inserted"
    },
    {
      "background": "8fddf630",
      "token": "markup.raw"
    },
    {
      "background": "004480",
      "token": "markup.quote"
    },
    {
      "background": "130d26",
      "token": "markup.list"
    },
    {
      "foreground": "c1afff",
      "fontStyle": "bold",
      "token": "markup.bold"
    },
    {
      "foreground": "b8ffd9",
      "fontStyle": "italic",
      "token": "markup.italic"
    },
    {
      "foreground": "c8e4fd",
      "background": "001221",
      "fontStyle": "bold",
      "token": "markup.heading"
    }
  ],
  "colors": {
    "editor.background": "#1E1E1E",
		"editor.foreground": "#D4D4D4",
		"editor.inactiveSelectionBackground": "#3A3D41",
		"editorIndentGuide.background": "#404040",
		"editorIndentGuide.activeBackground": "#707070",
		"editor.selectionHighlightBackground": "#ADD6FF26",
		"list.dropBackground": "#383B3D",
		"activityBarBadge.background": "#007ACC",
		"sideBarTitle.foreground": "#BBBBBB",
		"input.placeholderForeground": "#A6A6A6",
		"menu.background": "#252526",
		"menu.foreground": "#CCCCCC",
		"statusBarItem.remoteForeground": "#FFF",
		"statusBarItem.remoteBackground": "#16825D",
		"ports.iconRunningProcessForeground": "#369432",
		"sideBarSectionHeader.background": "#0000",
		"sideBarSectionHeader.border": "#ccc3",
		"tab.lastPinnedBorder": "#ccc3",
		"list.activeSelectionIconForeground": "#FFF"
  }
}