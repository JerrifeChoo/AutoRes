Object.defineProperty(sp.Skeleton.prototype, "skeletonData", {
    get: function () {
        return this._N$skeletonData;
    },
    set: function (value) {
        var oldValue = this._N$skeletonData;
        this._N$skeletonData = value;
        //资源引用计数-1
        oldValue && cc.LOADER_DELEGATE && cc.loader.release(oldValue);
        this.defaultSkin = '';
        this.defaultAnimation = '';
        if (CC_EDITOR) {
            this._refreshInspector();
        }
        this._updateSkeletonData();
        if (value) {
            //资源引用计数+1
            cc.LOADER_DELEGATE && cc.loader.retain(value);
        } else {
            this["_skeleton"] = null;
            this["_clipper"] = null;
            this["_rootBone"] = null;
            this["_resetAssembler"]();
        }
    },
});
