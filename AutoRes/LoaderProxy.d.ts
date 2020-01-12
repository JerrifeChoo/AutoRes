declare namespace cc {

    // export type ProgressCallback = (completedCount: number, totalCount: number, item: any) => void;
    // export type CompleteCallback = (error: Error, resource: any) => void;
    // export type DirCompleteCallback = (error: Error, resource: any[], urls: string[]) => void;
    /**
     * cc.loader代理类
     * don't call the class directly,should add function define which will be a proxy of cc.loader's method
     * @export
     * @class LoaderProxy
     * @exsample 
     * class LoaderDelegate extends cc.LoaderProxy {
     *      load(...){...}
     *      loadRes(...){...}
     *      loadResArray(...){...}
     * }
     * cc.loaderProxy = new Delegate();
     */
    export class LoaderProxy {
        _cache: any;
        protected _getReferenceKey(assetOrUrlOrUuid: cc.Asset | cc.RawAsset | string): string;
        // protected onProgress: any;
        getDependsRecursively(owner: Asset | RawAsset | String): Array<string>;
        load(resources: string | string[] | { uuid?: string, url?: string, type?: string }, progressCallback: Function, completeCallback: Function | null): void;
        release(asset: Asset | RawAsset | String | Array): void;
        releaseAll(): void;
        removeItem(id: string): boolean;
        clear(): void;
    }
    /**
    * cc.loader代理对象
    * @export
    * @var loaderProxy
    */
    export var loaderProxy: LoaderProxy;
}
