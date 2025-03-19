"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var WALLET_ADDRESS = "GCMEELHBN6VBVFGVRRD7PAGJZY63F3PWA4CL6QGXCYNMFPFL6J77B2RV"; // Inserisci il tuo wallet completo
var EXPECTED_AMOUNT = "0.765"; // Importo richiesto esatto
var SERVER_URL = "https://api.testnet.minepi.com/horizon"; // Usa Horizon per leggere le transazioni
function checkTransactions() {
    return __awaiter(this, void 0, void 0, function () {
        var response, transactions, _i, transactions_1, tx, operationsResponse, operations, _a, operations_1, op, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("🔍 Controllo transazioni in corso...");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, axios_1.default.get("".concat(SERVER_URL, "/accounts/").concat(WALLET_ADDRESS, "/transactions?order=desc&limit=10"))];
                case 2:
                    response = _b.sent();
                    transactions = response.data._embedded.records;
                    console.log("📥 Transazioni ricevute:", transactions);
                    _i = 0, transactions_1 = transactions;
                    _b.label = 3;
                case 3:
                    if (!(_i < transactions_1.length)) return [3 /*break*/, 6];
                    tx = transactions_1[_i];
                    if (!(tx.successful && tx.operation_count === 1)) return [3 /*break*/, 5];
                    return [4 /*yield*/, axios_1.default.get(tx._links.operations.href)];
                case 4:
                    operationsResponse = _b.sent();
                    operations = operationsResponse.data._embedded.records;
                    for (_a = 0, operations_1 = operations; _a < operations_1.length; _a++) {
                        op = operations_1[_a];
                        if (op.type === "payment" &&
                            op.to === WALLET_ADDRESS &&
                            op.amount === EXPECTED_AMOUNT) {
                            console.log("✅ Transazione valida trovata:", tx.hash);
                            return [2 /*return*/];
                        }
                    }
                    _b.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6:
                    console.log("⚠️ Nessuna transazione valida trovata.");
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _b.sent();
                    console.error("❌ Errore durante il controllo delle transazioni:", error_1);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
checkTransactions();
