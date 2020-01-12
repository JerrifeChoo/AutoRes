Object.defineProperty(cc.Sprite.prototype, "spriteFrame", {
    get: function () {
        return this._spriteFrame;
    },
    set: function (value, force) {
        var lastSprite = this._spriteFrame;
        if (CC_EDITOR) {
            if (!force && ((lastSprite && lastSprite._uuid) === (value && value._uuid))) {
                return;
            }
        }
        else {
            if (lastSprite === value) {
                return;
            }
        }
        this._spriteFrame = value;
        //资源引用计数+1
        value && cc.LOADER_DELEGATE && cc.loader.retain(value);
        // render & update render data flag will be triggered while applying new sprite frame
        this.markForUpdateRenderData(false);
        this._applySpriteFrame(lastSprite);
        if (CC_EDITOR) {
            this.node.emit('spriteframe-changed', this);
        }
        //资源引用计数-1
        lastSprite && cc.LOADER_DELEGATE && cc.loader.release(lastSprite);
    },
    type: cc.SpriteFrame,
});
