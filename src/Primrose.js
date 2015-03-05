/* 
 * Copyright (C) 2015 Sean T. McBeth <sean@seanmcbeth.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

function Primrose(renderToElementOrID, Renderer, options) {
    "use strict";
    var self = this;
    //////////////////////////////////////////////////////////////////////////
    // normalize input parameters
    //////////////////////////////////////////////////////////////////////////

    options = options || {};


    //////////////////////////////////////////////////////////////////////////
    // private fields
    //////////////////////////////////////////////////////////////////////////

    var codePage,
            operatingSystem,
            browser,
            commandSystem,
            keyboardSystem,
            commandPack = {},
            tokenizer,
            tokens,
            theme,
            pointerX,
            pointerY,
            tabWidth,
            tabString,
            currentTouchID,
            deadKeyState = "",
            keyNames = [],
            history = [],
            historyFrame = -1,
            scrollLeft = 0,
            gridBounds = new Rectangle(),
            lineCountWidth = 0,
            leftGutterWidth = 0,
            topGutterHeight = 0,
            rightGutterWidth = 0,
            bottomGutterHeight = 0,
            tokenRows = null,
            lineCount = 0,
            dragging = false,
            focused = false,
            changed = false,
            showLineNumbers = true,
            showScrollBars = true,
            wordWrap = false,
            renderer = new Renderer(renderToElementOrID, options),
            surrogate = cascadeElement("primrose-surrogate-textarea-" +
                    renderer.id, "textarea", HTMLTextAreaElement),
            surrogateContainer;

    //////////////////////////////////////////////////////////////////////////
    // public fields
    //////////////////////////////////////////////////////////////////////////

    this.frontCursor = new Cursor();
    this.backCursor = new Cursor();
    this.scrollTop = 0;


    //////////////////////////////////////////////////////////////////////////
    // private methods
    //////////////////////////////////////////////////////////////////////////

    function refreshTokens() {
        tokens = tokenizer.tokenize(self.getText());
    }

    function clampScroll() {
        if (self.scrollTop < 0) {
            self.scrollTop = 0;
        }
        else
            while (0 < self.scrollTop && self.scrollTop > self.lineCount -
                    gridBounds.height) {
                --self.scrollTop;
            }
    }

    function minDelta(v, minV, maxV) {
        var dvMinV = v - minV,
                dvMaxV = v - maxV + 5,
                dv = 0;
        if (dvMinV < 0 || dvMaxV >= 0) {
            // compare the absolute values, so we get the smallest change
            // regardless of direction.
            dv = Math.abs(dvMinV) < Math.abs(dvMaxV) ? dvMinV : dvMaxV;
        }

        return dv;
    }

    function readClipboard(evt) {
        var i = evt.clipboardData.types.indexOf("text/plain");
        if (i < 0) {
            for (i = 0; i < evt.clipboardData.types.length; ++i) {
                if (/^text/.test(evt.clipboardData.types[i])) {
                    break;
                }
            }
        }
        if (i >= 0) {
            var type = evt.clipboardData.types[i],
                    str = evt.clipboardData.getData(type);
            evt.preventDefault();
            self.pasteAtCursor(str);
        }
    }

    function setCursorXY(cursor, x, y) {
        changed = true;
        pointerX = x;
        pointerY = y;
        var lines = self.getLines();
        var cell = renderer.pixel2cell(x, y, scrollLeft, self.scrollTop,
                gridBounds.x);
        cursor.setXY(cell.x, cell.y, lines);
    }

    function mouseButtonDown(pointerEventSource, evt) {
        if (focused && evt.button === 0) {
            var bounds = pointerEventSource.getBoundingClientRect();
            self.startPointer(evt.clientX - bounds.left, evt.clientY -
                    bounds.top);
            evt.preventDefault();
        }
    }

    function mouseMove(pointerEventSource, evt) {
        if (focused) {
            var bounds = pointerEventSource.getBoundingClientRect();
            self.movePointer(evt.clientX - bounds.left, evt.clientY -
                    bounds.top);
        }
    }

    function mouseButtonUp(evt) {
        if (focused && evt.button === 0) {
            self.endPointer();
        }
    }

    function touchStart(pointerEventSource, evt) {
        if (focused && evt.touches.length > 0 && !dragging) {
            var t = evt.touches[0];
            var bounds = pointerEventSource.getBoundingClientRect();
            self.startPointer(t.clientX - bounds.left, t.clientY - bounds.top);
            currentTouchID = t.identifier;
        }
    }

    function touchMove(pointerEventSource, evt) {
        for (var i = 0; i < evt.changedTouches.length && dragging; ++i) {
            var t = evt.changedTouches[i];
            if (t.identifier === currentTouchID) {
                var bounds = pointerEventSource.getBoundingClientRect();
                self.movePointer(t.clientX - bounds.left, t.clientY -
                        bounds.top);
                break;
            }
        }
    }

    function touchEnd(evt) {
        for (var i = 0; i < evt.changedTouches.length && dragging; ++i) {
            var t = evt.changedTouches[i];
            if (t.identifier === currentTouchID) {
                self.endPointer();
            }
        }
    }

    function addCommandPack(cmd) {
        if (cmd) {
            for (var key in cmd) {
                if (cmd.hasOwnProperty(key)) {
                    var func = cmd[key];
                    if (!(func instanceof Function)) {
                        func = self.insertAtCursor.bind(self, func);
                    }
                    commandPack[key] = func;
                }
            }
        }
    }

    function refreshCommandPack() {
        if (keyboardSystem && operatingSystem && commandSystem) {
            commandPack = {};
        }
        addCommandPack(keyboardSystem);
        addCommandPack(operatingSystem);
        addCommandPack(browser);
        addCommandPack(commandSystem);
    }

    function makeCursorCommand(name) {
        var method = name.toLowerCase();
        self["cursor" + name] = function (lines, cursor) {
            changed = true;
            cursor[method](lines);
            self.scrollIntoView(cursor);
        };
    }


    //////////////////////////////////////////////////////////////////////////
    // public methods
    //////////////////////////////////////////////////////////////////////////
    ["Left", "Right",
        "SkipLeft", "SkipRight",
        "Up", "Down",
        "Home", "End",
        "FullHome", "FullEnd"].map(makeCursorCommand.bind(this));

    this.cursorPageUp = function (lines, cursor) {
        changed = true;
        cursor.incY(-gridBounds.height, lines);
        this.scrollIntoView(cursor);
    };

    this.cursorPageDown = function (lines, cursor) {
        changed = true;
        cursor.incY(gridBounds.height, lines);
        this.scrollIntoView(cursor);
    };

    this.focus = function () {
        focused = true;
        this.forceUpdate();
    };

    this.blur = function () {
        focused = false;
        this.forceUpdate();
    };

    this.isFocused = function () {
        return focused;
    };

    this.getRenderer = function () {
        return renderer;
    };

    this.setWordWrap = function (v) {
        wordWrap = v;
        this.forceUpdate();
    };

    this.getWordWrap = function () {
        return wordWrap;
    };

    this.setShowLineNumbers = function (v) {
        showLineNumbers = v;
        this.forceUpdate();
    };

    this.getShowLineNumbers = function () {
        return showLineNumbers;
    };

    this.setShowScrollBars = function (v) {
        showScrollBars = v;
        this.forceUpdate();
    };

    this.getShowScrollBars = function () {
        return showScrollBars;
    };

    this.setTheme = function (t) {
        theme = t || Themes.DEFAULT;
        renderer.setTheme(theme);
        changed = renderer.resize();
    };

    this.getTheme = function () {
        return theme;
    };

    this.setDeadKeyState = function (st) {
        changed = true;
        deadKeyState = st || "";
    };

    this.setOperatingSystem = function (os) {
        changed = true;
        operatingSystem = os || (isOSX ? OperatingSystems.OSX :
                OperatingSystems.WINDOWS);
        refreshCommandPack();
    };

    this.getOperatingSystem = function () {
        return operatingSystem;
    };

    this.setCommandSystem = function (cmd) {
        changed = true;
        commandSystem = cmd || Commands.DEFAULT;
        refreshCommandPack();
    };

    this.setSize = function (w, h) {
        changed = renderer.setSize(w, h);
    };

    this.getWidth = function () {
        return renderer.getWidth();
    };

    this.getHeight = function () {
        return renderer.getHeight();
    };

    this.forceUpdate = function () {
        changed = true;
        this.drawText();
    };

    this.setCodePage = function (cp) {
        changed = true;
        var key,
                code,
                lang = (navigator.languages && navigator.languages[0]) ||
                navigator.language ||
                navigator.userLanguage ||
                navigator.browserLanguage;

        if (!lang || lang === "en") {
            lang = "en-US";
        }

        codePage = cp;

        if (!codePage) {
            for (key in CodePages) {
                cp = CodePages[key];
                if (cp.language === lang) {
                    codePage = cp;
                    break;
                }
            }

            if (!codePage) {
                codePage = CodePages.EN_US;
            }
        }

        keyNames = [];
        for (key in Keys) {
            code = Keys[key];
            if (!isNaN(code)) {
                keyNames[code] = key;
            }
        }

        keyboardSystem = {};
        for (var type in codePage) {
            var codes = codePage[type];
            if (typeof (codes) === "object") {
                for (code in codes) {
                    var char,
                            name;
                    if (code.indexOf("_") > -1) {
                        var parts = code.split(' '),
                                browser = parts[0];
                        code = parts[1];
                        char = codePage.NORMAL[code];
                        name = browser + "_" + type + " " + char;
                    }
                    else {
                        char = codePage.NORMAL[code];
                        name = type + "_" + char;
                    }
                    keyNames[code] = char;
                    keyboardSystem[name] = codes[code];
                }
            }
        }

        refreshCommandPack();
    };

    this.getCodePage = function () {
        return codePage;
    };

    this.setTokenizer = function (tk) {
        changed = true;
        tokenizer = tk || Grammar.JavaScript;
        if (history && history.length > 0) {
            refreshTokens();
            if (this.drawText) {
                this.drawText();
            }
        }
    };

    this.getTokenizer = function () {
        return tokenizer;
    };

    this.getLines = function () {
        return history[historyFrame].slice();
    };

    this.pushUndo = function (lines) {
        if (historyFrame < history.length - 1) {
            history.splice(historyFrame + 1);
        }
        history.push(lines);
        historyFrame = history.length - 1;
        refreshTokens();
        this.forceUpdate();
    };

    this.redo = function () {
        changed = true;
        if (historyFrame < history.length - 1) {
            ++historyFrame;
        }
        refreshTokens();
    };

    this.undo = function () {
        changed = true;
        if (historyFrame > 0) {
            --historyFrame;
        }
        refreshTokens();
    };

    this.setTabWidth = function (tw) {
        tabWidth = tw || 4;
        tabString = "";
        for (var i = 0; i < tabWidth; ++i) {
            tabString += " ";
        }
    };

    this.getTabWidth = function () {
        return tabWidth;
    };

    this.getTabString = function () {
        return tabString;
    };

    this.scrollIntoView = function (currentCursor) {
        this.scrollTop += minDelta(currentCursor.y, this.scrollTop,
                this.scrollTop + gridBounds.height);
        scrollLeft += minDelta(currentCursor.x, scrollLeft, scrollLeft +
                gridBounds.width);
        clampScroll();
    };

    this.increaseFontSize = function () {
        ++theme.fontSize;
        renderer.resize();
    };

    this.decreaseFontSize = function () {
        if (theme.fontSize > 1) {
            --theme.fontSize;
            renderer.resize();
        }
    };

    this.getText = function () {
        return this.getLines()
                .join(
                        "\n");
    };

    this.setText = function (txt) {
        txt = txt || "";
        txt = txt.replace(/\r\n/g, "\n");
        var lines = txt.split("\n");
        this.pushUndo(lines);
        if (this.drawText) {
            this.drawText();
        }
    };

    this.getPixelRatio = function () {
        return window.devicePixelRatio || 1;
    };

    this.cell2i = function (x, y) {
        var dy,
                lines =
                this.getLines(),
                i = 0;
        for (dy = 0; dy < y; ++dy) {
            i += lines[dy].length + 1;
        }
        i += x;
        return i;
    };

    this.i2cell = function (i) {
        var lines = this.getLines();
        for (var y = 0; y < lines.length; ++y) {
            if (i <= lines.length) {
                return {x: i, y: y};
            }
            else {
                i -= lines.length - 1;
            }
        }
    };

    this.deleteSelection = function () {
        if (this.frontCursor.i !== this.backCursor.i) {
            // TODO: don't rejoin the string first.
            var minCursor = Cursor.min(this.frontCursor, this.backCursor),
                    maxCursor = Cursor.max(this.frontCursor, this.backCursor),
                    lines = this.getLines(),
                    text = lines.join("\n"),
                    left = text.substring(0, minCursor.i),
                    right = text.substring(maxCursor.i);
            maxCursor.copy(minCursor);
            this.setText(left + right);
            clampScroll();
        }
    };

    this.readWheel = function (evt) {
        if (focused) {
            this.scrollTop += Math.floor(evt.deltaY /
                    renderer.characterHeight);
            clampScroll();
            evt.preventDefault();
            this.forceUpdate();
        }
    };

    this.startPicking = function (gl, x, y) {
        var p = renderer.getPixelIndex(gl, x, y);
        this.startPointer(p.x, p.y);
    };

    this.movePicking = function (gl, x, y) {
        var p = renderer.getPixelIndex(gl, x, y);
        this.movePointer(p.x, p.y);
    };

    this.startPointer = function (x, y) {
        setCursorXY(this.frontCursor, x, y);
        this.backCursor.copy(this.frontCursor);
        dragging = true;
        this.drawText();
    };

    this.movePointer = function (x, y) {
        if (dragging) {
            setCursorXY(this.backCursor, x, y);
            this.drawText();
        }
    };

    this.endPointer = function () {
        dragging = false;
        surrogate.focus();
    };

    this.bindEvents = function (keyEventSource, pointerEventSource) {
        if (keyEventSource) {
            keyEventSource.addEventListener("keydown", this.editText.bind(
                    this));
        }

        if (pointerEventSource) {
            pointerEventSource.addEventListener("wheel", this.readWheel.bind(
                    this));
            pointerEventSource.addEventListener("mousedown",
                    mouseButtonDown.bind(this, pointerEventSource));
            pointerEventSource.addEventListener("mousemove", mouseMove.bind(
                    this, pointerEventSource));
            pointerEventSource.addEventListener("mouseup", mouseButtonUp.bind(
                    this));
            pointerEventSource.addEventListener("touchstart", touchStart.bind(
                    this, pointerEventSource));
            pointerEventSource.addEventListener("touchmove", touchMove.bind(
                    this, pointerEventSource));
            pointerEventSource.addEventListener("touchend", touchEnd.bind(
                    this));
        }
    };

    this.insertAtCursor = function (str) {
        if (str.length > 0) {
            str = str.replace(/\r\n/g, "\n");
            this.deleteSelection();
            var lines = this.getLines();
            var parts = str.split("\n");
            parts[0] = lines[this.frontCursor.y].substring(0,
                    this.frontCursor.x) + parts[0];
            parts[parts.length - 1] += lines[this.frontCursor.y].substring(
                    this.frontCursor.x);
            lines.splice.bind(lines, this.frontCursor.y, 1)
                    .apply(
                            lines,
                            parts);
            for (var i = 0; i < str.length; ++i) {
                this.frontCursor.right(lines);
            }
            this.backCursor.copy(this.frontCursor);
            this.scrollIntoView(this.frontCursor);
            this.pushUndo(lines);
        }
    };

    this.pasteAtCursor = function (str) {
        this.insertAtCursor(str);
        this.drawText();
    };

    this.copySelectedText = function (evt) {
        if (this.frontCursor.i !== this.backCursor.i) {
            var minCursor = Cursor.min(this.frontCursor, this.backCursor),
                    maxCursor = Cursor.max(this.frontCursor, this.backCursor),
                    lines = this.getLines(),
                    text = lines.join("\n"),
                    str = text.substring(minCursor.i, maxCursor.i);
            evt.clipboardData.setData("text/plain", str);
        }
        evt.preventDefault();
    };

    this.cutSelectedText = function (evt) {
        this.copySelectedText(evt);
        this.deleteSelection();
        this.drawText();
    };

    this.placeSurrogateUnder = function (elem) {
        if (surrogate && elem) {
            // wait a brief amount of time to make sure the browser rendering 
            // engine had time to catch up
            setTimeout(function () {
                var bounds = elem.getBoundingClientRect();
                surrogate.style.left = bounds.left + "px";
                surrogate.style.top = window.scrollY + bounds.top + "px";
                surrogate.style.width = (bounds.right - bounds.left) + "px";
                surrogate.style.height = (bounds.bottom - bounds.top) + "px";
            }, 250);
        }
    };

    this.editText = function (evt) {
        evt = evt || event;

        var key = evt.keyCode;
        if (key !== Keys.CTRL && key !== Keys.ALT && key !== Keys.META_L &&
                key !== Keys.META_R && key !== Keys.SHIFT) {
            var oldDeadKeyState = deadKeyState;

            var commandName = deadKeyState;

            if (evt.ctrlKey) {
                commandName += "CTRL";
            }
            if (evt.altKey) {
                commandName += "ALT";
            }
            if (evt.metaKey) {
                commandName += "META";
            }
            if (evt.shiftKey) {
                commandName += "SHIFT";
            }
            if (commandName === deadKeyState) {
                commandName += "NORMAL";
            }

            commandName += "_" + keyNames[key];

            var func = commandPack[browser + "_" + commandName] ||
                    commandPack[commandName];
            if (func) {
                this.frontCursor.moved = false;
                this.backCursor.moved = false;
                var lines = this.getLines();
                func(self, lines);
                lines = this.getLines();
                if (this.frontCursor.moved && !this.backCursor.moved) {
                    this.backCursor.copy(this.frontCursor);
                }
                this.frontCursor.rectify(lines);
                this.backCursor.rectify(lines);
                evt.preventDefault();
            }

            if (deadKeyState === oldDeadKeyState) {
                deadKeyState = "";
            }
        }
        this.drawText();
    };

    this.drawText = function () {
        if (changed && theme && tokens) {
            var t,
                    i;

            this.lineCount = 1;

            for (i = 0; i < tokens.length; ++i) {
                if (tokens[i].type === "newlines") {
                    ++this.lineCount;
                }
            }

            if (showLineNumbers) {
                lineCountWidth = Math.max(1, Math.ceil(Math.log(
                        this.lineCount) / Math.LN10));
                leftGutterWidth = 1;
            }
            else {
                lineCountWidth = 0;
                leftGutterWidth = 0;
            }

            if (showScrollBars) {
                rightGutterWidth = 1;
                bottomGutterHeight = 1;
            }
            else {
                rightGutterWidth = 0;
                bottomGutterHeight = 0;
            }

            gridBounds.x = leftGutterWidth + lineCountWidth;

            gridBounds.width = Math.floor(this.getWidth() /
                    renderer.characterWidth) - gridBounds.x - rightGutterWidth;

            gridBounds.height = Math.floor(this.getHeight() /
                    renderer.characterHeight) - bottomGutterHeight;

            // group the tokens into rows
            var currentRow = [],
                    rowX = 0;
            tokenRows = [currentRow];
            for (i = 0; i < tokens.length; ++i) {
                t = tokens[i].clone();
                currentRow.push(t);
                rowX += t.value.length;
                if (wordWrap && rowX >= gridBounds.width || t.type ===
                        "newlines") {
                    currentRow = [];
                    tokenRows.push(currentRow);
                    if (wordWrap && rowX >= gridBounds.width && t.type !==
                            "newlines") {
                        currentRow.push(t.splitAt(gridBounds.width - (rowX -
                                t.value.length)));
                    }
                    rowX = 0;
                }
            }

            renderer.render(
                    tokenRows,
                    this.frontCursor, this.backCursor,
                    gridBounds.x, gridBounds.y, gridBounds.width,
                    gridBounds.height,
                    scrollLeft, this.scrollTop,
                    focused, showLineNumbers, showScrollBars,
                    lineCountWidth,
                    leftGutterWidth, topGutterHeight, rightGutterWidth,
                    bottomGutterHeight);

            changed = false;
        }
    };

    //////////////////////////////////////////////////////////////////////////
    // initialization
    /////////////////////////////////////////////////////////////////////////
    browser = isChrome ? "CHROMIUM" : (isFirefox ? "FIREFOX" : (isIE ? "IE" :
            (isOpera ? "OPERA" : (isSafari ? "SAFARI" : "UNKNOWN"))));

    // the `surrogate` textarea makes the soft-keyboard appear on mobile devices.
    surrogate.style.position = "absolute";
    surrogateContainer = makeHidingContainer(
            "primrose-surrogate-textarea-container-" + renderer.id, surrogate);

    document.body.appendChild(surrogateContainer);

    this.setWordWrap(!!options.wordWrap);
    this.setShowLineNumbers(!options.hideLineNumbers);
    this.setShowScrollBars(!options.hideScrollBars);
    this.setTabWidth(options.tabWidth);
    this.setTheme(options.theme);
    this.setTokenizer(options.tokenizer);
    this.setCodePage(options.codePage);
    this.setOperatingSystem(options.os);
    this.setCommandSystem(options.commands);
    this.setText(options.file);
    this.bindEvents(options.keyEventSource, options.pointerEventSource);

    this.themeSelect = makeSelectorFromObj("primrose-theme-selector-" +
            renderer.id, Themes, theme.name, self, "setTheme", "theme");
    this.tokenizerSelect = makeSelectorFromObj("primrose-tokenizer-selector-" +
            renderer.id, Grammar, tokenizer.name, self, "setTokenizer",
            "language syntax");
    this.keyboardSelect = makeSelectorFromObj("primrose-keyboard-selector-" +
            renderer.id, CodePages, codePage.name, self, "setCodePage",
            "localization");
    this.commandSystemSelect = makeSelectorFromObj(
            "primrose-command-system-selector-" + renderer.id, Commands,
            commandSystem.name, self, "setCommandSystem", "command system");
    this.operatingSystemSelect = makeSelectorFromObj(
            "primrose-operating-system-selector-" + renderer.id,
            OperatingSystems, operatingSystem.name, self, "setOperatingSystem",
            "shortcut style");


    //////////////////////////////////////////////////////////////////////////
    // wire up event handlers
    //////////////////////////////////////////////////////////////////////////

    window.addEventListener("resize", renderer.resize.bind(renderer));

    surrogate.addEventListener("copy", this.copySelectedText.bind(this));
    surrogate.addEventListener("cut", this.cutSelectedText.bind(this));
    surrogate.addEventListener("paste", readClipboard.bind(this));
}