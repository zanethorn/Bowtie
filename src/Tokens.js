var Bowtie;
(function (Bowtie) {
    let CharacterType;
    (function (CharacterType) {
        CharacterType[CharacterType["None"] = 0] = "None";
        CharacterType[CharacterType["Letter"] = 1] = "Letter";
        CharacterType[CharacterType["Number"] = 2] = "Number";
        CharacterType[CharacterType["WhiteSpace"] = 3] = "WhiteSpace";
        CharacterType[CharacterType["Period"] = 4] = "Period";
        CharacterType[CharacterType["OpenParen"] = 5] = "OpenParen";
        CharacterType[CharacterType["CloseParen"] = 6] = "CloseParen";
        CharacterType[CharacterType["OpenBracket"] = 7] = "OpenBracket";
        CharacterType[CharacterType["CloseBracket"] = 8] = "CloseBracket";
        CharacterType[CharacterType["Comma"] = 9] = "Comma";
        CharacterType[CharacterType["Quote"] = 10] = "Quote";
        CharacterType[CharacterType["DoubleQuote"] = 11] = "DoubleQuote";
        CharacterType[CharacterType["Operator"] = 12] = "Operator";
    })(CharacterType || (CharacterType = {}));
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
    class Token {
        constructor(type) {
            this.type = type;
        }
    }
    Bowtie.Token = Token;
    class TokenParser {
        static parse(value) {
            let tokenStart = 0;
            let ix = 0;
            let lastCharType = CharacterType.None;
            let firstToken = null;
            let lastToken = null;
            while (ix < value.length) {
                let char = value[ix];
                let charType = CHARACTER_MAP[char];
                if (charType == undefined) {
                    throw new Error(`Unknown Character '${char}' found in parse string at index ${ix}`);
                }
            }
            return firstToken;
        }
    }
    Bowtie.TokenParser = TokenParser;
})(Bowtie || (Bowtie = {}));
//# sourceMappingURL=Tokens.js.map