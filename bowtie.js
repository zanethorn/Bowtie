"use strict";
if (!window) {
    var window = { Element: function () { } };
}
var module = (module || undefined);

var Bowtie;
(function (Bowtie) {

    /**
     * Consolodate error messages into one location for ease of translation
     */
    const ERRORS = {
        UNRECOGNIZED_SYMBOL: "Unrecognized or invalid symbol '{1}' at index {0}."
    };
    Object.freeze(ERRORS);

    /* Global Constants */
    const CHARACTER_TYPES = {};
    (function (CHARACTER_TYPES) {
        CHARACTER_TYPES[CHARACTER_TYPES["NONE"] = 0] = "NONE";
        CHARACTER_TYPES[CHARACTER_TYPES["LETTER"] = 1] = "LETTER";
        CHARACTER_TYPES[CHARACTER_TYPES["NUMBER"] = 2] = "NUMBER";
        CHARACTER_TYPES[CHARACTER_TYPES["QUOTE"] = 3] = "QUOTE";

        CHARACTER_TYPES[CHARACTER_TYPES["OPEN_PAREN"] = 4] = "OPEN_PAREN";
        CHARACTER_TYPES[CHARACTER_TYPES["CLOSE_PAREN"] = 5] = "CLOSE_PAREN";
        CHARACTER_TYPES[CHARACTER_TYPES["OPEN_BRACKET"] = 6] = "OPEN_BRACKET";
        CHARACTER_TYPES[CHARACTER_TYPES["CLOSE_BRACKET"] = 7] = "CLOSE_BRACKET";
        CHARACTER_TYPES[CHARACTER_TYPES["PERIOD"] = 8] = "PERIOD";
        CHARACTER_TYPES[CHARACTER_TYPES["COMMA"] = 9] = "COMMA";
        CHARACTER_TYPES[CHARACTER_TYPES["OPERATOR"] = 10] = "OPERATOR";
    })(CHARACTER_TYPES);
    Object.freeze(CHARACTER_TYPES);

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
        "_": CHARACTER_TYPES.LETTER,
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
    Object.freeze(CHARACTER_MAP);

    const TOKEN_TYPES = {};
    (function (TOKEN_TYPES) {
        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.NONE]] = CHARACTER_TYPES.NONE] = CHARACTER_TYPES[CHARACTER_TYPES.NONE];
        TOKEN_TYPES[TOKEN_TYPES["LOOKUP"] = 1] = "LOOKUP";
        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.NUMBER]] = CHARACTER_TYPES.NUMBER] = CHARACTER_TYPES[CHARACTER_TYPES.NUMBER];
        TOKEN_TYPES[TOKEN_TYPES["STRING"] = 3] = "STRING";

        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.OPEN_PAREN]] = CHARACTER_TYPES.OPEN_PAREN] = CHARACTER_TYPES[CHARACTER_TYPES.OPEN_PAREN];
        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.CLOSE_PAREN]] = CHARACTER_TYPES.CLOSE_PAREN] = CHARACTER_TYPES[CHARACTER_TYPES.CLOSE_PAREN];
        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.OPEN_BRACKET]] = CHARACTER_TYPES.OPEN_BRACKET] = CHARACTER_TYPES[CHARACTER_TYPES.OPEN_BRACKET];
        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.CLOSE_BRACKET]] = CHARACTER_TYPES.CLOSE_BRACKET] = CHARACTER_TYPES[CHARACTER_TYPES.CLOSE_BRACKET];
        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.PERIOD]] = CHARACTER_TYPES.PERIOD] = CHARACTER_TYPES[CHARACTER_TYPES.PERIOD];
        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.COMMA]] = CHARACTER_TYPES.COMMA] = CHARACTER_TYPES[CHARACTER_TYPES.COMMA];
        TOKEN_TYPES[TOKEN_TYPES[CHARACTER_TYPES[CHARACTER_TYPES.OPERATOR]] = CHARACTER_TYPES.OPERATOR] = CHARACTER_TYPES[CHARACTER_TYPES.OPERATOR];
    })(TOKEN_TYPES);
    Object.freeze(TOKEN_TYPES);


    class ParseState {
        constructor(state, inputIndex, length) {
            this.state = state;
            this.inputIndex = inputIndex;
            this.length = length;
        }
    }

    const LR_TABLE = [
        []
    ];


    const BINDER_TYPES = {
        NONE: 0,
        LITERAL: 1,
        SOURCE: 2,
        MEMBER_LOOKUP: 3,
        FUNCTION_LOOKUP: 4,
        INDEX_LOOKUP: 5,
        GROUP: 6,

    }

    const FUNCTIONS = {

    }

    class Token {
        constructor(type, startPtr, length) {
            this.type = type;
            this.startPtr = startPtr;
            this.length = length;
        }

        static *tokenize(input) {
            let startPtr = 0;
            let endPtr = 0;
            let tokenType = TOKEN_TYPES.NONE;

            while (endPtr < input.length) {
                let char = input[endPtr];
                let charType = CHARACTER_MAP[char];

                switch (charType) {
                    case undefined:
                        throw new Error(String.format(ERRORS.UNRECOGNIZED_SYMBOL, char, endPtr));

                    case CHARACTER_TYPES.NONE:
                        if (tokenType !== TOKEN_TYPES.NONE) {
                            yield new Token(tokenType, startPtr, endPtr - startPtr);
                            tokenType = TOKEN_TYPES.NONE;
                        }
                        startPtr += endPtr + 1;
                        break;

                    case CHARACTER_TYPES.QUOTE:
                        if (tokenType === TOKEN_TYPES.STRING) {
                            yield new Token(tokenType, startPtr, endPtr - startPtr);
                            tokenType = TOKEN_TYPES.NONE;
                        }
                        else {
                            tokenType = TOKEN_TYPES.STRING;
                        }
                        startPtr += endPtr + 1;
                        break;

                    case CHARACTER_TYPES.NUMBER:
                        if (tokenType === TOKEN_TYPES.NONE) {
                            tokenType = TOKEN_TYPES.NUMBER;
                        }
                        break;

                    case CHARACTER_TYPES.LETTER:
                        if (tokenType === TOKEN_TYPES.NONE) {
                            tokenType = TOKEN_TYPES.LOOKUP;
                        }
                        break;

                    default:
                        if (tokenType !== TOKEN_TYPES.NONE) {
                            yield new Token(tokenType, startPtr, endPtr - startPtr);
                            tokenType = TOKEN_TYPES.NONE;
                        }
                        yield new Token(charType, endPtr, 1);
                        startPtr += endPtr + 1;
                        break;
                }

                endPtr += 1;
            }

            if (tokenType !== TOKEN_TYPES.NONE) {
                yield new Token(tokenType, startPtr, endPtr - startPtr);
            }

        }


    }

    function parse_word(input) {
        stack = []


        topOfStack = null;
        nextInput = input;



    };

    /* Public Classes */

    class Binder {
        constructor(type, value) {
            this._type = type;
            this._value = value;
        }

        bind(context, target, targetAttribute) {
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

        getBindingValue(context) {
            throw Error("Binding Error: Method is Abstract.");
        }
    }

    class PartialBinder extends Binder {
        constructor(type, value) {
            super(type, value);
        }
    }

    class LiteralBinder extends Binder {
        constructor(value) {
            super(BINDER_TYPES.LITERAL, value);
        }

        bind(context, target, targetAttribute) {
            ensureBindings(target);
            target.setAttribute(targetAttribute, this.getBindingValue(context));
            target.bindings.push(this);
        }

        getBindingValue(context) {
            return this.value;
        }
    }

    class LookupBinder extends Binder {
        constructor(type, value, parent) {
            super(type, value);

            if (parent !== undefined && !(parent instanceof LookupBinder)) {
                throw new Error("Parent Lookup must be a LookupBinder");
            }

            this._parent = parent;
        }

        get isDynamic() {
            return true;
        }

        get parent() {
            return this._parent;
        }

        bind(context, target, targetAttribute) {
            ensureBindings(context);
            ensureBindings(target);
            context.addEventListener("changed", (ev) => {
                target.setAttribute(targetAttribute, this.getBindingValue(context));
            });

            target.bindings.push(this);

            if (target instanceof window.Element) {

                if (target.onchange !== undefined && targetAttribute === "value") {
                    target.onchange = (ev) => {
                        context.setAttribute(this.value, target.value);
                    }

                    target.value = this.getBindingValue(context);
                    context.bindings.push(this);
                }
                else if (window.MutationObserver !== undefined) {
                    let mutationConfig = { characterData: true, attributes: true };
                    let targetObserver = new window.MutationObserver((mutations) => {
                        for (let mutation of mutations) {
                            if (mutation.type === 'attributes' && mutation.attributeName === targetAttribute) {
                                let currentValue = this.getBindingValue(context);
                                let newValue = target.getAttribute(targetAttribute);
                                if (currentValue !== newValue) {
                                    context.setAttribute(this.value, newValue);
                                }
                            }
                        }
                        targetObserver.observe(target, mutationConfig);
                    });

                    context.bindings.push(this);
                }
                else {
                    this._isTwoWay = false;
                }
            }
            else {
                target = new Observable(target);

                target.addEventListener("changed", (ev) => {
                    context.setAttribute(this.value, target.getAttribute(targetAttribute));
                });
                context.bindings.push(this);
            }

            target.setAttribute(targetAttribute, this.getBindingValue(context));
        }

        getBindingValue(context) {
            return context.getAttribute(this.value);
        }
    }

    class SourceBinder extends LookupBinder {
        constructor() {
            super(BINDER_TYPES.SOURCE);
        }

        bind(context, target, targetAttribute) {
            ensureBindings(target);
            target.setAttribute(targetAttribute, this.getBindingValue(context));
            target.bindings.push(this);
        }

        getBindingValue(context) {
            if (context instanceof Observable) {
                return context.state;
            }
            return context;
        }
    }

    class MemberLookupBinder extends LookupBinder {
        constructor(value, parent) {
            super(BINDER_TYPES.MEMBER_LOOKUP, value, parent);
            this._isTwoWay = true;
        }

        get isTwoWay() {
            return this._isTwoWay;
        }

        getBindingValue(context) {
            return context.getAttribute(this.value);
        }
    }
    class FunctionLookupBinder extends LookupBinder {
        constructor(value, parameters, parent) {
            super(BINDER_TYPES.FUNCTION_LOOKUP, value, parent);
            this._parameters = parameters;
        }

        get parameters() {
            return this._parameters;
        }

        bind(context, target, targetAttribute) {
            let func = this.getBindingValue(context);

            if (target instanceof window.Element && targetAttribute.startsWith("on")) {
                ensureBindings(target);
                target[targetAttribute] = () => {
                    let params = undefined;
                    if (this.parameters) {
                        params = this.parameters.getBindingValue(context);
                    }
                    func.apply(context, params);
                };
            }
            else {
                target = new Observable(target);
                ensureBindings(target);

                let params = undefined;
                if (this.parameters) {
                    params = this.parameters.getBindingValue(context);
                }

                let value = func.apply(context, params);
                target.setAttribute(targetAttribute, value);
            }

            target.bindings.push(this);
        }

        getBindingValue(context) {
            let func = context.getAttribute(this.value);
            if (func) {
                return func;
            }

            func = FUNCTIONS[this.value];
            if (!func) {
                throw new Error(`Function '${this.value}' was not found.`);
            }
        }
    }
    class IndexLookupBinder extends LookupBinder {
        constructor(value, parameters, parent) {
            super(BINDER_TYPES.INDEX_LOOKUP, value, parent);

            if (!parameters) {
                throw new Error("Indexer must have a parameter");
            }

            this._parameters = parameters;
        }

        get parameters() {
            return this._parameters;
        }

        getBindingValue(context) {
            let base = super.getBindingValue(context)
            let index = this.parameters.getBindingValue(context);
            return base[index];
        }
    }

    class BinaryOperatorBinder extends Binder {
        constructor(type, value, left, right) {
            super(type, value, parent);

            this._left = left;
            this._right = right;
        }

        get left() {
            return this._left;
        }

        get right() {
            return this._right;
        }

        getBindingValue(context) {
            let leftValue = this.left.getBindingValue(context);
            let rightValue = this.right.getBindingValue(context);
            return this.operate(leftValue, rightValue);
        }

        operate(left, right) {
            throw new Error("Not Implemented");
        }
    }

    class PlusOperatorBinder extends BinaryOperatorBinder {
        constructor(left, right) {
            super(type, "+", left, right);
        }

        operate(left, right) {
            return left + right;
        }
    }

    class GroupBinder extends Binder {
        constructor(inner) {
            super(BINDER_TYPES.GROUP);

            this._inner;
        }

        get left() {
            return this._left;
        }

        get right() {
            return this._right;
        }

        bind(context, target, targetAttribute) {
            ensureBindings(target);
            target.setAttribute(targetAttribute, this.getBindingValue(context));
            target.bindings.push(this);
        }

        *getBindingValue(context) {
            if (this.left) {
                if (typeof this.left === "function") {
                    for (let item of this.left) {
                        return item;
                    }
                }
                else {
                    yield this.left;
                }
            }

            if (this.right) {
                if (typeof this.right === "function") {
                    for (let item of this.right) {
                        return item;
                    }
                }
                else {
                    yield this.right;
                }
            }
        }
    }

    class BinderFactory {

        constructor() {
            this.currentWord = null;
            this.currentBinder = null;
            this.bindingFunctions = [
                (word) => { /* handleNone */
                    throw new Error("Binding Error: None Word type passed into binder.");
                },
                (word) => { /* handleNumber */
                    return new LiteralBinder(parseFloat(word.value));
                },
                (word) => { /* handleString */
                    return new LiteralBinder(word.value);
                },
                (word) => { /* handleTrue */
                    return new LiteralBinder(true);
                },
                (word) => { /* handleFalse */
                    return new LiteralBinder(false);
                },
                (word) => { /* handleNull */
                    return new LiteralBinder(null);
                },
                (word) => { /* handleMemberLookup */
                    if (word.value === "") {
                        return new SourceBinder();
                    }
                    if (this.currentBinder instanceof LookupBinder) {
                        return new MemberLookupBinder(word.value, this.currentBinder);
                    }
                    return new MemberLookupBinder(word.value);
                },
                (word) => { /* handleFunctionLookup */
                    if (!word.next) {
                        throw new Error("Unclosed function");
                    }
                    let functionBinder = new FunctionLookupBinder(word.value, previousBinder);
                    let parametersBinder = createBinder(word.next, functionBinder);
                    if (functionBinder === parametersBinder) {
                        return functionBinder;
                    }
                    return new FunctionLookupBinder(word.value, parametersBinder, this.currentBinder);
                },
                (word) => { /* handleIndexLookup */
                    if (!word.next) {
                        throw new Error("Unclosed Index");
                    }
                    let parametersBinder = createBinder(word.next, new LookupBinder(word.value));
                    return new IndexLookupBinder(word.value, parametersBinder);
                },
                (word) => { /* handleIndexClose */
                    if (!this.currentBinder) {
                        throw new Error("Index close found without a matching open");
                    }
                    return this.currentBinder;
                },
                (word) => { /* handleGroupOpen */
                    throw new Error("Not Implemented.");
                },
                (word) => { /* handleGroupClose */
                    if (!this.currentBinder) {
                        throw new Error("Function close found without a matching open");
                    }
                    return this.currentBinder;
                },
                (word) => { /* handleOperator */
                    if (!this.currentBinder) {
                        switch (word.value) {
                            case "-":
                            case "!":
                                let nextWord = word.next;
                                if (!word.next) {
                                    throw new Error(`Parser Error: invalid symbol '${word.value}'`);
                                }
                                let binder = this.createBinder(nextWord);

                            default:
                                throw new Error(`Parser Error: invalid symbol '${word.value}' without a proceeding operator value`);
                        }

                    }
                    return this.currentBinder;
                }
            ]
        }

        createBinder(word) {
            this.currentWord = word;
            while (this.currentWord != null) {
                let func = this._lookupHandler(this.currentWord);

                this.currentBinder = func(this.currentWord);
                this.currentWord = this.currentWord.next;
            }

            let result = this.currentBinder;
            return result;
        }

        _lookupHandler(word) {
            let func = this.bindingFunctions[word.type];

            if (func === undefined) {
                throw new Error(`Binding Error: Unknown handler type for token type ${word.type}`)
            }

            return func;
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

        constructor(data, parent) {
            super(data);

            if (!parent) {
                parent = this;
            }
            this._data = data;
            this._parent = parent;
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

    /**
     * Parses a string into a chain of tokens
     * @param {} input 
     */
    function parseTokenString(input) {
        let wordStartIndex = 0;
        let currentIndex = 0;
        //let lastCharType = CHARACTER_TYPES.NONE;
        let wordType = WORD_TYPES.NONE;
        let firstWord = null;
        let lastWord = null;
        let numberHasPeriod = false;

        let testWord = (charType) => {
            let handler = handlers[wordType];
            if (handler === undefined) {
                throw new Error(`Handler undefined for word type '${wordType}'`);
            }

            let emmitToken = handler(charType);

            if (emmitToken) {
                createWord();
            }
        };

        let createWord = () => {
            if (input[wordStartIndex] === ".") {
                wordStartIndex += 1;
            }

            let value = input.slice(wordStartIndex, currentIndex);
            if (value === "true") {
                wordType = WORD_TYPES.TRUE;
            }
            else if (value === "false") {
                wordType = WORD_TYPES.FALSE;
            }
            else if (value === "null") {
                wordType = WORD_TYPES.NULL;
            }

            let word = new Word(wordType, value, lastWord);

            if (firstWord === null) {
                firstWord = word;
            }

            lastWord = word;
            wordStartIndex = currentIndex
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
                    wordType = WORD_TYPES.MEMBER_LOOKUP;
                    break;
                case CHARACTER_TYPES.NUMBER:
                    return startNumber();
                case CHARACTER_TYPES.WHITE_SPACE:
                    wordType = WORD_TYPES.NONE;
                    wordStartIndex += 1;
                    break;
                case CHARACTER_TYPES.OPEN_PAREN:
                    wordType = WORD_TYPES.GROUP_OPEN;
                    wordStartIndex += 1;
                    return true;
                case CHARACTER_TYPES.CLOSE_PAREN:
                    wordType = WORD_TYPES.GROUP_CLOSE;
                    wordStartIndex += 1;
                    return true;
                case CHARACTER_TYPES.OPEN_BRACKET:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.CLOSE_BRACKET:
                    wordType = WORD_TYPES.INDEX_CLOSE;
                    wordStartIndex += 1;
                    return true;
                case CHARACTER_TYPES.PERIOD:
                    wordStartIndex += 1;
                    wordType = WORD_TYPES.MEMBER_LOOKUP;
                    break;
                case CHARACTER_TYPES.COMMA:
                    throw new Error("Not Implemented");
                    break;
                case CHARACTER_TYPES.QUOTE:
                    wordType = WORD_TYPES.STRING;
                    wordStartIndex += 1;
                    break;
                case CHARACTER_TYPES.OPERATOR:
                    wordType = WORD_TYPES.OPERATOR;
                    switch (input[wordStartIndex]) {
                        case "&":
                        case "|":
                            return false;
                        default:
                            currentIndex += 1;
                            return true;
                    }
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
                        throw new Error(`Parser Error: Invalid duplicate period in number at index ${currentIndex}`);
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

        let handleTrue = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        }

        let handleFalse = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handleNull = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handleMemberLookup = (charType) => {
            switch (charType) {
                case CHARACTER_TYPES.LETTER:
                case CHARACTER_TYPES.NUMBER:
                    return false; /* Keep building word */
                case CHARACTER_TYPES.PERIOD:
                    if (wordStartIndex === currentIndex) {
                        throw new Error(`Parser Error: Invalid character '${input[currentIndex]}' at index ${currentIndex}`);
                    }
                    return true;
                case CHARACTER_TYPES.NONE:
                case CHARACTER_TYPES.WHITE_SPACE:
                case CHARACTER_TYPES.COMMA:
                    return true;
                case CHARACTER_TYPES.OPEN_PAREN:
                    wordType = WORD_TYPES.FUNCTION_LOOKUP;
                    return true; /* start parsing function parameters, if any */
                case CHARACTER_TYPES.CLOSE_BRACKET:
                case CHARACTER_TYPES.CLOSE_PAREN:
                case CHARACTER_TYPES.UNKNOWN:
                    throw new Error(`Parser Error: Invalid character '${input[currentIndex]}' at index ${currentIndex}`);
                case CHARACTER_TYPES.OPEN_BRACKET:
                    wordType = WORD_TYPES.INDEX_LOOKUP;
                    return true; /* start parsing function parameters, if any */
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

        let handleFunctionLookup = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handleIndexLookup = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handleIndexClose = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handleGroupOpen = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handleGroupClose = (charType) => {
            throw new Error("Parser Error: Method should never be called");
        };

        let handleOperator = (charType) => {
            if (charType === CHARACTER_TYPES.OPERATOR) {
                if (input[currentIndex] == input[wordStartIndex]) {
                    return true;
                }
            }
            throw new Error(`Parser Error: Invalid Syntax at ${currentIndex}`);
        };

        let handlers = [
            handleNone,
            handleNumber,
            handleString,
            handleTrue,
            handleFalse,
            handleNull,
            handleMemberLookup,
            handleFunctionLookup,
            handleIndexLookup,
            handleIndexClose,
            handleGroupOpen,
            handleGroupClose,
            handleOperator
        ];

        while (currentIndex < input.length) {
            let char = input[currentIndex];
            let charType = CHARACTER_MAP[char];

            if (charType === undefined) {
                charType = CHARACTER_TYPES.UNKNOWN;
            }

            testWord(charType);

            //lastCharType = charType;
            currentIndex += 1;
        }

        testWord(CHARACTER_TYPES.NONE);

        return firstWord;
    }

    function createBindingFromString(input) {
        let words = parseTokenString(input);
        let factory = new BinderFactory();
        let binder = factory.createBinder(words);
        return binder;
    }

    function ensureBindings(obj) {
        if (obj['bindings'] === undefined) {
            obj['bindings'] = [];
        }
    }

    function bindAttribute(source, target, attributeName, attributeValue) {
        let binder = createBindingFromString(attributeValue);
        binder.bind(source, target, attributeName);
        return binder;
    }

    function bindElement(context, element) {
        let contextAttr = element.getAttribute("data-context");
        if (contextAttr) {
            // Bind context to node
            let contextBinder = bindAttribute(context, element, "dataContext", contextAttr);
            // update the working context object
            let contextData = contextBinder.getBindingValue(context);
            context = new DataContext(contextData, context);
        }

        for (let attr of element.attributes) {
            if (attr.name.startsWith("data-bind-")) {
                let boundName = attr.name.substring(10);
                let attributeBinder = bindAttribute(context, element, boundName, attr.value);
            }
        }

        let loopAttribute = element.getAttribute("data-foreach");
        if (loopAttribute) {
            // get the inner HTML and set up a template
            let html = element.innerHTML.trim();
            element.innerHTML = "";

            let template = document.createElement("template");
            template.innerHTML = html;
            element.template = template;

            // Bind context to node
            let contextBinder = bindAttribute(context, element, "items", loopAttribute);
            // update the working context object
            let itemData = contextBinder.getBindingValue(context);
            for (let item of itemData) {
                let itemContext = new DataContext(item, context);
                template.innerHTML = html;

                for (let child of template.content.children) {
                    element.appendChild(child);
                    setTimeout(() => bindElement(itemContext, child));
                }
            }
        }
        else if (element.children !== undefined) {
            for (let child of element.children) {
                if (child instanceof Element) {
                    setTimeout(() => bindElement(context, child));
                }
            }
        }
    }

    /** 
     * Main Entry point.  Binds data to the HTML
     */
    function tie(source, target) {
        let context = new DataContext(source);
        bindElement(context, target);
    }

    /* Export Public Bowtie Properties */
    Bowtie.BINDER_TYPES = BINDER_TYPES;
    Bowtie.TOKEN_TYPES = TOKEN_TYPES;

    Bowtie.tie = tie;
    Bowtie.Token = Token;

    //Bowtie.Word = Word;
    Bowtie.Binder = Binder;
    Bowtie.LiteralBinder = LiteralBinder;
    Bowtie.LookupBinder = LookupBinder;
    Bowtie.BinderFactory = BinderFactory;

    Bowtie.MemberLookupBinder = MemberLookupBinder;
    Bowtie.FunctionLookupBinder = FunctionLookupBinder;
    Bowtie.IndexLookupBinder = IndexLookupBinder;
    Bowtie.PlusOperatorBinder = PlusOperatorBinder;

    Bowtie.Observable = Observable;
})(Bowtie || (Bowtie = {}));

if (module !== undefined && module.exports !== undefined) {
    module.exports = Bowtie
}