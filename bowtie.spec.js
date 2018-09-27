
//import { Bowtie } from "./bowtie";
const Bowtie = require("./bowtie");


describe("Token Parser", () => {

    it("should parse an empty string to null", () => {
        let token = Bowtie.parseTokenString("");
        expect(token).toBeNull();
    });

    it("should parse spaces to null", () => {
        let token = Bowtie.parseTokenString(" ");
        expect(token).toBeNull();
    });

    it("should parse a integer to a number token", () => {
        let token = Bowtie.parseTokenString("451");
        expect(token.type).toBe(Bowtie.WORD_TYPES.NUMBER);
        expect(token.value).toBe("451");
    });

    it("should parse a float to a number token", () => {
        let token = Bowtie.parseTokenString("45.1");
        expect(token.type).toBe(Bowtie.WORD_TYPES.NUMBER);
        expect(token.value).toBe("45.1");
    });

    it("should throw an error if a number contains more than one period", () => {
        expect(() => Bowtie.parseTokenString("45.1.0")).toThrowError();
    });

    it("should parse a simple string to a lookup token", () => {
        let token = Bowtie.parseTokenString("name");
        expect(token.type).toBe(Bowtie.WORD_TYPES.LOOKUP);
        expect(token.value).toBe("name");
    });

    it("should parse a quoted string to a string token", () => {
        let token = Bowtie.parseTokenString("'name'");
        expect(token.type).toBe(Bowtie.WORD_TYPES.STRING);
        expect(token.value).toBe("name");
    });

    it("should parse word true to a true token", () => {
        let token = Bowtie.parseTokenString("true");
        expect(token.type).toBe(Bowtie.WORD_TYPES.TRUE);
        expect(token.value).toBe("true");
    });

    it("should parse word false to a false token", () => {
        let token = Bowtie.parseTokenString("false");
        expect(token.type).toBe(Bowtie.WORD_TYPES.FALSE);
        expect(token.value).toBe("false");
    });

    it("should parse word null to a null token", () => {
        let token = Bowtie.parseTokenString("null");
        expect(token.type).toBe(Bowtie.WORD_TYPES.NULL);
        expect(token.value).toBe("null");
    });

    it("should parse word null to a null token", () => {
        let token = Bowtie.parseTokenString("null");
        expect(token.type).toBe(Bowtie.WORD_TYPES.NULL);
        expect(token.value).toBe("null");
    });
});

describe("Token Binder", () => {
    it("should throw an error if none type token passed in", () => {
        expect(() => Bowtie.createBinder({ type: Bowtie.WORD_TYPES.NONE, next: null, prev: null })).toThrowError();
    });

    it("should return a literal binder with null value from null token", () => {
        let binder = Bowtie.createBinder({ type: Bowtie.WORD_TYPES.NULL, next: null, prev: null });
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBeNull();
    });

    it("should return a literal binder with true value from true token", () => {
        let binder = Bowtie.createBinder({ type: Bowtie.WORD_TYPES.TRUE, next: null, prev: null });
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe(true);
    });

    it("should return a literal binder with false value from false token", () => {
        let binder = Bowtie.createBinder({ type: Bowtie.WORD_TYPES.FALSE, next: null, prev: null });
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe(false);
    });

    it("should return a literal binder with number value from number token", () => {
        let binder = Bowtie.createBinder({ type: Bowtie.WORD_TYPES.NUMBER, value: "451", next: null, prev: null });
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe(451);
    });

    it("should return a literal binder with number value from float token", () => {
        let binder = Bowtie.createBinder({ type: Bowtie.WORD_TYPES.NUMBER, value: "45.1", next: null, prev: null });
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe(45.1);
    });

    it("should return a literal binder with string value from string token", () => {
        let binder = Bowtie.createBinder({ type: Bowtie.WORD_TYPES.STRING, value: "Looksee", next: null, prev: null });
        expect(binder.type).toBe(Bowtie.BINDER_TYPES.LITERAL);
        expect(binder.value).toBe("Looksee");
    });
});

describe("Binding Behaviors", () => {
    
});