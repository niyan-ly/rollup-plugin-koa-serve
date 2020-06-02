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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_proxy_1 = __importDefault(require("koa-proxy"));
function default_1(opt) {
    let isListenning = false;
    const app = new koa_1.default();
    app.use((ctx, next) => {
        Object.assign(ctx.request.header, opt.headers);
        return next();
    });
    app.use(koa_static_1.default(opt.static, {
        setHeaders(res) {
            res.setHeader("Access-Control-Allow-Origin", "*");
        }
    }));
    app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
        /** pass if static middleware could handle */
        yield next();
        ctx.res.setHeader("Access-Control-Allow-Origin", "*");
        console.log(`[koa serve]${ctx.method} ${ctx.originalUrl}`);
        for (const key in opt.proxy) {
            if (ctx.path.includes(key)) {
                const proxyHandler = koa_proxy_1.default(Object.assign({ host: opt.proxy[key] }, opt.proxyConfig));
                return proxyHandler(ctx, next);
            }
        }
    }));
    return {
        writeBundle() {
            if (isListenning)
                return;
            app.listen(opt.port, () => {
                isListenning = true;
                console.log(`rollup koa server is running@${opt.port}`);
            });
        }
    };
}
exports.default = default_1;
