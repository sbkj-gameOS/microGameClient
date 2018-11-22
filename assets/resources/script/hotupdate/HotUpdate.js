var UpdatePanel = require('./UpdatePanel');

// Custom manifest removed the following assets:
// 1. res/raw-assets/textures/UI/chat/button_orange.png
// 2. res/raw-assets/textures/UI/chat/gb_inputbox.png
// So when custom manifest used, you should be able to find them in downloaded remote assets
/*
* packageUrl         远程资源的本地缓存根路径
* remoteVersionUrl   [可选项] 远程版本文件的路径，用来判断服务器端是否有新版本的资源
* remoteManifestUrl  远程资源 Manifest 文件的路径，包含版本信息以及所有资源信息
*/
var customManifestStr = JSON.stringify({
    "packageUrl": "http://game.bizpartner.cn/ch/remote-assets/",
    "remoteManifestUrl": "http://game.bizpartner.cn/ch/remote-assets/project.manifest",
    "remoteVersionUrl": "http://game.bizpartner.cn/ch/remote-assets/version.manifest",
    "version": "1.0.0",
    "assets":{},
    "searchPaths": []
});

// var customManifestStr = ''
cc.Class({
    extends: cc.Component,

    properties: {
        panel: UpdatePanel,// 提示检查更新的UI
        manifestUrl: cc.RawAsset,// assets目录下生成的project.mainfest
        updateUI: cc.Node,//更新提示的遮罩层
        _updating: false,
        _canRetry: false,
        _storagePath: ''
    },
     // use this for initialization
    onLoad: function () {
        // Hot update is only available in Native build
        // 热更新只能在原生包中构建运行
        if (!cc.sys.isNative) {
            return;
        }
        // 1、本地路径
        this._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + 'blackjack-remote-asset');


        // 2、本地版本和服务端版本进行比较
        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        // 本地版本A，远程版本       
        this.versionCompareHandle = function (versionA, versionB) {
            cc.log('本地版本',versionA);
            cc.log('远程版本',versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i] || 0);
                if (a === b) {
                    continue;
                }
                else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                if (cc.find('Canvas/update')) {
                    cc.find('Canvas/update').active = true;
                }
                return -1;
            }
            else {
                return 0;
            }
        };

        // 3、注册热更新管理器
        // Init with empty manifest url for testing custom manifest
        this._am = new jsb.AssetsManager('', this._storagePath, this.versionCompareHandle);
        if (!cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            // this._am.retain();
        }

        var panel = this.panel;
        // Setup the verification callback, but we don't have md5 check function yet, so only print some message
        
        // Return true if the verification passed, otherwise return false
        this._am.setVerifyCallback(function (path, asset) {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            var compressed = asset.compressed;
            // Retrieve the correct md5 value.
            var expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            var relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            var size = asset.size;
            if (compressed) {
                panel.info.string = "Verification passed : " + relativePath;
                return true;
            }
            else {
                panel.info.string = "Verification passed : " + relativePath + ' (' + expectedMD5 + ')';
                return true;
            }
        });

        // this.panel.info.string = 'Hot update is ready, please check or directly update.';
        this.panel.info.string = '有新版本，请检测新版本或者直接下载更新！';

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            // The value may not be accurate, please do more test and find what's most suitable for your game.
            this._am.setMaxConcurrentTask(2);
            this.panel.info.string = "Max concurrent tasks count have been limited to 2";
        }
        
        this.panel.fileProgress.progress = 0;
        this.panel.byteProgress.progress = 0;
    },
    /*检查更新回调*/
    checkCb: function (event) {
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                // this.panel.info.string = "No local manifest file found, hot update skipped.";
                this.panel.info.string = "未找到mainfest文件，热更新失败！";
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                this.panel.info.string = "下载服务器上的远程资源manifest到临时文件失败，或者解析时出错！";
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                this.panel.info.string = "Already up to date with the latest remote version.";
                // this.panel.info.string = "检测到新版本！";
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this.panel.info.string = '检测到新版本，请进行更新！';
                this.panel.checkBtn.active = false;
                this.panel.fileProgress.progress = 10;
                this.panel.byteProgress.progress = 0;
                break;
            default:
                return;
        }
        
        cc.eventManager.removeListener(this._checkListener);
        this._checkListener = null;
        this._updating = false;
    },

    updateCb: function (event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode())
        {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                this.panel.info.string = '没有找到mainfest文件，跳过更新';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                this.panel.byteProgress.progress = event.getPercent();
                this.panel.fileProgress.progress = event.getPercentByFile();

                this.panel.fileLabel.string = event.getDownloadedFiles() + ' / ' + event.getTotalFiles();
                this.panel.byteLabel.string = event.getDownloadedBytes() + ' / ' + event.getTotalBytes();

                var msg = event.getMessage();
                if (msg) {
                    this.panel.info.string = 'Updated file: ' + msg;
                    // cc.log(event.getPercent()/100 + '% : ' + msg);
                }
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                // this.panel.info.string = 'Fail to download manifest file, hot update skipped.';
                this.panel.info.string = '下载失败！';
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                // this.panel.info.string = 'Already up to date with the latest remote version.';
                this.panel.info.string = '已经最新版本';
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                // this.panel.info.string = 'Update finished. ' + event.getMessage();
                this.panel.info.string = '更新完成，正在重启游戏！';
                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                // this.panel.info.string = 'Update failed. ' + event.getMessage();
                this.panel.info.string = '更新失败';
                this.panel.retryBtn.active = true;
                this._updating = false;
                this._canRetry = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                // this.panel.info.string = 'Asset update error: ' + event.getAssetId() + ', ' + event.getMessage();
                this.panel.info.string = '资源加载失败';
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                this.panel.info.string = event.getMessage();
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            this._updating = false;
        }

        // 重新启动游戏
        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
            // Prepend the manifest's search path
            var searchPaths =
             jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            console.log(JSON.stringify(newPaths));
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.audioEngine.stopAll();
            cc.game.restart();
        }
    },
    /*自定义配置*/
    loadCustomManifest: function () {
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            var manifest = new jsb.Manifest(customManifestStr, this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
            this.panel.info.string = 'Using custom manifest';
        }
    },
    
    retry: function () {
        if (!this._updating && this._canRetry) {
            this.panel.retryBtn.active = false;
            this._canRetry = false;
            
            this.panel.info.string = 'Retry failed Assets...';
            this._am.downloadFailedAssets();
        }
    },
    /*检查更新*/
    checkUpdate: function () {
        if (this._updating) {
            // this.panel.info.string = 'Checking or updating ...';
            this.panel.info.string = '检查更新中...';
            return;
        }
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            this._am.loadLocalManifest(this.manifestUrl);
        }
        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            // this.panel.info.string = 'Failed to load local manifest ...';
            this.panel.info.string = '加载本地manifest失败 ...';
            return;
        }
        this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
        cc.eventManager.addListener(this._checkListener, 1);

        this._am.checkUpdate();
        this._updating = true;
    },
    /*开始更新*/
    hotUpdate: function () {
        if (this._am && !this._updating) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                this._am.loadLocalManifest(this.manifestUrl);
            }

            this._failCount = 0;
            this._am.update();
            this.panel.updateBtn.active = false;
            this._updating = true;
        }
    },
    show: function () {
        if (this.updateUI.active === false) {
            this.updateUI.active = true;
        }
    },
    onDestroy: function () {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
    }
});
