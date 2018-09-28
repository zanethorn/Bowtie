
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

    it("should parse an empty string to null", () => {
        let result = Bowtie.parseTokenString("");
        expect(result).toBeNull();
    });

    it("should parse spaces to null", () => {
        let result = Bowtie.parseTokenString(" ");
        expect(result).toBeNull();
    });

    it("should parse a integer to a number result", () => {
        let result = Bowtie.parseTokenString("451");
        expect(result.type).toBe(Bowtie.WORD_TYPES.NUMBER);
        expect(result.value).toBe("451");
    });

    it("should parse a float to a number result", () => {
        let result = Bowtie.parseTokenString("45.1");
        expect(result.type).toBe(Bowtie.WORD_TYPES.NUMBER);
        expect(result.value).toBe("45.1");
    });

    it("should throw an error if a number contains more than one period", () => {
        expect(() => Bowtie.parseTokenString("45.1.0")).toThrowError();
    });

    it("should parse a simple string to a lookup result", () => {
        let result = Bowtie.parseTokenString("name");
        expect(result.type).toBe(Bowtie.WORD_TYPES.MEMBER_LOOKUP);
        expect(result.value).toBe("name");
    });

    it("should parse a quoted string to a string result", () => {
        let result = Bowtie.parseTokenString("'name'");
        expect(result.type).toBe(Bowtie.WORD_TYPES.STRING);
        expect(result.value).toBe("name");
    });

    it("should parse word true to a true result", () => {
        let result = Bowtie.parseTokenString("true");
        expect(result.type).toBe(Bowtie.WORD_TYPES.TRUE);
        expect(result.value).toBe("true");
    });

    it("should parse word false to a false result", () => {
        let result = Bowtie.parseTokenString("false");
        expect(result.type).toBe(Bowtie.WORD_TYPES.FALSE);
        expect(result.value).toBe("false");
    });

    it("should parse word null to a null result", () => {
        let result = Bowtie.parseTokenString("null");
        expect(result.type).toBe(Bowtie.WORD_TYPES.NULL);
        expect(result.value).toBe("null");
    });

    it("should parse '.' to a member lookup result", () => {
        let result = Bowtie.parseTokenString(".");
        expect(result.type).toBe(Bowtie.WORD_TYPES.MEMBER_LOOKUP);
        expect(result.value).toBe(".");
    });

    it("should parse 'test(' to a function open", () => {
        let result = Bowtie.parseTokenString("test(");
        expect(result.type).toBe(Bowtie.WORD_TYPES.FUNCTION_LOOKUP);
        expect(result.value).toBe("test(");
    });
});

describe("Word Binder", () => {
    it("should throw an error if none type result passed in", () => {
        expect(() => Bowtie.createBinder({ type: Bowtie.WORD_TYPES.NONE, next: null, prev: null })).toThrowError();
    });

    it("should return a LiteralBinder with null value from null word", () => {
        let binder = Bowtie.createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.NULL, "null"));
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBeNull();
    });

    it("should return a LiteralBinder with true value from true word", () => {
        let binder = Bowtie.createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.TRUE, "true"));
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe(true);
    });

    it("should return a LiteralBinder with false value from false word", () => {
        let binder = Bowtie.createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.FALSE, "false"));
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe(false);
    });

    it("should return a LiteralBinder with number value from number word", () => {
        let binder = Bowtie.createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "451"));
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe(451);
    });

    it("should return a LiteralBinder with number value from float word", () => {
        let binder = Bowtie.createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.NUMBER, "45.1"));
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe(45.1);
    });

    it("should return a LiteralBinder with string value from string word", () => {
        let binder = Bowtie.createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.STRING, "Looksee"));
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe("Looksee");
    });

    it("should return a LookupBinder with from a lookup word", () => {
        let binder = Bowtie.createBinder(new Bowtie.Word(Bowtie.WORD_TYPES.LOOKUP, "name"));
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LOOKUP);
        expect(binder.value).toBe("name");
    });

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
        let binder = new Bowtie.LookupBinder("name");
        let element = new ElementMock();

        binder.bind(data, element, "value");

        expect(element.value).toBe("Superman");
    });

    it("LookupBinder updates target when source is updated", () => {
        let data = new Bowtie.Observable({ "name": "Superman" });
        let binder = new Bowtie.LookupBinder("name");
        let element = new ElementMock();

        binder.bind(data, element, "value");
        expect(element.value).toBe("Superman");

        data.setAttribute("name", "Batman")
        expect(element.value).toBe("Batman");
    });

});