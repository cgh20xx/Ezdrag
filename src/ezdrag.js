/**
 *  ezdrag.js
 *
 *  Author : Hank Hsiao
 *  Version: 0.0.3
 *  Create : 2018.4.10
 *  Update : 2018.4.12
 *  License: MIT
 */

var Ezdrag = (function(window) {

    function Ezdrag(rootSelector, targetSelector) {
        this.rootSelector = rootSelector;
        this.targetSelector = targetSelector;
        this.roots = [].slice.call(document.querySelectorAll(this.rootSelector));
        this.items = [].slice.call(document.querySelectorAll(this.targetSelector));
        this._init();
    }

    // observer.js
    Observer(Ezdrag.prototype);

    Ezdrag.prototype._init = function() {
        this._onDown = this._onDown.bind(this);
        this._onMove = this._onMove.bind(this);
        this._onUp = this._onUp.bind(this);

        this.items.forEach(function(item) {
            item.ezdragData = {}; // custom dom data;
        }, this);

        this.roots.forEach(function(root) {    
            root.addEventListener('mousedown', this._onDown);
            root.addEventListener('touchstart', this._onDown);
        }, this);

        
        return this;
    };

    Ezdrag.prototype._isItem = function(item) {
        if (/^#/i.test(this.targetSelector) && item.id === this.targetSelector.slice(1)) {
            // console.log('find id');
            return true;
        } else if (/^\./i.test(this.targetSelector) && item.className.indexOf(this.targetSelector.slice(1)) != -1) {
            // console.log('find class');
            return true;
        } else if (this.targetSelector === item.tagName.toLowerCase()) {
            // console.log('find tag');
            return true;
        }      
        return false;
    };

    Ezdrag.prototype._onDown = function(e) {
        e.preventDefault();
        var item = e.target;

        if (!this._isItem(item)) {
            return;
        }

        this.currentItem = item;

        var pageX = e.pageX;
        var pageY = e.pageY;
        if (e.touches) {
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
        }

        item.ezdragData.firstMove = true;
        item.ezdragData.dragX = item.ezdragData.dragX || 0;
        item.ezdragData.dragY = item.ezdragData.dragY || 0;
        item.ezdragData.x0 = item.ezdragData.oldX = pageX;
        item.ezdragData.y0 = item.ezdragData.oldY = pageY;
        this.roots.forEach(function(root, index) {
            root.addEventListener('mousemove', this._onMove);
            root.addEventListener('mouseup', this._onUp);
            root.addEventListener('touchmove', this._onMove);
            root.addEventListener('touchend', this._onUp);
        }, this);
    };

    Ezdrag.prototype._onMove = function(e) {
        e.preventDefault();

        var pageX = e.pageX;
        var pageY = e.pageY;
        if (e.touches) {
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
        }

        var customEvent = {};
        customEvent.target = this.currentItem

        customEvent.dx = this.currentItem.ezdragData.dx = pageX - this.currentItem.ezdragData.oldX;
        customEvent.dy = this.currentItem.ezdragData.dy = pageY - this.currentItem.ezdragData.oldY;

        this.currentItem.ezdragData.dragX += this.currentItem.ezdragData.dx;
        this.currentItem.ezdragData.dragY += this.currentItem.ezdragData.dy;

        customEvent.dragX = this.currentItem.ezdragData.dragX;
        customEvent.dragY = this.currentItem.ezdragData.dragY;

        this.currentItem.ezdragData.oldX = customEvent.pageX = pageX;
        this.currentItem.ezdragData.oldY = customEvent.pageY = pageY;

        if (this.currentItem.ezdragData.firstMove) {
            this.trigger('drag.start', customEvent);
            this.currentItem.ezdragData.firstMove = false;
        } else {
            this.trigger('drag.move', customEvent);
        }
    };

    Ezdrag.prototype._onUp = function(e) {
        e.preventDefault();

        var customEvent = {};
        customEvent.target = this.currentItem;

        this.trigger('drag.end', customEvent);
        
        this.roots.forEach(function(root, index) {
            root.removeEventListener('mousemove', this._onMove);
            root.removeEventListener('mouseup', this._onUp);
            root.removeEventListener('touchmove', this._onMove);
            root.removeEventListener('touchend', this._onUp);
        }, this);
    };

    return Ezdrag;
})(window);