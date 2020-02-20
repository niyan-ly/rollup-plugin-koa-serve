interface IOptions {
    proxy: {
        [index: string]: string;
    };
    proxyConfig: {
        jar: boolean;
        suppressRequestHeaders?: string[];
        suppressResponseHeaders?: string[];
        overrideResponseHeaders?: any;
        followRedirect?: boolean;
    };
    static: string;
    port: boolean;
    headers: {
        [index: string]: string;
    };
}
export default function (opt: IOptions): {
    writeBundle(): void;
};
export {};
