let Bowtie;
(function (Bowtie) {

    /* Global Constants */
    const CHARACTER_TYPES = {
        NONE: 0,
        LETTER: 1,
        NUMBER: 2,
        WHITE_SPACE: 3,
        OPEN_PAREN: 4,
        CLOSE_PAREN: 5,
        OPEN_BRACKET: 6,
        CLOSE_BRACKET: 7,
        PERIOD: 8,
        COMMA: 9,
        QUOTE: 10,
        OPERATOR: 11,
        UNKNOWN: 99,
    };

    const CHARACTER_MAP = {
        "a": CHARACTER_TYPES.LETTER,
        "b": CHARACTER_TYPES.LETTER,
        "c": CHARACTER_TYPES.LETTER,
        "d": CHARACTER_TYPES.LETTER,
        "e": CHARACTER_TYPES.LETTER,
        "f": CHARACTER_TYPES.LETTER,
        "g": CHARACTER_TYPES.LETTER,
        "h": CHARACTER_TYPES.LETTER,
        "i": CHARACTER_TYPES.LETTER,
        "j": CHARACTER_TYPES.LETTER,
        "k": CHARACTER_TYPES.LETTER,
        "l": CHARACTER_TYPES.LETTER,
        "m": CHARACTER_TYPES.LETTER,
        "n": CHARACTER_TYPES.LETTER,
        "o": CHARACTER_TYPES.LETTER,
        "p": CHARACTER_TYPES.LETTER,
        "q": CHARACTER_TYPES.LETTER,
        "r": CHARACTER_TYPES.LETTER,
        "s": CHARACTER_TYPES.LETTER,
        "t": CHARACTER_TYPES.LETTER,
        "u": CHARACTER_TYPES.LETTER,
        "v": CHARACTER_TYPES.LETTER,
        "w": CHARACTER_TYPES.LETTER,
        "x": CHARACTER_TYPES.LETTER,
        "y": CHARACTER_TYPES.LETTER,
        "z": CHARACTER_TYPES.LETTER,
        "A": CHARACTER_TYPES.LETTER,
        "B": CHARACTER_TYPES.LETTER,
        "C": CHARACTER_TYPES.LETTER,
        "D": CHARACTER_TYPES.LETTER,
        "E": CHARACTER_TYPES.LETTER,
        "F": CHARACTER_TYPES.LETTER,
        "G": CHARACTER_TYPES.LETTER,
        "H": CHARACTER_TYPES.LETTER,
        "I": CHARACTER_TYPES.LETTER,
        "J": CHARACTER_TYPES.LETTER,
        "K": CHARACTER_TYPES.LETTER,
        "L": CHARACTER_TYPES.LETTER,
        "M": CHARACTER_TYPES.LETTER,
        "N": CHARACTER_TYPES.LETTER,
        "O": CHARACTER_TYPES.LETTER,
        "P": CHARACTER_TYPES.LETTER,
        "Q": CHARACTER_TYPES.LETTER,
        "R": CHARACTER_TYPES.LETTER,
        "S": CHARACTER_TYPES.LETTER,
        "T": CHARACTER_TYPES.LETTER,
        "U": CHARACTER_TYPES.LETTER,
        "V": CHARACTER_TYPES.LETTER,
        "W": CHARACTER_TYPES.LETTER,
        "X": CHARACTER_TYPES.LETTER,
        "Y": CHARACTER_TYPES.LETTER,
        "Z": CHARACTER_TYPES.LETTER,
        "1": CHARACTER_TYPES.NUMBER,
        "2": CHARACTER_TYPES.NUMBER,
        "3": CHARACTER_TYPES.NUMBER,
        "4": CHARACTER_TYPES.NUMBER,
        "5": CHARACTER_TYPES.NUMBER,
        "6": CHARACTER_TYPES.NUMBER,
        "7": CHARACTER_TYPES.NUMBER,
        "8": CHARACTER_TYPES.NUMBER,
        "9": CHARACTER_TYPES.NUMBER,
        "0": CHARACTER_TYPES.NUMBER,
        " ": CHARACTER_TYPES.WHITE_SPACE,
        "\t": CHARACTER_TYPES.WHITE_SPACE,
        "\n": CHARACTER_TYPES.WHITE_SPACE,
        "\r": CHARACTER_TYPES.WHITE_SPACE,
        ".": CHARACTER_TYPES.PERIOD,
        "(": CHARACTER_TYPES.OPEN_PAREN,
        ")": CHARACTER_TYPES.CLOSE_PAREN,
        "[": CHARACTER_TYPES.OPEN_BRACKET,
        "]": CHARACTER_TYPES.CLOSE_BRACKET,
        ",": CHARACTER_TYPES.COMMA,
        "'": CHARACTER_TYPES.QUOTE,
        "-": CHARACTER_TYPES.OPERATOR,
        "+": CHARACTER_TYPES.OPERATOR,
        "/": CHARACTER_TYPES.OPERATOR,
        "*": CHARACTER_TYPES.OPERATOR,
        "^": CHARACTER_TYPES.OPERATOR,
        "&": CHARACTER_TYPES.OPERATOR,
        "|": CHARACTER_TYPES.OPERATOR,
        "!": CHARACTER_TYPES.OPERATOR,
    };

    const WORD_TYPES = {
        NONE: 0,
        NUMBER: 1,
        STRING: 2,
        TRUE: 3,
        FALSE: 4,
        NULL: 5,
        LOOKUP: 6,
    };

    const BINDER_TYPES = {
        NONE: 0,
        LITERAL: 1,
        MEMBER: 2,
        GROUP: 3,

    }

    /* Global Private Fields */


    /* Global Private Functions */



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
    class Binder {
        constructor(type) {
            this._type = type;
        }

        bind(element, attribute) {
            throw Error("Binding Error: Method is Abstract.");
        }

        get isTwoWay() {
            return false;
        }

        get isDynamic() {
            return false;
        }

        get type() {
            return this._type;
        }
    }

    class LiteralBinder extends Binder {
        constructor(value) {
            super(BINDER_TYPES.LITERAL);
            this._value = value;
        }

        bind(element, attribute) {
            element.setAttribute(attribute.value);
        }

        get value() {
            return this._value;
        }
    }

    /**
     * Represents 
     */
    class Token {
        constructor(type, value) {
            this.type = type;
            this.value = value;
            this.next = null;
            this.prev = null;
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
     * Parses a string into a chain of tokens
     * @param {} input 
     */
    function parseTokenString(input) {
        let tokenStart = 0;
        let ix = 0;
        let lastCharType = CHARACTER_TYPES.NONE;
        let wordType = WORD_TYPES.NONE;
        let firstToken = null;
        let lastToken = null;
        let numberHasPeriod = false;

        let testToken = (charType) => {
            let handler = handlers[wordType];
            let emmitToken = handler(charType);

            if (emmitToken) {
                createToken();
            }
        };

        let createToken = () => {
            let word = input.slice(tokenStart, ix);
            if (word === "true") {
                wordType = WORD_TYPES.TRUE;
            }
            else if (word === "false") {
                wordType = WORD_TYPES.FALSE;
            }
            else if (word === "null") {
                wordType = WORD_TYPES.NULL;
            }

            let token = new Token(wordType, word);

            if (firstToken === null) {
                firstToken = token;
            }
            else {
                token.prev = token;
                lastToken.next = token;
            }

            lastToken = token;
            tokenStart = ix
            wordType = WORD_TYPES.NONE;
        }

        let startNumber = () => {
            numberHasPeriod = false;
            wordType = WORD_TYPES.NUMBER;
            return false;
        }

        let handleNone = (charType) => {
            switch (charType) {
                case CHARACTER_TYPES.NONE:
                    wordType = WORD_TYPES.NONE;
                    break;
                case CHARACTER_TYPES.LETTER:
                    wordType = WORD_TYPES.LOOKUP;
                    break;
                case CHARACTER_TYPES.NUMBER:
                    return startNumber();
                case CHARACTER_TYPES.WHITE_SPACE:
                    wordType = WORD_TYPES.NONE;
                    tokenStart += 1;
                    break;
                case CHARACTER_TYPES.OPEN_PAREN:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.CLOSE_PAREN:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.OPEN_BRACKET:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.CLOSE_BRACKET:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.PERIOD:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.COMMA:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.QUOTE:
                    wordType = WORD_TYPES.STRING;
                    tokenStart += 1;
                    break;
                case CHARACTER_TYPES.OPERATOR:
                    throw new Error("Not Implemented");
                    break;
                default:
                    throw new Error(`Unknown Character type ${charType}`);
            }
            return false;
        };

        let handleNumber = (charType) => {
            switch (charType) {
                case CHARACTER_TYPES.NONE:
                    return true; /* string has ended */
                case CHARACTER_TYPES.LETTER:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.NUMBER:
                    return false; /* Continuing to build number */
                case CHARACTER_TYPES.WHITE_SPACE:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.OPEN_PAREN:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.CLOSE_PAREN:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.OPEN_BRACKET:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.CLOSE_BRACKET:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.PERIOD:
                    if (numberHasPeriod) {
                        throw new Error(`Parser Error: Invalid duplicate period in number at index ${ix}`);
                    }
                    numberHasPeriod = true;
                    return false; /* Continuing to build number */
                case CHARACTER_TYPES.COMMA:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.QUOTE:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.OPERATOR:
                    throw new Error("Not Implemented");
                    break;
                default:
                    throw new Error(`Unknown Character type ${charType}`);
            }
        };

        let handleString = (charType) => {
            if (charType === CHARACTER_TYPES.QUOTE) {
                return true;
            }
            else if (charType === CHARACTER_TYPES.NONE) {
                throw new Error("Parser Error: Unterminated string literal.")
            }
            return false;
        }

        let handleLookup = (charType) => {
            switch (charType) {
                case CHARACTER_TYPES.LETTER:
                case CHARACTER_TYPES.NUMBER:
                    return false; /* Keep building word */
                case CHARACTER_TYPES.NONE:
                case CHARACTER_TYPES.WHITE_SPACE:
                case CHARACTER_TYPES.PERIOD:
                case CHARACTER_TYPES.COMMA:
                    return true; /* word ends */
                case CHARACTER_TYPES.OPEN_PAREN:
                    throw new Error("Not Implemented");
                case CHARACTER_TYPES.CLOSE_BRACKET:
                case CHARACTER_TYPES.CLOSE_PAREN:
                case CHARACTER_TYPES.UNKNOWN:
                    throw new Error(`Parser Error: Invalid character at index ${ix}`);
                case CHARACTER_TYPES.OPEN_BRACKET:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.QUOTE:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.OPERATOR:
                    throw new Error("Not Implemented");
                    break;
                default:
                    throw new Error(`Unknown Character type ${charType}`);
            }
            return false;
        }

        let handleTrue = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        }

        let handleFalse = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handleNull = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handlers = [
            handleNone,
            handleNumber,
            handleString,
            handleTrue,
            handleFalse,
            handleNull,
            handleLookup,
        ];

        while (ix < input.length) {
            let char = input[ix];
            let charType = CHARACTER_MAP[char];

            if (charType === undefined) {
                charType = CHARACTER_TYPES.UNKNOWN;
            }

            testToken(charType);

            lastCharType = charType;
            ix += 1;
        }

        charType = CHARACTER_TYPES.NONE;
        testToken(charType);

        return firstToken;
    }

    /**
     * Return binding object for a specific token
     * @param {Token} token 
     */
    function createBinder(token) {

        let currentToken = token;
        let currentBinder = null;

        let handleNone = (token) => {
            throw new Error("Binding Error: None Word type passed into binder.");
        }

        let handleNumber = (token) => {
            return new LiteralBinder(parseFloat(token.value));
        }

        let handleString = (token) => {
            return new LiteralBinder(token.value);
        }

        let handleTrue = (token) => {
            return new LiteralBinder(true);
        }

        let handleFalse = (token) => {
            return new LiteralBinder(false);
        }

        let handleNull = (token) => {
            return new LiteralBinder(null);
        }

        let handleLookup = (token) => {
            throw new Error("Not Implemented!")
        }

        let handlers = [
            handleNone,
            handleNumber,
            handleString,
            handleTrue,
            handleFalse,
            handleNull,
            handleLookup,
        ];

        while (currentToken !== null) {
            let handler = handlers[currentToken.type];

            if (handler === undefined) {
                throw new Error(`Binding Error: Unknown handler type for token type ${currentToken.type}`)
            }

            currentBinder = handler(currentToken);
            currentToken = currentToken.next;
        }

        return currentBinder;
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
    Bowtie.BINDER_TYPES = BINDER_TYPES;
    Bowtie.WORD_TYPES = WORD_TYPES;

    Bowtie.tie = tie;
    Bowtie.parseTokenString = parseTokenString;
    Bowtie.createBinder = createBinder;

    Bowtie.Observable = Observable;
})(Bowtie || (Bowtie = {}));

if (module.exports !== undefined) {
    module.exports = Bowtie
}