Object.defineProperty(dragonBones.ArmatureDisplay.prototype, "dragonAsset", {
    get: function () {
        return this._N$dragonAsset;
    },
    set: function (value) {
        var oldValue = this._N$dragonAsset;
        this._N$dragonAsset = value;
        //资源引用计数-1
        oldValue && cc.LOADER_DELEGATE && cc.loader.release(oldValue);
        this._refresh();
        if (CC_EDITOR) {
            this._defaultArmatureIndex = 0;
            this._animationIndex = 0;
        }
        //资源引用计数+1
        if(value){
            cc.LOADER_DELEGATE && cc.loader.retain(value);
        }else{
            this._armature && this._factory._dragonBones.clock.remove(this._armature);
        }
    },
});

Object.defineProperty(dragonBones.ArmatureDisplay.prototype, "dragonAtlasAsset", {
    get: function () {
        return this._N$dragonAtlasAsset;
    },
    set: function (value) {
        var oldValue = this._N$dragonAtlasAsset;
        this._N$dragonAtlasAsset = value;
        this._factroy = null;
        //资源引用计数-1
        oldValue && cc.LOADER_DELEGATE && cc.loader.release(oldValue);
        this._parseDragonAtlasAsset();
        this._refresh();
        this._activateMaterial();
        //资源引用计数+1
        //资源引用计数+1
        if(value){
            cc.LOADER_DELEGATE && cc.loader.retain(value);
        }else{
            this._armature && this._factory._dragonBones.clock.remove(this._armature);
        }
    },
});

