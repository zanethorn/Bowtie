
const Bowtie = require("./bowtie");

describe("Observable Behaviors", () => {

    it("should return new observable object from constructor is data is not observable", () => {
        let data = { name: "Superman", planet: "Krypton" };
        let result = new Bowtie.Observable(data);

        expect(result instanceof Bowtie.Observable).toBeTruthy();
        expect(result.state).toBe(data);
    });

    it("should return existing observable if item is already observable", () => {
        let data = { name: "Superman", planet: "Krypton" };
        let obj = new Bowtie.Observable(data);
        let result = new Bowtie.Observable(obj);

        expect(result).toBe(obj);
    });

});

describe("Word Parser", () => {

    it("should parse an empty string to undefined", () => {
        let result = Array.from(Bowtie.Token.tokenize(""))[0];
        expect(result).toBeUndefined();
    });

    it("should parse spaces to null", () => {
        let result = Array.from(Bowtie.Token.tokenize(" "))[0];
        expect(result).toBeNull();
    });

    it("should parse a integer to a number result", () => {
        let result = Array.from(Bowtie.Token.tokenize("451"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.NUMBER);
    });

    it("should parse a '.' to a period result", () => {
        let result = Array.from(Bowtie.Token.tokenize("."))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.PERIOD);
    });

    it("should parses 'name' to a LOOKUP result", () => {
        let result = Array.from(Bowtie.Token.tokenize("name"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.LOOKUP);
    });

    it("should parse a quoted string to a STRING result", () => {
        let result = Array.from(Bowtie.Token.tokenize("'name'"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.STRING);
    });

    it("should parse '[' to an INDEX_LOOKUP result", () => {
        let result = Array.from(Bowtie.Token.tokenize("["))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPEN_BRACKET);
    });

    it("should parse ']' to an INDEX_CLOSE result", () => {
        let result = Array.from(Bowtie.Token.tokenize("]"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.CLOSE_BRACKET);
    });

    it("should parse '(' to a GROUP_OPEN result", () => {
        let result = Array.from(Bowtie.Token.tokenize("("))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPEN_PAREN);
    });

    it("should parse ')' to a GROUP_CLOSE result", () => {
        let result = Array.from(Bowtie.Token.tokenize(")"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.CLOSE_PAREN);
    });

    it("should parse '+' to a plus OPERATOR", () => {
        let result = Array.from(Bowtie.Token.tokenize("+"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPERATOR);
    });

    it("should parse '-' to a minus OPERATOR", () => {
        let result = Array.from(Bowtie.Token.tokenize("-"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPERATOR);
    });

    it("should parse '!' to a minus OPERATOR", () => {
        let result = Array.from(Bowtie.Token.tokenize("!"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPERATOR);
    });

    it("should parse '/' to a divide OPERATOR", () => {
        let result = Array.from(Bowtie.Token.tokenize("/"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPERATOR);
    });

    it("should parse '*' to a multiply OPERATOR", () => {
        let result = Array.from(Bowtie.Token.tokenize("*"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPERATOR);
    });

    it("should parse '^' to a power OPERATOR", () => {
        let result = Array.from(Bowtie.Token.tokenize("^"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPERATOR);
    });

    it("should parse '&' to an and OPERATOR", () => {
        let result = Array.from(Bowtie.Token.tokenize("&"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPERATOR);
    });

    it("should parse '|' to an and OPERATOR", () => {
        let result = Array.from(Bowtie.Token.tokenize("|"))[0];
        expect(result.type).toBe(Bowtie.TOKEN_TYPES.OPERATOR);
    });
});

describe("Word Binder", () => {

    // it("should throw an error if none type result passed in", () => {
    //     expect(() => new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.NONE, null))).toThrowError();
    // });

    // it("should return a LiteralBinder with null value from null word", () => {
    //     let binder = new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.NULL, "null"));
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
    //     expect(binder.value).toBeNull();
    // });

    // it("should return a LiteralBinder with true value from true word", () => {
    //     let binder = new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.TRUE, "true"));
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
    //     expect(binder.value).toBe(true);
    // });

    // it("should return a LiteralBinder with false value from false word", () => {
    //     let binder = new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.FALSE, "false"));
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
    //     expect(binder.value).toBe(false);
    // });

    // it("should return a LiteralBinder with number value from number word", () => {
    //     let binder = new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "451"));
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
    //     expect(binder.value).toBe(451);
    // });

    // it("should return a LiteralBinder with number value from float word", () => {
    //     let binder = new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "45.1"));
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
    //     expect(binder.value).toBe(45.1);
    // });

    // it("should return a LiteralBinder with string value from string word", () => {
    //     let binder = new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.STRING, "Looksee"));
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
    //     expect(binder.value).toBe("Looksee");
    // });

    // it("should return a LookupBinder with from a lookup word", () => {
    //     let binder = new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.MEMBER_LOOKUP, "name"));
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.MEMBER_LOOKUP);
    //     expect(binder.value).toBe("name");
    // });

    // it("should throw an error if unclosed function passed in", () => {
    //     expect(() => new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.FUNCTION_LOOKUP, "floor"))).toThrowError();
    // });

    // it("should throw an error if function close is passed in alone", () => {
    //     expect(() => new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.FUNCTION_CLOSE, ""))).toThrowError();
    // });

    // it("should return a FunctionLookupBinder from a function word string", () => {
    //     let openWord = new Bowtie.Word(Bowtie.WORD_TYPES.FUNCTION_LOOKUP, "floor");
    //     let closeWord = new Bowtie.Word(Bowtie.WORD_TYPES.GROUP_CLOSE, "", openWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(openWord);
    //     expect(binder instanceof Bowtie.FunctionLookupBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.FUNCTION_LOOKUP);
    //     expect(binder.value).toBe("floor");
    // });

    // it("should throw an error if unclosed indexer passed in", () => {
    //     expect(() => new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.INDEX_LOOKUP, "floor"))).toThrowError();
    // });

    // it("should throw an error if index close is passed in alone", () => {
    //     expect(() => new Bowtie.BinderFactory().createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.INDEX_CLOSE, ""))).toThrowError();
    // });

    // it("should return a IndexLookupBinder from a index word string", () => {
    //     let openWord = new Bowtie.Word(Bowtie.WORD_TYPES.INDEX_LOOKUP, "floor");
    //     let indexWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3", openWord);
    //     let closeWord = new Bowtie.Word(Bowtie.WORD_TYPES.INDEX_CLOSE, "", indexWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(openWord);
    //     expect(binder instanceof Bowtie.IndexLookupBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.INDEX_LOOKUP);
    //     expect(binder.value).toBe("floor");
    // });

    // it("should return a GroupBinder from a grouped word string", () => {
    //     let openWord = new Bowtie.Word(Bowtie.WORD_TYPES.GROUP_OPEN, "");
    //     let indexWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3", openWord);
    //     let closeWord = new Bowtie.Word(Bowtie.WORD_TYPES.GROUP_CLOSE, "", indexWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(openWord);
    //     expect(binder instanceof Bowtie.GroupBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.GROUP);
    //     expect(binder.value).toBe("floor");
    // });

    // it("should throw an error if only left side is passed in from a binary plus string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "+", leftWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(leftWord)).toThrowError();
    // });

    // it("should throw an error if only right side is passed in from a binary plus string", () => {
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "+");
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(operatorWord)).toThrowError();
    // });

    // it("should return a PlusBinder with from an operator string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "+", leftWord);
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(leftWord);

    //     expect(binder instanceof Bowtie.PlusOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.BINARY_OPERATOR);
    //     expect(binder.value).toBe("+");
    // });

    // it("should throw an error if only left side is passed in from a binary minus string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "-", leftWord);
    //     expect(() => Bowtie.createBinder(leftWord)).toThrowError();
    // });

    // it("should return a NegateBinder with from an operator string", () => {
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "-");
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(operatorWord);

    //     expect(binder instanceof Bowtie.NegateOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.UNARY_OPERATOR);
    //     expect(binder.value).toBe("-");
    // });

    // it("should return a MinusBinder with from an operator string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "-", leftWord);
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(leftWord);

    //     expect(binder instanceof Bowtie.MinusOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.BINARY_OPERATOR);
    //     expect(binder.value).toBe("-");
    // });

    // it("should throw an error if only left side is passed in from a binary multiply string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "*", leftWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(leftWord)).toThrowError();
    // });

    // it("should throw an error if only right side is passed in from a binary multiply string", () => {
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "*");
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(operatorWord)).toThrowError();
    // });

    // it("should return a MultiplyBinder with from an operator string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "*", leftWord);
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(leftWord);

    //     expect(binder instanceof Bowtie.MultiplyOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.BINARY_OPERATOR);
    //     expect(binder.value).toBe("*");
    // });

    // it("should throw an error if only left side is passed in from a binary divide string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "/", leftWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(leftWord)).toThrowError();
    // });

    // it("should throw an error if only right side is passed in from a binary divide string", () => {
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "/");
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(operatorWord)).toThrowError();
    // });

    // it("should return a DivideBinder with from an operator string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "/", leftWord);
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(leftWord);

    //     expect(binder instanceof Bowtie.DivindeOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.BINARY_OPERATOR);
    //     expect(binder.value).toBe("/");
    // });

    // it("should throw an error if only left side is passed in from a binary power string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "^", leftWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(leftWord)).toThrowError();
    // });

    // it("should throw an error if only right side is passed in from a binary power string", () => {
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "^");
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(operatorWord)).toThrowError();
    // });

    // it("should return a PowerBinder with from an operator string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "^", leftWord);
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(leftWord);

    //     expect(binder instanceof Bowtie.PowerOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.BINARY_OPERATOR);
    //     expect(binder.value).toBe("^");
    // });

    // it("should throw an error if only left side is passed in from a binary and string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "&", leftWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(leftWord)).toThrowError();
    // });

    // it("should throw an error if only right side is passed in from a binary and string", () => {
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "&");
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(operatorWord)).toThrowError();
    // });

    // it("should return a AndBinder with from an operator string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "&", leftWord);
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(leftWord);

    //     expect(binder instanceof Bowtie.AndOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.BINARY_OPERATOR);
    //     expect(binder.value).toBe("&");
    // });

    // it("should throw an error if only left side is passed in from a binary or string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "|", leftWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(leftWord)).toThrowError();
    // });

    // it("should throw an error if only right side is passed in from a binary or string", () => {
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "|");
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(operatorWord)).toThrowError();
    // });

    // it("should return a OrBinder with from an operator string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "|", leftWord);
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(leftWord);

    //     expect(binder instanceof Bowtie.OrOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.BINARY_OPERATOR);
    //     expect(binder.value).toBe("|");
    // });

    // it("should throw an error if only left side is passed in from a binary not string", () => {
    //     let leftWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "3");
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "!", leftWord);
    //     expect(() => new Bowtie.BinderFactory().createBinder(leftWord)).toThrowError();
    // });

    // it("should return a NotBinder with from an operator string", () => {
    //     let operatorWord = new Bowtie.Word(Bowtie.WORD_TYPES.OPERATOR, "!");
    //     let rightWord = new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "2", operatorWord);
    //     let binder = new Bowtie.BinderFactory().createBinder(operatorWord);

    //     expect(binder instanceof Bowtie.NotOperatorBinder).toBeTruthy();
    //     expect(binder.type).toBe(Bowtie.BINDER_TYPES.UNARY_OPERATOR);
    //     expect(binder.value).toBe("!");
    // });

});

describe("Binding Behaviors", () => {

    class ElementMock {
        getAttribute(key) {
            return this[key];
        }
        setAttribute(key, value) {
            this[key] = value;
        }
    }

    it("LiteralBinder should bind number to appropriate field", () => {
        let binder = new Bowtie.LiteralBinder(451);
        let element = new ElementMock();

        binder.bind(null, element, "value");

        expect(element.value).toBe(451);
    });

    it("LookupBinder should bind lookup to appropriate field", () => {
        let data = new Bowtie.Observable({ "name": "Superman" });
        let binder = new Bowtie.MemberLookupBinder("name");
        let element = new ElementMock();

        binder.bind(data, element, "value");

        expect(element.value).toBe("Superman");
    });

    it("LookupBinder updates target when source is updated", () => {
        let data = new Bowtie.Observable({ "name": "Superman" });
        let binder = new Bowtie.MemberLookupBinder("name");
        let element = new ElementMock();

        binder.bind(data, element, "value");
        expect(element.value).toBe("Superman");

        data.setAttribute("name", "Batman")
        expect(element.value).toBe("Batman");
    });

});