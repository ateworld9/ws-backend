"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var app = express_1.default();
app.use('/', function (req, res) {
    res.status(200).send({ data: 'Hello from ateworld9' });
});
var PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3001;
app.listen(PORT, function () { return console.log("The server is listening on PORT: " + PORT); });
//# sourceMappingURL=index.js.map