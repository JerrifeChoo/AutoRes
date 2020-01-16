# AutoRes
Cocoscreator Resources  Automatic Reference Counting
该版本尚有bug，如要使用请按照以下几点思路更改。
1、LoaderDelegate去掉onLoaded监听，定制engine在uuid-loader.js 131行加上_prefab,_spriteFrame, _N$dragonAsset,_N$dragonAltlasAsset,_N$skeletonData
判断并retain ref。
2、需要自己写方法监听下载失败引用计数-1。
若要使用=赋值更新资源引用计数请修改以上两点。若不需要请删除extends下面node，sprite，animation，skeleton，dragon拓展。
