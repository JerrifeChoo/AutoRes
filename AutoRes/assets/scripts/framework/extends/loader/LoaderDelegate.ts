/*
 * @Author: zjf
 * @Date: 2019-11-28 16:38:51
 * @Last Modified by: zjf
 * @Last Modified time: 2020-01-10 14:51:18
 * @Copyright(c) 2019, cxx All rights reserved.
 */

//defined cc.LoaderProxy first;
import LoaderProxy = require("./LoaderProxy");
LoaderProxy;

export type AssetRef = {
    count: number;
    autoRelease: boolean;
}

export default class LoaderDelegate extends cc.LoaderProxy {
    private _resRef: Map<string, AssetRef>;
    private _autoRelease: boolean;

    private onLoaded(error: Error, resource: any) {
        if (error) {

        } else {
            if (resource) {
                this.retain(resource);
            }
        }
    }

    load(resources: string | string[] | { uuid?: string, url?: string, type?: string }, progressCallback: Function, completeCallback: Function | null): void {
        if (completeCallback === void 0) {
            let comp: Function = progressCallback;
            progressCallback = (error: Error, resource: any) => {
                this.onLoaded(error, resource);
                comp && comp.bind(this)(error, resource);
            }
        } else {
            let comp: Function = completeCallback;
            completeCallback = (error: Error, resource: any) => {
                this.onLoaded(error, resource);
                comp && comp.bind(this)(error, resource);
            }
        }
        super.load(resources, progressCallback, completeCallback);
    }

    set autoRelease(auto: boolean) {
        if (!this._resRef) return;
        this._autoRelease = auto;
        let iterator = this._resRef.keys();
        let r: IteratorResult<string>;
        while (r = iterator.next(), !r.done) {
            let url = r.value;
            let assetRef = this._resRef.get(url);
            if (assetRef.count <= 0) {
                this.release(url);
            } else {
                assetRef.autoRelease = true;
            }
        }
    }

    get autoRelease(): boolean {
        return this._autoRelease;
    }

    release(asset: cc.Asset | cc.RawAsset | string | any[]): void {
        if (Array.isArray(asset)) {
            for (let i = 0; i < asset.length; i++) {
                var key = asset[i];
                this.release(key);
            }
        }
        else if (asset) {
            var id = this._getReferenceKey(asset);
            let assets = this.getDependsRecursively(id);
            if (assets) {
                if (this._resRef) {
                    for (let value of assets) {
                        if (!this._cache[value]) continue;
                        let assetRef = this._resRef.get(value);
                        if (assetRef) {
                            if (assetRef.count > 0) {
                                assetRef.count--;
                            }
                            if (assetRef.count <= 0) {
                                this._resRef.delete(value);
                                super.release(value);
                            }
                        } else {
                            super.release(value);
                        }
                    }
                } else {
                    super.release(asset);
                }
            }
        }
    }

    retain(asset: cc.Asset | cc.RawAsset | string | any | any[]): void {
        if (Array.isArray(asset)) {
            for (let i = 0; i < asset.length; i++) {
                var key = asset[i];
                this.retain(key);
            }
        }
        else if (asset) {
            if (typeof asset === "object") {
                if (asset.constructor && asset.constructor.name === "LoadingItems" && asset.map) {
                    for (let key in asset.map) {
                        this.retain(key);
                    }
                    return;
                } else if (asset.nativeUrl) {
                    asset = asset.nativeUrl;
                } else if (!asset["_uuid"]) {
                    return;
                }
            } else if (typeof asset !== "string")
                return;
            var id = this._getReferenceKey(asset);
            if (!id) {
                return
            };
            let assets = this.getDependsRecursively(id);
            for (let url of assets) {
                if (this._resRef === void 0)
                    this._resRef = new Map();
                let assetRef = this._resRef.get(url);
                if (assetRef) {
                    assetRef.count++;
                } else {
                    let ref: AssetRef = {
                        count: 1,
                        autoRelease: this._autoRelease
                    };
                    this._resRef.set(url, ref);
                }
            }
        }
    }

    relaseImmediately(url: string): void {
        this._resRef.delete(url);
        this.release(url);
    }

    releaseAllImmediately(): void {
        this._resRef.clear();
        super.releaseAll();
    }

    destroy(): void {

    }

    removeItem(id: string): boolean {
        let removed = super.removeItem(id);
        if (removed) {
            this._resRef && this._resRef.delete(id);
        }
        return removed;
    }

    clear() {
        super.clear();
        delete this._resRef;
    };
}

cc.loaderProxy = new LoaderDelegate(); // add proxy