/*
 * @Author: zjf
 * @Date: 2020-01-10 19:17:07
 * @Last Modified by: zjf
 * @Last Modified time: 2020-01-10 19:17:07
 * @Copyright(c) 2019, cxx All rights reserved.
 */
let __destroyImmediate = cc.Object.prototype._destroyImmediate;
cc.Object.prototype._destroyImmediate = function () {
    if (cc.LOADER_DELEGATE) {
        //精灵引用计数-1
        if (this instanceof cc.Sprite) {
            this.spriteFrame = null;
        }
        //spine引用计数-1
        else if (this instanceof sp.Skeleton) {
            this.skeletonData = null;
        }
        //龙骨引用计数-1
        else if (this instanceof dragonBones.ArmatureDisplay) {
            this.dragonAsset = null;
            this.dragonAtlasAsset = null;
        }
        else if (this instanceof cc.Animation){
            while(this._clips && this._clips.length){
                let clip = this._clips[0];
                this.removeClip(clip, true);
            }
            // cc.LOADER_DELEGATE && cc.loader.release(this);
        }
    }
    __destroyImmediate.call(this);
};