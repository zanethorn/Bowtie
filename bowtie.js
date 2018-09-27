var window = (window || {});
var module = (module || undefined);

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

    /* Public Classes */

    class Binder {
        constructor(type, value) {
            this._type = type;
            this._value = value;
        }

        bind(source, target, targetAttribute) {
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

        get value() {
            return this._value;
        }
    }

    class LiteralBinder extends Binder {
        constructor(value) {
            super(BINDER_TYPES.LITERAL, value);
        }

        bind(source, target, targetAttribute) {
            target.setAttribute(targetAttribute, this.value);
        }
    }

    class LookupBinder extends Binder {
        constructor(value) {
            super(BINDER_TYPES.LOOKUP, value);
            this._isTwoWay = true;
        }

        get isTwoWay() {
            return this._isTwoWay;
        }

        get isDynamic() {
            return true;
        }

        bind(source, target, targetAttribute) {
            source.addEventListener("changed", (ev) => {
                target.setAttribute(targetAttribute, source.getAttribute(this.value))
            });

            if (target instanceof Observable) {
                target.addEventListener("changed", (ev) => {
                    source.setAttribute(this.value, target.getAttribute(targetAttribute));
                });
            }
            else if (window.MutationObserver !== undefined) {
                let targetObserver = new window.MutationObserver((mutations) => {
                    for (let mutation of mutations) {
                        if (mutation.type === 'attributes' && mutation.attributeName === targetAttribute) {
                            source.setAttribute(this.value, target.getAttribute(targetAttribute));
                        }
                    }
                });
                targetObserver.observe(target, { attributes: true });
            }
            else {
                this._isTwoWay = false;
            }

            target.setAttribute(targetAttribute, source.getAttribute(this.value))
        }
    }

    /**
     * Represents a completely parsed segment of an attribute binder
     */
    class Word {
        constructor(type, value) {
            this.type = type;
            this.value = value;
            this.next = null;
            this.prev = null;
        }
    }

    /** 
     *  Represents an object that notifies when data has been changed.
     */
    class Observable {
        constructor(state) {
            if (!state) {
                state = {};
            }

            if (state instanceof Observable) {
                return state;
            }

            this._eventListeners = {};
            this._state = state;
        }
        get state() {
            return this._state;
        }
        getAttribute(key) {
            return this._state[key];
        }
        setAttribute(key, value) {
            if (this._state[key] !== value) {
                let previousValue = this._state[key];
                this._state[key] = value;
                this.dispatchEvent({
                    type: "changed",
                    propertyName: key,
                    previousValue: previousValue,
                    newValue: value
                });
            }
        }
        addEventListener(type, listener, options) {
            if (!(type in this._eventListeners)) {
                this._eventListeners[type] = [];
            }
            this._eventListeners[type].push(listener);
        }
        dispatchEvent(event) {
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

    class DataContext extends Observable {
        constructor(data, element, parent) {
            if (!parent) {
                parent = this;
            }
            this._data = data;
            this._element = element;
            this._parent = parent;
            this._token = token;
        }
        get element() {
            return this._element;
        }
        get parent() {
            return this._parent;
        }

        get root() {
            if (this._parent === this) {
                return this;
            }
            return this._parent.root;
        }
    }

    /* Global Private Functions */




    /* Public Functions */

    /**
     * Parses a string into a chain of tokens
     * @param {} input 
     */
    function parseTokenString(input) {
        let tokenWord = 0;
        let ix = 0;
        let lastCharType = CHARACTER_TYPES.NONE;
        let wordType = WORD_TYPES.NONE;
        let firstWord = null;
        let lastWord = null;
        let numberHasPeriod = false;

        let testWord = (charType) => {
            let handler = handlers[wordType];
            let emmitToken = handler(charType);

            if (emmitToken) {
                createWord();
            }
        };

        let createWord = () => {
            let value = input.slice(tokenWord, ix);
            if (value === "true") {
                wordType = WORD_TYPES.TRUE;
            }
            else if (value === "false") {
                wordType = WORD_TYPES.FALSE;
            }
            else if (value === "null") {
                wordType = WORD_TYPES.NULL;
            }

            let word = new Word(wordType, value);

            if (firstWord === null) {
                firstWord = word;
            }
            else {
                word.prev = word;
                lastWord.next = word;
            }

            lastWord = word;
            tokenWord = ix
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
                    tokenWord += 1;
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
                    tokenWord += 1;
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

            testWord(charType);

            lastCharType = charType;
            ix += 1;
        }

        charType = CHARACTER_TYPES.NONE;
        testWord(charType);

        return firstWord;
    }

    /**
     * Return binding object for a specific token
     * @param {Word} firstWord 
     */
    function createBinder(firstWord) {

        let currentWord = firstWord;
        let currentBinder = null;

        let handleNone = (word) => {
            throw new Error("Binding Error: None Word type passed into binder.");
        }

        let handleNumber = (word) => {
            return new LiteralBinder(parseFloat(word.value));
        }

        let handleString = (word) => {
            return new LiteralBinder(word.value);
        }

        let handleTrue = (word) => {
            return new LiteralBinder(true);
        }

        let handleFalse = (word) => {
            return new LiteralBinder(false);
        }

        let handleNull = (word) => {
            return new LiteralBinder(null);
        }

        let handleLookup = (word) => {
            return new LookupBinder(word.value);
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

        while (currentWord !== null) {
            let handler = handlers[currentWord.type];

            if (handler === undefined) {
                throw new Error(`Binding Error: Unknown handler type for token type ${currentWord.type}`)
            }

            currentBinder = handler(currentWord);
            currentWord = currentWord.next;
        }

        return currentBinder;
    }

    function createBindingFromString(input) {
        let words = parseTokenString(input);
        let binder = createBinder(words);
        return binder;
    }

    function bindAttribute(source, target, attributeName, attributeValue) {
        let binder = createBindingFromString(attributeValue);
        binder.bind(source, target, targetAttribute);
        return binder;
    }

    function bindElement(context, element) {
        let contextAttr = element.getAttribute("data-context");
        if (contextAttr) {
            let contextBinder = bindAttribute(context, element, "dataContext", contextAttr);
            throw new Error("Not Implemented");
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
                bindElement(context, child);
            }
        }
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

    /* Export Public Bowtie Properties */
    Bowtie.BINDER_TYPES = BINDER_TYPES;
    Bowtie.WORD_TYPES = WORD_TYPES;

    Bowtie.tie = tie;
    Bowtie.parseTokenString = parseTokenString;
    Bowtie.createBinder = createBinder;

    Bowtie.Word = Word;
    Bowtie.Binder = Binder;
    Bowtie.LiteralBinder = LiteralBinder;
    Bowtie.LookupBinder = LookupBinder;
    Bowtie.Observable = Observable;
})(Bowtie || (Bowtie = {}));

if (module !== undefined && module.exports !== undefined) {
    module.exports = Bowtie
}