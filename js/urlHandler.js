var UrlHandler = (function () {
    var lastState, currentState = {};
    return function UrlHandler () {
        window.onpopstate = function (ev) {
            console.log(ev);
        }

        this.navigate = function (hash, config) {
            hash = '#'.indexOf(hash) == 0 ? hash : '#' + hash;
            lastState = currentState;
            currentState = {
                prev: lastState,
                hash: hash
            }
            lastState.replacedBy = currentState;
            
            if (config.silence) {
                history.pushState(currentState, 'nav to section', hash);
            } else {
                location.hash = hash;
                history.pushState(currentState, 'nav to section', hash);
            }
        }
    }
})();