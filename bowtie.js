"use strict";

/* These are needed to ensure that 
if (!window) {
    var window = { Element: function () { } };
}
var module = (module || undefined);

/* Patch in string.format */
if (!String.prototype.format) {
    /**
     * Formats a string using {n} format syntax and returns a new string
     * @param {*} args A list of arguments to inject into the string
     */
    String.prototype.format = function (...args) {
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

/**
 * The Bowtie namespace
 */
var Bowtie;
(function (Bowtie) {
    /*************************************************************************
     * Constants                                                             *
     *************************************************************************/

    /**
     * Consolodate error messages into one location for ease of translation
     */
    const ERRORS = {
        UNRECOGNIZED_SYMBOL: "Unrecognized or invalid symbol '{1}' at index {0}.",
        UNTERMINATED_STRING_LITERAL: "Unterminated string literal.",
        INVALID_SYNTAX: "Invalid Syntax '{0}' near index {1}."
    };
    /* lock down object to modifications */
    Object.freeze(ERRORS);

    /**
     * Enumeration representing the possible "types" of a character 
     */
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
    /* lock down object to modifications */
    Object.freeze(CHARACTER_TYPES);

    /**
     * A mapping from characters to character types.  All defined characters should be
     * here.  If they are not in this list, Token.tokenize will throw an Error.
     */
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
        " ": CHARACTER_TYPES.NONE,
        "\t": CHARACTER_TYPES.NONE,
        "\n": CHARACTER_TYPES.NONE,
        "\r": CHARACTER_TYPES.NONE,
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
    /* lock down object to modifications */
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

        TOKEN_TYPES["length"] = TOKEN_TYPES.OPERATOR + 1;
    })(TOKEN_TYPES);
    Object.freeze(TOKEN_TYPES);

    const PARSER_BEHAVIOR = {};
    (function (PARSER_BEHAVIOR) {
        PARSER_BEHAVIOR[PARSER_BEHAVIOR["ERROR"] = 0] = "ERROR";
        PARSER_BEHAVIOR[PARSER_BEHAVIOR["SHIFT"] = 1] = "SHIFT";
        PARSER_BEHAVIOR[PARSER_BEHAVIOR["REDUCE"] = 2] = "REDUCE";
        PARSER_BEHAVIOR[PARSER_BEHAVIOR["STOP"] = 3] = "STOP";

        PARSER_BEHAVIOR.length = PARSER_BEHAVIOR["STOP"] + 1;
    })(PARSER_BEHAVIOR);
    Object.freeze(PARSER_BEHAVIOR);

    const PARSER_STATE_INDEX = {};
    (function (PARSER_STATE_INDEX) {
        PARSER_STATE_INDEX[PARSER_STATE_INDEX["NEW"] = 0] = "NEW";
        PARSER_STATE_INDEX[PARSER_STATE_INDEX["VALUE"] = 1] = "VALUE";
        PARSER_STATE_INDEX[PARSER_STATE_INDEX["UNARY_OR_BINARY"] = 2] = "UNARY_OR_BINARY";
        PARSER_STATE_INDEX[PARSER_STATE_INDEX["UNARY"] = 2] = "UNARY";
        PARSER_STATE_INDEX[PARSER_STATE_INDEX["BINARY"] = 3] = "BINARY";
        //PARSER_STATE_INDEX[PARSER_STATE_INDEX["EOF"] = 4] = "EOF";

        PARSER_STATE_INDEX["length"] = PARSER_STATE_INDEX["BINARY"] + 1;
    })(PARSER_STATE_INDEX);
    Object.freeze(PARSER_STATE_INDEX);

    const 

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

    /**
     * Represents a segment of a string with a distinct semantic meaning.
     */
    class Token {
        /**
         * Creates a new instance of Bowtie.Token
         * @param {TOKEN_TYPES} type Indicates what the type of value the token represents
         * @param {Integer} startPtr The start index of the slice or substring
         * @param {Integer} length The length of the slice or substring
         */
        constructor(type, input, startPtr, length) {
            this.type = type;
            this.input = input;
            this.startPtr = startPtr;
            this.length = length;
        }

        get value() {
            return this.input.slice(this.startPtr, this.startPtr + this.length);
        }

        /**
         * Analyzes an input string and converts it into tokens.  Returns results as a generator
         * @param {string} input The string to be converted
         */
        static *tokenize(input) {
            let startPtr = 0;
            let endPtr = 0;
            let tokenType = TOKEN_TYPES.NONE;

            /* Keep on until the end of the string */
            while (endPtr < input.length) {
                let char = input[endPtr];
                /* Get the type of character we are dealing with */
                let charType = CHARACTER_MAP[char];

                switch (charType) {
                    /* This is an unknown or invalid character */
                    case undefined:
                        /* if we are dealing with a string literal, anything goes, else, throw an error */
                        if (tokenType !== TOKEN_TYPES.STRING) {
                            throw new Error(ERRORS.UNRECOGNIZED_SYMBOL.format(char, endPtr));
                        }

                    /* Typically this means whitespace characters, or others we want to ignore */
                    case CHARACTER_TYPES.NONE:
                        if (tokenType !== TOKEN_TYPES.NONE) {
                            yield new Token(tokenType, input, startPtr, endPtr - startPtr);
                            tokenType = TOKEN_TYPES.NONE;
                        }
                        startPtr += endPtr + 1;
                        break;

                    /* Starts or end a string literal */
                    case CHARACTER_TYPES.QUOTE:
                        if (tokenType === TOKEN_TYPES.STRING) {
                            yield new Token(tokenType, input, startPtr, endPtr - startPtr);
                            tokenType = TOKEN_TYPES.NONE;
                        }
                        else {
                            tokenType = TOKEN_TYPES.STRING;
                        }
                        startPtr += endPtr + 1;
                        break;

                    /* If we are at the start of a new token, a number is a distict literal, else, it should be part of a lookup string */
                    case CHARACTER_TYPES.NUMBER:
                        if (tokenType === TOKEN_TYPES.NONE) {
                            tokenType = TOKEN_TYPES.NUMBER;
                        }
                        break;

                    /* start a lookup string */
                    case CHARACTER_TYPES.LETTER:
                        if (tokenType === TOKEN_TYPES.NONE) {
                            tokenType = TOKEN_TYPES.LOOKUP;
                        }
                        break;

                    /* we are dealing with some type of symbol, like a period or binary operator */
                    default:
                        if (tokenType !== TOKEN_TYPES.NONE) {
                            yield new Token(tokenType, input, startPtr, endPtr - startPtr);
                            tokenType = TOKEN_TYPES.NONE;
                        }
                        yield new Token(charType, endPtr, 1);
                        startPtr += endPtr + 1;
                        break;
                }

                endPtr += 1;
            }

            /* close out any open token */
            if (tokenType === TOKEN_TYPES.STRING) {
                throw new Error(ERRORS.UNTERMINATED_STRING_LITERAL);
            }
            else if (tokenType !== TOKEN_TYPES.NONE) {
                yield new Token(tokenType, input, startPtr, endPtr - startPtr);
            }
            return new Token(TOKEN_TYPES.NONE, undefined, -1, 0);
        }
    }

    class ParserCommand {
        constructor(behavior, binderType, gotoIndex, action) {
            this.behavior = behavior;
            this.binderType = binderType;
            this.action = action || ((current, previous) => { throw new Error(ERRORS.INVALID_SYNTAX.format(current.value, current.startPtr)); });
            this.gotoIndex = gotoIndex || 0;
        }
    }

    const PARSER_ERROR = new ParserCommand(PARSER_BEHAVIOR.ERROR);
    Object.freeze(PARSER_ERROR);

    class ParserState {
        constructor(index) {
            this.index = index;
            for (let i = 0; i < TOKEN_TYPES.length; i++) {
                this[i] = PARSER_ERROR;
            }
        }
    }

    const PARSE_TABLE = [];
    for (let i = 0; i < PARSER_STATE_INDEX.length; i++) {
        PARSE_TABLE[i] = new ParserState(i);
    }

    PARSE_TABLE[PARSER_STATE_INDEX.NEW][TOKEN_TYPES.LOOKUP] = new ParserCommand(PARSER_BEHAVIOR.SHIFT, BINDER_TYPES.LOOKUP, PARSER_STATE_INDEX.VALUE);
    PARSE_TABLE[PARSER_STATE_INDEX.NEW][TOKEN_TYPES.NUMBER] = new ParserCommand(PARSER_BEHAVIOR.SHIFT, BINDER_TYPES.LITERAL, PARSER_STATE_INDEX.VALUE);


    PARSE_TABLE[PARSER_STATE_INDEX.VALUE][TOKEN_TYPES.NONE] = new ParserCommand(PARSER_BEHAVIOR.STOP);

    Object.freeze(PARSE_TABLE);

    class ParserWord {
        constructor(binderType, token, currentWord, previousWord) {
            this.binderType = binderType;
            this.token = token;
            this.currentWord = currentWord;
            this.previousWord = previousWord;
        }
    }

    /**
     * Handles the semantic aspects of parsing binder input
     */
    class Parser {

        static parse_tokens(tokens) {
            let stack = [];
            let stateIndex = 0;

            let itr = tokens.next();
            let token = itr.value;
            let currentWord = null;

            while (true) {
                let command = PARSE_TABLE[stateIndex][token.type];
                stateIndex = command.gotoIndex;

                switch (command.behavior) {

                    case PARSER_BEHAVIOR.SHIFT:
                        stack.push(currentWord);
                        currentWord = new ParserWord(command.binderType, token, currentWord);
                        if (!itr.done) {
                            itr = tokens.next();
                            token = itr.value;
                        }
                        break;

                    case PARSER_BEHAVIOR.REDUCE:
                        let previousWord = stack.pop();
                        currentWord = new ParserWord(command.binderType, token, currentWord, previousWord);
                        break;

                    case PARSER_BEHAVIOR.STOP:
                        return currentWord;

                    case PARSER_BEHAVIOR.ERROR:
                    default:
                        throw new Error(ERRORS.INVALID_SYNTAX.format(token.value, token.startPtr));
                }
            }
        }

        /**
         * Parses Tokens into binding objects.
         * @param {string} input The token string to parse
         */
        static parse(input) {
            this.parse_tokens(Token.tokenize(input));
        }
    }

    class Expression {

        static build(word) {
            switch (word.wordType) {
                case 
            }
        }
    }

    class ExpressionBinder {

    }

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

        compile() {
            return ((ctx) => this.value);
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
    Bowtie.Parser = Parser;

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