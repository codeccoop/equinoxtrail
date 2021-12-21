var ScrollHandler = (function () {
    // PRIVATE BLOCK CODE
    
    // SCROLL HANDLER
    return function ScrollHandler () {
        var listeners = new Object ();
        var contexts = new Object();

        function scroll (ev) {
            Object.keys(listeners).map(function (fnName) {
                listeners[fnName].call(contexts[fnName], ev);
            });
        }
        
        this.onScroll = function (fn, context) {
            if (!fn.name) {
                throw new Error('bindend function must be named');
            } else {
                listeners[fn.name] = fn;
                contexts[context] = context;
            }
        }

        this.offScroll = function (fn) {
            if (!fn.name) {
                throw new Error('bindend function must be named');
            } else {
                delete listeners[fn.name];
                delete contexts[context];
            }
        }

        this.scroll = function (top, left) {
            window.scroll({
                top: top,
                left: left,
                behavior: 'smooth'
            });
        }

        this.scrollBy = function (top, left) {
            window.scrollBy({
                top: top,
                left: left,
                behavior: 'smooth'
            })
        }

        window.addEventListener('scroll', function (ev) {
            scroll(ev);
        });

        HTMLElement.prototype.onScroll = this.onScroll;
        HTMLElement.prototype.offScroll = this.offScroll;

        return this;
    }
})();