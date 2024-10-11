"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
require('dotenv').config({ path: `../${process.env.NODE_ENV}.env` });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    app.use((0, cookie_parser_1.default)());
    app.useGlobalPipes(new common_1.ValidationPipe({
        stopAtFirstError: true,
        transform: true,
        exceptionFactory: (errors) => {
            const customErrors = [];
            errors.forEach(e => {
                const keys = Object.keys(e.constraints);
                keys.forEach(k => {
                    customErrors.push({
                        message: e.constraints[k],
                        field: e.property,
                    });
                });
            });
            throw new common_1.BadRequestException(customErrors);
        }
    }));
    await app.listen(process.env.PORT);
    console.log(`Server listening on port: ${process.env.PORT}`);
}
bootstrap();
//# sourceMappingURL=main.js.map