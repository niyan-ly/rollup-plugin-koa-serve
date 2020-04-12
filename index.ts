import koa from "koa";
import koaStatic from "koa-static";
import proxy from "koa-proxy";

interface IOptions {
  proxy: {
    [index: string]: string;
  };
  proxyConfig: {
    jar: boolean;
    suppressRequestHeaders?: string[]; // case-insensitive
    suppressResponseHeaders?: string[]; // case-insensitive
    overrideResponseHeaders?: any;
    followRedirect?: boolean;
  };
  static: string;
  port: boolean;
  headers: {
    [index: string]: string;
  }
}

export default function(opt: IOptions) {
  let isListenning = false;
  const app = new koa();

  app.use((ctx, next) => {
    Object.assign(ctx.request.header, opt.headers);

    return next();
  });
  app.use(koaStatic(opt.static, {
    setHeaders(res) {
      res.setHeader("Access-Control-Allow-Origin", "*");
    }
  }));
  app.use(async (ctx, next) => {
    /** pass if static middleware could handle */
    await next();

    console.log(`[koa serve]${ctx.method} ${ctx.originalUrl}`)
    for (const key in opt.proxy) {
      if (ctx.path.includes(key)) {
        const proxyHandler = proxy({
          host: opt.proxy[key],
          ...opt.proxyConfig
        });

        return proxyHandler(ctx, next);
      }
    }
  });

  return {
    writeBundle() {
      if (isListenning) return;

      app.listen(opt.port, () => {
        isListenning = true;
        console.log(`rollup koa server is running@${opt.port}`);
      });
    }
  };
}
