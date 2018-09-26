declare namespace Bowtie {
    enum CharacterType {
        None = 0,
        Letter = 1,
        Number = 2,
        WhiteSpace = 3,
        Period = 4,
        OpenParen = 5,
        CloseParen = 6,
        OpenBracket = 7,
        CloseBracket = 8,
        Comma = 9,
        Quote = 10,
        DoubleQuote = 11,
        Operator = 12
    }
    class Token {
        readonly type: CharacterType;
        constructor(type: CharacterType);
    }
    class TokenParser {
        static parse(value: string): Token;
    }
}
