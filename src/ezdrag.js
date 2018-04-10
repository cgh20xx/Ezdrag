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
        
    }

    // observer.js
    Observer(Ezdrag.prototype);

    Ezdrag.prototype.init = function() {
        // preload images qty
        this.el = this.setting.el && document.querySelector(this.setting.el);

        return this;
    };



    return Sprite;
})();