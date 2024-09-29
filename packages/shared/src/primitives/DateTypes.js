"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeYear = void 0;
function makeYear(value) {
    const currentYear = new Date().getFullYear();
    if (value < 1900 || value > currentYear + 10) {
        throw new Error(`Year must be between 1900 and ${currentYear + 10}`);
    }
    return value;
}
exports.makeYear = makeYear;
//# sourceMappingURL=DateTypes.js.map