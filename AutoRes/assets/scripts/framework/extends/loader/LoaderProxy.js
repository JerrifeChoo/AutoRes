function LoaderProxy() {
    let protos = Object.getOwnPropertyNames(cc.loader);
    for (let key in protos) {
        this[protos[key]] = cc.loader[protos[key]];
    }
};
cc.js.extend(LoaderProxy, cc.loader.constructor);

/**
 * 
 * callcel all incomplete loading
 * 
 */
LoaderProxy.prototype.cancelAllIncompleteLoading = function () {
    let canceledCount = 0;
    console.log("start cancelAllIncompleteLoading.");
    try {
        for (var id in this._cache) {
            var item = this._cache[id];
            if (item && !item.complete) {
                delete this._cache[id];
                item.error = new Error(CommonConst.CancelDownloadSign);
                // console.log("cancel incomplete load item:", item);
                try {
                    this.flowOut(item);
                } catch (e) {
                    console.error("cancel loaded item error:", e, " item:", item);
                }
                canceledCount++;
            }
        }
    } catch (e) {
        console.error("cancelAllIncompleteLoading error:", e);
    }
    if (canceledCount > 0) {
        console.warn("cc loader canceled loading count:", canceledCount);
    }
};

function isScene(asset) {
    return asset && (asset.constructor === cc.SceneAsset || asset instanceof cc.Scene);
};

cc.AssetLibrary.loadAsset = function (uuid, callback, options) {
    if (typeof uuid !== 'string') {
        return callInNextTick(callback, new Error('[AssetLibrary] uuid must be string'), null);
    }
    // var readMainCache = typeof (options && options.readMainCache) !== 'undefined' ? readMainCache : true;
    // var writeMainCache = typeof (options && options.writeMainCache) !== 'undefined' ? writeMainCache : true;
    var item = {
        uuid: uuid,
        type: 'uuid'
    };
    if (options && options.existingAsset) {
        item.existingAsset = options.existingAsset;
    }
    cc.loader.load(item, function (error, asset) {
        if (error || !asset) {
            let errorInfo = typeof error === 'string' ? error : (error ? (error.message || error.errorMessage || JSON.stringify(error)) : 'Unknown error');
            error = new Error('[AssetLibrary] loading JSON or dependencies failed:' + errorInfo);
        }
        else {
            if (asset.constructor === cc.SceneAsset) {
                if (CC_EDITOR && !asset.scene) {
                    Editor.error('Sorry, the scene data of "%s" is corrupted!', uuid);
                }
                else {
                    var key = cc.loader._getReferenceKey(uuid);
                    asset.scene.dependAssets = cc.loader.getDependsRecursively(key);
                }
            }
            if (CC_EDITOR || isScene(asset)) {
                var id = cc.loader._getReferenceKey(uuid);
                cc.loader.removeItem(id);
            }
        }
        if (callback) {
            callback(error, asset);
        }
    });
};

cc.AssetLibrary.loadJson = function (json, callback) {
    var randomUuid = '' + ((new Date()).getTime() + Math.random());
    var item = {
        uuid: randomUuid,
        type: 'uuid',
        content: json,
        skips: [cc.loader.assetLoader.id, cc.loader.downloader.id]
    };
    cc.loader.load(item, function (error, asset) {
        if (error) {
            error = new Error('[AssetLibrary] loading JSON or dependencies failed: ' + error.message);
        }
        else {
            if (asset.constructor === cc.SceneAsset) {
                var key = cc.loader._getReferenceKey(randomUuid);
                asset.scene.dependAssets = cc.loader.getDependsRecursively(key);
            }
            if (CC_EDITOR || isScene(asset)) {
                var id = cc.loader._getReferenceKey(randomUuid);
                cc.loader.removeItem(id);
            }
        }
        asset._uuid = '';
        if (callback) {
            callback(error, asset);
        }
    });
};

/**
* register cc.loaderProxy function:set get
* add proxy check defend redefine
*/
(function (proxy) {
    if (proxy) return;
    Object.defineProperty(cc, "loaderProxy", {
        set(proxy) {
            if (!this.__loader)
                this.__loader = this.loader;
            if (proxy) {
                this.loader = proxy;
                cc.LOADER_DELEGATE = true;
            } else {
                this.loader = this.__loader;
                delete this.__loader;
                cc.LOADER_DELEGATE = false;
            }
        },
    });
})(cc.LoaderProxy);
module.exports = cc.LoaderProxy = LoaderProxy;
