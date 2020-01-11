/*
 * @Author: zjf
 * @Date: 2020-01-10 19:17:03
 * @Last Modified by: zjf
 * @Last Modified time: 2020-01-10 19:17:03
 * @Copyright(c) 2019, cxx All rights reserved.
 */
cc.Animation.prototype.addClip = function addClip(clip, newName) {
    if (!clip) {
        cc.warnID(3900);
        return;
    }
    this._init();
    if (!cc.js.array.contains(this._clips, clip)) {
        this._clips.push(clip);
    }
    newName = newName || clip.name;
    var oldState = this._nameToState[newName];
    if (oldState) {
        if (oldState.clip === clip) {
            return oldState;
        } else {
            var index = this._clips.indexOf(oldState.clip);
            if (index !== -1) {
                let oldClip = this._clips.splice(index, 1);
                cc.LOADER_DELEGATE && cc.loader.release(oldClip);
            }
        }
    }
    var newState = new cc.AnimationState(clip, newName);
    this._nameToState[newName] = newState;
    cc.LOADER_DELEGATE && cc.loader.retain(clip);
    return newState;
};

cc.Animation.prototype.removeClip = function removeClip(clip, force) {
    if (!clip) {
        cc.warnID(3901);
        return;
    }
    this._init();
    var state = void 0;
    for (var name in this._nameToState) {
        state = this._nameToState[name];
        var stateClip = state.clip;
        if (stateClip === clip) {
            break;
        }
    }
    if (clip === this._defaultClip) {
        if (force)
            this._defaultClip = null;
        else {
            if (!CC_TEST)
                cc.warnID(3902);
            return;
        }
    }
    if (state && state.isPlaying) {
        if (force)
            this.stop(state.name);
        else {
            if (!CC_TEST)
                cc.warnID(3903);
            return;
        }
    }
    this._clips = this._clips.filter(function (item) {
        return item !== clip;
    });
    if (state) {
        delete this._nameToState[state.name];
        cc.LOADER_DELEGATE && cc.loader.release(state.clip);
    }
};