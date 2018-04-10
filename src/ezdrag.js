/**
 *  ezdrag.js
 *
 *  Author : Hank Hsiao
 *  Version: 0.0.1
 *  Create : 2018.4.10
 *  Update : 2018.4.10
 *  License: MIT
 */

var Ezdrag = (function() {

    function Ezdrag(selector) {
        this.items = [].slice.call(document.querySelectorAll(selector));
        this._init();
    }

    // observer.js
    Observer(Ezdrag.prototype);

    Ezdrag.prototype._init = function() {
        this.handleDown = this._onDown.bind(this);
        this.handleMove = this._onMove.bind(this);
        this.handleUp = this._onUp.bind(this);

        this.items.forEach(function(item, index) {
            item.ezdragData = {}; // custom dom data;
            item.addEventListener('mousedown', this.handleDown);
        }, this);
        return this;
    };

    Ezdrag.prototype._onDown = function(e) {
        var item = e.currentTarget;
        item.ezdragData.firstMove = true;
        item.ezdragData.dragX = item.ezdragData.dragX || 0;
        item.ezdragData.dragY = item.ezdragData.dragY || 0;
        item.ezdragData.x0 = item.ezdragData.oldX = e.pageX;
        item.ezdragData.y0 = item.ezdragData.oldY = e.pageY;
        item.addEventListener('mousemove', this.handleMove);
        item.addEventListener('mouseup', this.handleUp);
    };

    Ezdrag.prototype._onMove = function(e) {
        var item = e.currentTarget;
        e.dx = item.ezdragData.dx = e.pageX - item.ezdragData.oldX;
        e.dy = item.ezdragData.dy = e.pageY - item.ezdragData.oldY;

        item.ezdragData.dragX += item.ezdragData.dx;
        item.ezdragData.dragY += item.ezdragData.dy;

        e.dragX = item.ezdragData.dragX;
        e.dragY = item.ezdragData.dragY;

        item.ezdragData.oldX = e.pageX;
        item.ezdragData.oldY = e.pageY;
        // console.log(item.ezdragData.dx, item.ezdragData.dy);

        if (item.ezdragData.firstMove) {
            this.trigger('drag.start', e);
            item.ezdragData.firstMove = false;
        } else {
            this.trigger('drag.move', e);
        }
    };

    Ezdrag.prototype._onUp = function(e) {
        var item = e.currentTarget;
        this.trigger('drag.end', e);
        item.removeEventListener('mousemove', this.handleMove);
        item.removeEventListener('mouseup', this.handleUp);
    };

    return Ezdrag;
})();