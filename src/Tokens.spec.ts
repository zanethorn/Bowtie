/// <reference path="./Tokens.ts" />
/// <reference path="../node_modules/@types/jasmine/index.d.ts" />

//const Bowtie = require("../bowtie");
//import { TokenParser } from "./Tokens";

namespace Bowtie {

    describe("Token Parser", () => {

        it("should parse an empty string to a null token", () => {
            let token = TokenParser.parse("")
            expect(token).toBeNull();
        });
    });

}