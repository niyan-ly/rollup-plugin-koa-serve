# rollup-plugin-koa-serve
The modern version of dev server for rollup

### Usage

```js
import serve from 'rollup-plugin-koa-serve';

module.exports = {
    plugins: [
        serve({
            proxy: {
                api: 'http://others.com'
            }
            // options here...
        })
    ]
}
```

### supported options

```typescript
interface IOptions {
  proxy: {
    [index: string]: string;// proxy map
  };
  proxyConfig: {
    //   thoese options is basically inherited from koa-proxy
    jar: boolean; // should send cookie to target server
    suppressRequestHeaders?: string[]; // case-insensitive
    suppressResponseHeaders?: string[]; // case-insensitive
    overrideResponseHeaders?: any;
    followRedirect?: boolean;
  };
  static: string; // static root, like [public]
  port: boolean;
  headers: {
    [index: string]: string; // will send to target server
  }
}
```