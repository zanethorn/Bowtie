let Bowtie = (function (Bowtie) {

    /* Global Constants */
    const CHARACTER_TYPES = {

    };

    const CHARACTER_MAP = {
        "a": CharacterType.Letter,
        "b": CharacterType.Letter,
        "c": CharacterType.Letter,
        "d": CharacterType.Letter,
        "e": CharacterType.Letter,
        "f": CharacterType.Letter,
        "g": CharacterType.Letter,
        "h": CharacterType.Letter,
        "i": CharacterType.Letter,
        "j": CharacterType.Letter,
        "k": CharacterType.Letter,
        "l": CharacterType.Letter,
        "m": CharacterType.Letter,
        "n": CharacterType.Letter,
        "o": CharacterType.Letter,
        "p": CharacterType.Letter,
        "q": CharacterType.Letter,
        "r": CharacterType.Letter,
        "s": CharacterType.Letter,
        "t": CharacterType.Letter,
        "u": CharacterType.Letter,
        "v": CharacterType.Letter,
        "w": CharacterType.Letter,
        "x": CharacterType.Letter,
        "y": CharacterType.Letter,
        "z": CharacterType.Letter,
        "A": CharacterType.Letter,
        "B": CharacterType.Letter,
        "C": CharacterType.Letter,
        "D": CharacterType.Letter,
        "E": CharacterType.Letter,
        "F": CharacterType.Letter,
        "G": CharacterType.Letter,
        "H": CharacterType.Letter,
        "I": CharacterType.Letter,
        "J": CharacterType.Letter,
        "K": CharacterType.Letter,
        "L": CharacterType.Letter,
        "M": CharacterType.Letter,
        "N": CharacterType.Letter,
        "O": CharacterType.Letter,
        "P": CharacterType.Letter,
        "Q": CharacterType.Letter,
        "R": CharacterType.Letter,
        "S": CharacterType.Letter,
        "T": CharacterType.Letter,
        "U": CharacterType.Letter,
        "V": CharacterType.Letter,
        "W": CharacterType.Letter,
        "X": CharacterType.Letter,
        "Y": CharacterType.Letter,
        "Z": CharacterType.Letter,
        "1": CharacterType.Number,
        "2": CharacterType.Number,
        "3": CharacterType.Number,
        "4": CharacterType.Number,
        "5": CharacterType.Number,
        "6": CharacterType.Number,
        "7": CharacterType.Number,
        "8": CharacterType.Number,
        "9": CharacterType.Number,
        "0": CharacterType.Number,
        " ": CharacterType.WhiteSpace,
        "\t": CharacterType.WhiteSpace,
        "\n": CharacterType.WhiteSpace,
        "\r": CharacterType.WhiteSpace,
        ".": CharacterType.Period,
        "(": CharacterType.OpenParen,
        ")": CharacterType.CloseParen,
        "[": CharacterType.OpenBracket,
        "]": CharacterType.CloseBracket,
        ",": CharacterType.Comma,
        "'": CharacterType.Quote,
        "\"": CharacterType.DoubleQuote,
        "-": CharacterType.Operator,
        "+": CharacterType.Operator,
        "/": CharacterType.Operator,
        "*": CharacterType.Operator,
        "^": CharacterType.Operator,
        "&": CharacterType.Operator,
        "|": CharacterType.Operator,
        "!": CharacterType.Operator,
    };

    /* Global Private Fields */
    let _binders = new Array();


    /* Global Private Functions */

    /**
     * Parses a string into a chain of tokens
     * @param {} input 
     */
    function _parseTokenString(input) {

    }

    function _bindInternal(context, element) {
        let contextAttr = element.getAttribute("data-context");
        if (contextAttr) {
            context = context.getContext(element, contextAttr);
        }
        let attributeNames = [];
        for (let name of attributeNames) {
            if (name.startsWith("data-bind-")) {
                var value = element.getAttribute(name);
            }
        }
        for (let child of element.childNodes) {
            if (child instanceof Element) {
                _bindInternal(context, child);
            }
        }
    }

    /* Private Classes */

    /**
     * Represents 
     */
    class Token {
        constructor(type, value) {
            this.type = type;
            this.value = value;
            this.next = null;
        }
    }
    class DataContext {
        constructor(data, element, token, parent) {
            if (!parent) {
                parent = this;
            }
            this._data = data;
            this._element = element;
            this._parent = parent;
            this._token = token;
        }
        get data() {
            return this._data;
        }
        get element() {
            return this._element;
        }
        get parent() {
            return this._parent;
        }
        get token() {
            return this._token;
        }
        get root() {
            if (this._parent === this) {
                return this;
            }
            return this._parent.root;
        }
        getContext(element, path) {
            if (!path) {
                return this;
            }
            let segments = path.split(".");
            let token = segments[0];
            let remainder = null;
            if (segments.length > 1) {
                remainder = segments.slice(1).join(".");
            }
            if (token === "") {
                return this.root.getContext(element, remainder);
            }
            let data = new Bowtie.Observable(this.data.getValue(token));
            let ctx = new DataContext(data, element, token, this);
            if (remainder) {
                return ctx.getContext(element, remainder);
            }
            return ctx;
        }
    }

    /* Public Functions */

    /**
     *  Returns the list of currently registered binders
     */
    function binders() {
        return _binders.slice();
    }

    /** 
     * Main Entry point.  Binds data to the HTML
     */
    function tie(data) {
        let observableData = new Bowtie.Observable(data);
        let body = document.body;
        let context = new Bowtie.DataContext(observableData, body, null);
        bindInternal(context, body);
    }

    /* Public Classes */

    /** 
     *  Represents an object that notifies when data has been changed.
     */
    class Observable {
        constructor(state) {
            this._eventListeners = {};
            if (state instanceof Observable) {
                return state;
            }
            if (!state) {
                state = {};
            }
            this._state = state;
        }
        get state() {
            return this._state;
        }
        getValue(key) {
            return this._state[key];
        }
        setValue(key, value) {
            if (this._state[key] !== value) {
                let previousValue = this._state[key];
                this._state[key] = value;
                this.dispatchEvent(new CustomEvent("changed", {
                    detail: {
                        propertyName: key,
                        previousValue: previousValue,
                        newValue: value
                    }
                }));
            }
        }
        addEventListener(type, listener, options) {
            if (!(type in this._eventListeners)) {
                this._eventListeners[type] = [];
            }
            this._eventListeners[type].push(listener);
        }
        dispatchEvent(evt) {
            if (!(event.type in this._eventListeners)) {
                return true;
            }
            var stack = this._eventListeners[event.type].slice();
            for (var i = 0, l = stack.length; i < l; i++) {
                stack[i].call(this, event);
            }
            return !event.defaultPrevented;
        }
        removeEventListener(type, listener, options) {
            if (!(type in this._eventListeners)) {
                return;
            }
            var stack = this._eventListeners[type];
            for (var i = 0, l = stack.length; i < l; i++) {
                if (stack[i] === listener) {
                    stack.splice(i, 1);
                    return;
                }
            }
        }
    } /* class Observable */

    /* Export Public Bowtie Properties */
    Bowtie.binders = binders;
    Bowtie.tie = tie;

    Bowtie.Observable = Observable;
})(Bowtie || (Bowtie = {}));