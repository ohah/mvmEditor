var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var mvmEditor = /** @class */ (function () {
    function mvmEditor(option) {
        var _this = this;
        this.opt = {
            dom: "body",
            width: 100,
            height: 300,
            defaultValue: '',
            uploadurl: "",
            uploadname: "bf_file",
            editorurl: location.origin,
            toolbar: ['undo', 'redo', 'listul', 'listol', 'italic', 'bold', 'strikethrough', 'image', 'link', 'table', 'code', 'chart', 'fullscreen']
        };
        this.opt = __assign({ width: 100, height: 300, defaultValue: '', toolbar: ['undo', 'redo', 'listul', 'listol', 'italic', 'bold', 'strikethrough', 'image', 'link', 'table', 'code', 'chart', 'fullscreen'] }, option);
        var self = this;
        this.ChartTempSave = document.createElement('div');
        this.ImageInput = document.createElement('input');
        this.ImageInput.setAttribute('type', 'file');
        this.ImageInput.setAttribute('accept', 'image/*');
        this.ImageInput.classList.add('mvm-image-upload');
        this.ImageInput.addEventListener('change', function (e) { return __awaiter(_this, void 0, void 0, function () {
            var files, selection, res, _a, endLineNumber, endColumn;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        files = e.target.files;
                        selection = this.editor.getSelection();
                        return [4 /*yield*/, this.ImageUpload(files[0])];
                    case 1:
                        res = _b.sent();
                        if (res.status !== "404") {
                            this.editor.executeEdits("", [
                                {
                                    range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
                                    text: "![image](" + res.url + ")"
                                }
                            ]);
                            _a = this.editor.getSelection(), endLineNumber = _a.endLineNumber, endColumn = _a.endColumn;
                            this.editor.setPosition({ lineNumber: endLineNumber, column: endColumn });
                        }
                        console.log(e.target);
                        e.target.value = "";
                        return [2 /*return*/];
                }
            });
        }); });
        this.codeArea = document.createElement('div');
        this.codeArea.style.height = (window.innerHeight - 200) + "px";
        this.modalWrapper = document.createElement('div');
        this.modalWrapper.classList.add('mvm-modal-wrapper');
        this.modalWrapper.addEventListener('click', function () { return _this.RemoveModal(); });
        document.addEventListener('DOMContentLoaded', function (event) {
            var _a;
            self.wrapper = document.querySelector(_this.opt.dom);
            (_a = self.wrapper) === null || _a === void 0 ? void 0 : _a.classList.add('mvm-wrapper');
            self.previewBtn.addEventListener('click', function () { return self.previewToggle(); });
        });
        this.editorWrapper = document.createElement('div');
        this.editorWrapper.classList.add('mvm-edit-wrapper');
        this.menuArea = document.createElement('div');
        this.menuArea.className = 'mvm-menuArea';
        this.CreateMenu();
        this.previewBtn = document.createElement('button');
        this.previewBtn.setAttribute('type', 'button');
        this.previewBtn.textContent = '미리보기';
        this.previewBtn.classList.add('previewBtn');
        this.editarea = document.createElement('div');
        this.editarea.classList.add('editorarea');
        this.editarea.style.height = this.opt.height + "px";
        this.preview = document.createElement('div');
        this.preview.classList.add('preivewarea', 'markdown-body');
        this.preview.style.height = this.opt.height + "px";
        this.preview.style.overflow = "auto";
        var defaultValue = this.opt.defaultValue ? this.opt.defaultValue : '';
        console.log(this.opt.editorurl);
        require.config({
            paths: { vs: this.opt.editorurl + "/js/monaco-editor/min/vs" }
        });
        require(['vs/editor/editor.main'], function () {
            var _this = this;
            var _a, _b, _c;
            self.codeEditor = monaco.editor.create(self.codeArea, {
                theme: "vs",
                wordWrap: true,
                fontFamily: 'Nanum Gothic Coding',
                automaticLayout: true,
                value: '',
                lineNumbers: true,
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
                lineNumbers: false,
                //fontSize : 20,
                wrappingStrategy: "advanced",
                //language: 'javascript'
                language: 'markdown',
                //readOnly: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false
            });
            self.editor.onDidPaste(function (e) {
            });
            self.editor.onDidFocusEditorText(function (e) {
                focuseditor = self.editor;
            });
            window.addEventListener('paste', function (e) { return __awaiter(_this, void 0, void 0, function () {
                var items, i, matches, selection, pastePosition, range, file, res, _a, endLineNumber, endColumn;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            items = e.clipboardData.files;
                            i = 0;
                            _b.label = 1;
                        case 1:
                            if (!(i < items.length)) return [3 /*break*/, 4];
                            matches = items[i].type.match(/^image\/(png|jpg|jpeg|gif)$/i);
                            selection = focuseditor.getSelection();
                            pastePosition = e;
                            range = new monaco.Range(pastePosition.startLineNumber || selection.endLineNumber, pastePosition.startColumn || selection.endColumn, pastePosition.endLineNumber || selection.endLineNumber, pastePosition.endColumn || selection.endColumn);
                            if (!matches) return [3 /*break*/, 3];
                            file = items[i];
                            return [4 /*yield*/, self.ImageUpload(file)];
                        case 2:
                            res = _b.sent();
                            if (res.status !== 404) {
                                focuseditor.executeEdits("", [
                                    {
                                        range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
                                        text: "![image](" + res.url + ")"
                                    }
                                ]);
                                _a = focuseditor.getSelection(), endLineNumber = _a.endLineNumber, endColumn = _a.endColumn;
                                focuseditor.setPosition({ lineNumber: endLineNumber, column: endColumn });
                            }
                            _b.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            }); });
            self.editor.onDidChangeModelContent(function (e) {
                var renderer = new marked.Renderer();
                renderer.code2 = function (body, ordered, start) {
                    //console.log(body, ordered,start);
                    var temp = "<pre><code class=\"language-" + ordered + "\">" + body + "</code></pre>";
                    return temp;
                };
                var html = marked(self.editor.getValue(), {
                    renderer: renderer
                });
                var sanitized = DOMPurify.sanitize(html, '');
                var _loop_1 = function () {
                    if (self.preview.firstChild) {
                        if (self.preview.firstChild.querySelector('[data-chart]')) {
                            var append_1 = false;
                            self.ChartTempSave.childNodes.forEach(function (element) {
                                if (element === self.preview.firstChild) {
                                    append_1 = true;
                                }
                            });
                            if (append_1 === false)
                                self.ChartTempSave.appendChild(self.preview.firstChild);
                        }
                        else {
                            self.preview.removeChild(self.preview.firstChild);
                        }
                    }
                };
                while (self.preview.hasChildNodes()) {
                    _loop_1();
                }
                //self.preview.innerHTML = sanitized;
                var nodeList = nodifyString(sanitized);
                var H = [];
                nodeList.forEach(function (node, i) {
                    if ((/h[1-6]/i).test(node.nodeName)) {
                        H.push(node.cloneNode(true));
                    }
                    if (node.nodeName !== '#text') {
                        var codeChart = node.querySelector('[data-chart]');
                        if (codeChart) {
                            var data_1 = codeChart.dataset.chartdata;
                            var append_2 = false;
                            self.ChartTempSave.childNodes.forEach(function (ChartTemp) {
                                var temp = ChartTemp.querySelector('[data-chart]');
                                try {
                                    if (temp.dataset.chartdata === data_1) {
                                        self.preview.appendChild(ChartTemp);
                                        append_2 = true;
                                    }
                                }
                                catch (e) {
                                    console.log(e);
                                }
                            });
                            if (append_2 === false && data_1) {
                                self.preview.appendChild(node);
                                var chart = new ApexCharts(codeChart, JSON.parse(data_1));
                                codeChart.textContent = "";
                                chart.render();
                            }
                        }
                        else {
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
                highlight: function (code, lang) {
                    if (lang === 'apexchart') {
                        //console.log('callback', callback);
                        //callback(chartDiv);
                        return "<div data-chart='apexchart' data-chartdata='" + code + "'></div>";
                    }
                    else {
                        return hljs.highlightAuto(code).value;
                    }
                }
            });
            var html = marked(self.editor.getValue());
            var sanitized = DOMPurify.sanitize(html, '');
            self.preview.innerHTML = sanitized;
            self.editorWrapper.appendChild(self.editarea);
            self.editorWrapper.appendChild(self.preview);
            (_a = self.wrapper) === null || _a === void 0 ? void 0 : _a.appendChild(self.menuArea);
            (_b = self.wrapper) === null || _b === void 0 ? void 0 : _b.appendChild(self.editorWrapper);
            (_c = self.wrapper) === null || _c === void 0 ? void 0 : _c.appendChild(self.previewBtn);
        });
    }
    mvmEditor.prototype.getMarkdown = function () {
        var turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });
        return this.editor.getValue();
    };
    mvmEditor.prototype.setMarkdown = function (text) {
        this.editor.setValue(text);
    };
    mvmEditor.prototype.setHtml = function (text) {
        var turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });
        var markdown = turndownService.turndown(text);
        this.editor.setValue(markdown);
    };
    mvmEditor.prototype.getHtml = function () {
        return marked(this.editor.getValue());
    };
    mvmEditor.prototype.iconAppend = function (className) {
        var btn = document.createElement('button');
        btn.classList.add('balloon');
        btn.setAttribute('type', 'button');
        var i = document.createElement('i');
        i.className = className;
        btn.appendChild(i);
        return btn;
    };
    mvmEditor.prototype.previewToggle = function () {
        if (this.preview.classList.contains('hide')) {
            this.preview.classList.remove('hide');
            this.editarea.classList.remove('editorarea2');
            this.previewBtn.classList.remove('active');
        }
        else {
            this.preview.classList.add('hide');
            this.editarea.classList.add('editorarea2');
            this.previewBtn.classList.add('active');
        }
    };
    mvmEditor.prototype.Toc = function (H) {
        var TocWrapper = document.createElement('div');
        var paddingH = -1;
        var padding;
        //console.log('H', H);
        H.forEach(function (node) {
            var Num = /h([1-6])/i.exec(node.nodeName);
            var div = document.createElement('div');
            console.log('Num', Num);
            if (Num) {
                if (paddingH < parseInt(Num[1]) - 1 || paddingH === -1) {
                    paddingH = parseInt(Num[1]) - 1;
                }
                padding = parseInt(Num[1]) - 1;
                div.style.paddingLeft = padding * 15 + "px";
            }
            div.textContent = node.textContent;
            TocWrapper.appendChild(div);
        });
        //console.log(TocWrapper);
        document.body.appendChild(TocWrapper);
    };
    mvmEditor.prototype.CreateMenu = function () {
        var _this = this;
        var _a;
        var undo = this.iconAppend('fas fa-undo');
        undo.dataset.tooptip = "취소";
        undo.addEventListener('click', function () { return _this.editor.getModel().undo(); });
        var redo = this.iconAppend('fas fa-redo');
        redo.addEventListener('click', function () { return _this.editor.getModel().redo(); });
        redo.dataset.tooptip = "되돌리기";
        var listul = this.iconAppend('fas fa-list-ul');
        var listulDefalut = [
            "",
            "-  ",
            "-  ",
            "-  ",
            "",
        ].join('\r\n');
        listul.addEventListener('click', function () { return _this.InsertTemplate("", listulDefalut); });
        listul.dataset.tooptip = "목록(숫자)";
        var listol = this.iconAppend('fas fa-list-ol');
        var listolDefalut = [
            "",
            "1.  ",
            "2.  ",
            "3.  ",
            "",
        ].join('\r\n');
        listol.addEventListener('click', function () { return _this.InsertTemplate("", listolDefalut); });
        listol.dataset.tooptip = "목록";
        var italic = this.iconAppend('fas fa-italic');
        italic.dataset.tooptip = "기울임";
        italic.addEventListener('click', function () { return _this.InsertTemplate("_", "_"); });
        var bold = this.iconAppend('fas fa-bold');
        bold.dataset.tooptip = "굵게";
        bold.addEventListener('click', function () { return _this.InsertTemplate("**", "**"); });
        var strikethrough = this.iconAppend('fas fa-strikethrough');
        strikethrough.dataset.tooptip = "취소선";
        strikethrough.addEventListener('click', function () { return _this.InsertTemplate("~~", "~~"); });
        var image = this.iconAppend('fas fa-image');
        image.addEventListener('click', function () { return _this.ImageInput.click(); });
        image.dataset.tooptip = "이미지 업로드";
        var link = this.iconAppend('fas fa-link');
        link.addEventListener('click', function () {
            var text = _this.getSelectionText();
            _this.InsertTemplate(")", "[" + text + "](");
        });
        link.dataset.tooptip = "링크";
        var table = this.iconAppend('fas fa-table');
        var tableDefalut = [
            "",
            "| H1  | H2  | H3",
            "| ---  | ---  | ---",
            "| R1  | R2  | R3",
            "",
        ].join('\r\n');
        table.dataset.tooptip = "표(3X3)";
        table.addEventListener('click', function () { return _this.InsertTemplate("", tableDefalut); });
        var code = this.iconAppend('fas fa-code');
        code.addEventListener('click', function () { return _this.CreateCodeModal(); });
        code.dataset.tooptip = "코드";
        var blockquote = this.iconAppend('fas fa-quote-right');
        blockquote.dataset.tooptip = "주석";
        blockquote.addEventListener('click', function () { return _this.InsertTemplate(">", ""); });
        var chart = this.iconAppend('fas fa-chart-bar');
        chart.addEventListener('click', function () { return _this.CreateChartModal(); });
        chart.dataset.tooptip = "차트";
        var fullscreen = this.iconAppend('fas fa-expand');
        fullscreen.addEventListener('click', function () { return _this.FullScreeen(); });
        fullscreen.dataset.tooptip = "전체화면";
        var info = this.iconAppend('fas fa-question');
        info.addEventListener('click', function () { return _this.CreateInfo(); });
        info.dataset.tooptip = "에디터 정보";
        info.classList.add('balloon-right');
        info.style.float = "right";
        (_a = this.opt.toolbar) === null || _a === void 0 ? void 0 : _a.forEach(function (name) {
            if (name.toLowerCase() === "undo")
                _this.menuArea.appendChild(undo);
            if (name.toLowerCase() === "redo")
                _this.menuArea.appendChild(redo);
            if (name.toLowerCase() === "listul")
                _this.menuArea.appendChild(listul);
            if (name.toLowerCase() === "listol")
                _this.menuArea.appendChild(listol);
            if (name.toLowerCase() === "italic")
                _this.menuArea.appendChild(italic);
            if (name.toLowerCase() === "bold")
                _this.menuArea.appendChild(bold);
            if (name.toLowerCase() === "strikethrough")
                _this.menuArea.appendChild(strikethrough);
            if (name.toLowerCase() === "image")
                _this.menuArea.appendChild(image);
            if (name.toLowerCase() === "link")
                _this.menuArea.appendChild(link);
            if (name.toLowerCase() === "table")
                _this.menuArea.appendChild(table);
            if (name.toLowerCase() === "code")
                _this.menuArea.appendChild(code);
            if (name.toLowerCase() === "blockquote")
                _this.menuArea.appendChild(blockquote);
            if (name.toLowerCase() === "chart")
                _this.menuArea.appendChild(chart);
            if (name.toLowerCase() === "fullscreen")
                _this.menuArea.appendChild(fullscreen);
            if (name.toLowerCase() === "info")
                _this.menuArea.appendChild(info);
        });
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
    };
    mvmEditor.prototype.CreateChartModal = function () {
        var _this = this;
        var self = this;
        var Modal = document.createElement('div');
        var chartMenu = document.createElement('div');
        var formatDocument = document.createElement('button');
        formatDocument.textContent = 'JSON 포맷 정렬';
        formatDocument.setAttribute('type', 'button');
        formatDocument.addEventListener('click', function () { return self.codeEditor.trigger('anyString', 'editor.action.formatDocument'); });
        formatDocument.classList.add('mvm-popup-button');
        chartMenu.appendChild(formatDocument);
        var confirm = document.createElement('button');
        var chartWrapper = document.createElement('div');
        chartWrapper.classList.add('mvm-chartWrapper');
        var chartArea = document.createElement('div');
        chartArea.classList.add('mvm-chartArea');
        var preview = document.createElement('div');
        preview.classList.add('mvm-chartPreview');
        chartArea.appendChild(this.codeArea);
        chartWrapper.appendChild(chartArea);
        chartWrapper.appendChild(preview);
        var tableWrapper = document.createElement('div');
        tableWrapper.classList.add('mvm-tableWrapper');
        var selectType = document.createElement('select');
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
        selectType.addEventListener('change', function (e) {
            var value = e.target.value;
            try {
                var opt = JSON.parse(_this.codeEditor.getValue());
                opt.chart.type = value;
                _this.codeEditor.setValue(JSON.stringify(opt));
                _this.codeEditor.trigger('anyString', 'editor.action.formatDocument');
                var chart = new ApexCharts(preview, opt);
                preview.innerHTML = '';
                chart.render();
            }
            catch (error) {
                console.log('error');
                throw new Error("JSON 파일이 아닙니다.");
            }
        });
        var table = document.createElement('table');
        table.classList.add('mvm-chart-table');
        var row = table.insertRow(table.rows.length); // 하단에 추가
        row.insertCell(0);
        row.insertCell(1);
        tableWrapper.appendChild(table);
        confirm.addEventListener('click', function () { return _this.InsertCode('apexchart'); });
        confirm.classList.add('mvm-button');
        confirm.textContent = '확인';
        Modal.classList.add('mvm-modal');
        Modal.style.height = "90%";
        Modal.addEventListener('click', function (e) { return e.stopPropagation(); });
        Modal.appendChild(chartMenu);
        Modal.appendChild(chartWrapper);
        Modal.appendChild(tableWrapper);
        Modal.appendChild(confirm);
        this.codeArea.style.height = "300px";
        var options = {
            chart: {
                type: 'line'
            },
            series: [{
                    name: 'sales',
                    data: [30, 40, 35, 50, 49, 60, 70, 91, 125]
                }],
            xaxis: {
                categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
            }
        };
        this.modalWrapper.appendChild(Modal);
        document.body.appendChild(this.modalWrapper);
        monaco.editor.setModelLanguage(this.codeEditor.getModel(), 'json');
        this.codeEditor.setValue(JSON.stringify(options));
        // this.codeEditor.getAction('editor.action.formatDocument').run().then(() => console.log('finished'));
        setTimeout(function () {
            console.log('실행');
            _this.codeEditor.trigger('anyString', 'editor.action.formatDocument');
        }, 50);
        this.codeKeyup = this.codeEditor.onDidChangeModelContent(function (e) {
            try {
                var opt = JSON.parse(_this.codeEditor.getValue());
                var chart = new ApexCharts(preview, opt);
                preview.innerHTML = '';
                chart.render();
            }
            catch (error) {
                throw new Error("JSON 파일이 아닙니다.");
            }
        });
    };
    mvmEditor.prototype.FullScreeen = function () {
        var _a, _b, _c;
        if ((_a = this.wrapper) === null || _a === void 0 ? void 0 : _a.classList.contains('mvm-fullscreen')) {
            (_b = this.wrapper) === null || _b === void 0 ? void 0 : _b.classList.remove('mvm-fullscreen');
            this.editarea.style.height = this.opt.height + "px";
            this.preview.style.height = this.opt.height + "px";
        }
        else {
            (_c = this.wrapper) === null || _c === void 0 ? void 0 : _c.classList.add('mvm-fullscreen');
            this.editarea.style.height = (window.innerHeight - 51) + "px";
            this.preview.style.height = (window.innerHeight - 51) + "px";
        }
    };
    mvmEditor.prototype.getSelectionText = function () {
        return this.editor.getModel().getValueInRange(this.editor.getSelection());
    };
    mvmEditor.prototype.CreateInfo = function () {
        var self = this;
        var Modal = document.createElement('div');
        Modal.style.background = "#fff";
        Modal.style.padding = "30px";
        Modal.innerHTML = "개발 버전. 재배포 수정 불가";
        Modal.addEventListener('click', function (e) { return e.stopPropagation(); });
        this.modalWrapper.appendChild(Modal);
        document.body.appendChild(this.modalWrapper);
    };
    mvmEditor.prototype.InsertTemplate = function (prefix, lastfix) {
        //console.log('클릭', lastfix);
        var selection = this.editor.getSelection();
        this.editor.executeEdits("", [{
                range: new monaco.Range(selection.endLineNumber, selection.endColumn, selection.endLineNumber, selection.endColumn),
                text: prefix
            }]);
        this.editor.executeEdits("", [{
                range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
                text: lastfix
            }]);
    };
    mvmEditor.prototype.optionElement = function (value, text) {
        var opt = document.createElement("option");
        opt.value = value;
        opt.text = text ? text : value;
        return opt;
    };
    mvmEditor.prototype.CreateCodeModal = function () {
        var _this = this;
        var self = this;
        var Modal = document.createElement('div');
        var codeMenu = document.createElement('div');
        var selectLang = document.createElement('select');
        var confirm = document.createElement('button');
        confirm.addEventListener('click', function () { return _this.InsertCode(); });
        confirm.classList.add('mvm-button');
        confirm.textContent = '확인';
        this.codeArea.style.height = (window.innerHeight - 200) + "px";
        selectLang.add(this.optionElement('javascript'));
        selectLang.add(this.optionElement('typescript'));
        selectLang.add(this.optionElement('html'));
        selectLang.add(this.optionElement('json'));
        selectLang.add(this.optionElement('css'));
        selectLang.add(this.optionElement('python'));
        selectLang.add(this.optionElement('mysql'));
        selectLang.add(this.optionElement('c'));
        selectLang.add(this.optionElement('cpp'));
        selectLang.add(this.optionElement('java'));
        selectLang.add(this.optionElement('csharp'));
        selectLang.add(this.optionElement('go'));
        selectLang.add(this.optionElement('php'));
        selectLang.add(this.optionElement('rust'));
        selectLang.addEventListener('change', function (e) {
            var value = e.target.value;
            monaco.editor.setModelLanguage(self.codeEditor.getModel(), value);
        });
        codeMenu.appendChild(selectLang);
        Modal.classList.add('mvm-modal');
        Modal.addEventListener('click', function (e) { return e.stopPropagation(); });
        Modal.appendChild(codeMenu);
        Modal.appendChild(this.codeArea);
        Modal.appendChild(confirm);
        this.modalWrapper.appendChild(Modal);
        document.body.appendChild(this.modalWrapper);
        monaco.editor.setModelLanguage(this.codeEditor.getModel(), 'javascript');
        this.codeEditor.setValue('');
    };
    mvmEditor.prototype.RemoveModal = function () {
        while (this.modalWrapper.hasChildNodes()) {
            if (this.modalWrapper.firstChild)
                this.modalWrapper.removeChild(this.modalWrapper.firstChild);
        }
        if (this.codeKeyup)
            this.codeKeyup.dispose();
        this.modalWrapper.remove();
    };
    mvmEditor.prototype.InsertCode = function (langTitle) {
        var value = this.codeEditor.getValue();
        var selection = this.editor.getSelection();
        var lang = this.modalWrapper.querySelector('select');
        this.editor.executeEdits("", [{
                range: new monaco.Range(selection.startLineNumber, selection.startColumn, selection.startLineNumber, selection.startColumn),
                text: "\r\n```" + (langTitle ? langTitle : lang.value) + "\r\n" + value + "\r\n```\r\n"
            }]);
        this.RemoveModal();
    };
    mvmEditor.prototype.ImageUpload = function (File) {
        return __awaiter(this, void 0, void 0, function () {
            var formData, res, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log(this.opt.Upload);
                        if (!this.opt.Upload) return [3 /*break*/, 1];
                        console.log('실행');
                        return [2 /*return*/, this.opt.Upload(File)];
                    case 1:
                        formData = new FormData();
                        formData.append(this.opt.uploadname, File);
                        _a.label = 2;
                    case 2:
                        _a.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, fetch(this.opt.uploadurl, {
                                method: 'POST',
                                body: formData
                            })];
                    case 3:
                        res = _a.sent();
                        return [2 /*return*/, res.json()];
                    case 4:
                        err_1 = _a.sent();
                        return [2 /*return*/, { success: false }];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return mvmEditor;
}());
var mvmEditorViewer = /** @class */ (function () {
    function mvmEditorViewer(option) {
        var _this = this;
        this.opt = {
            ele: "body",
            cssClass: 'markdown-body'
        };
        var self = this;
        this.opt = __assign({}, option);
        document.addEventListener('DOMContentLoaded', function (event) {
            var _a;
            if (_this.opt.content) {
                _this.innerHTML(_this.opt.content);
            }
            (_a = document.querySelector(self.opt.ele)) === null || _a === void 0 ? void 0 : _a.classList.add(self.opt.cssClass);
            hljs.initHighlightingOnLoad();
        });
    }
    mvmEditorViewer.prototype.innerHTML = function (Html) {
        var viewer = document.querySelector(this.opt.ele);
        if (viewer)
            viewer.innerHTML = Html;
    };
    mvmEditorViewer.prototype.getMarkdown = function () {
        var _a;
        var turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });
        var markdown = turndownService.turndown((_a = document.querySelector(this.opt.ele)) === null || _a === void 0 ? void 0 : _a.innerHTML);
        return markdown;
    };
    return mvmEditorViewer;
}());
