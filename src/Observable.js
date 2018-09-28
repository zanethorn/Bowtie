var Bowtie;
(function (Bowtie) {
    class Observable {
        constructor(state) {
            this._eventListeners = {};
            if (state instanceof Observable) {
                return state;
            }
            if (!state) {
                state = {};
            }
            this._state = state;
        }
        get state() {
            return this._state;
        }
        getValue(key) {
            return this._state[key];
        }
        setValue(key, value) {
            if (this._state[key] !== value) {
                let previousValue = this._state[key];
                this._state[key] = value;
                this.dispatchEvent(new CustomEvent("changed", {
                    detail: {
                        propertyName: key,
                        previousValue: previousValue,
                        newValue: value
                    }
                }));
            }
        }
        addEventListener(type, listener, options) {
            if (!(type in this._eventListeners)) {
                this._eventListeners[type] = [];
            }
            this._eventListeners[type].push(listener);
        }
        dispatchEvent(evt) {
            if (!(event.type in this._eventListeners)) {
                return true;
            }
            var stack = this._eventListeners[event.type].slice();
            for (var i = 0, l = stack.length; i < l; i++) {
                stack[i].call(this, event);
            }
            return !event.defaultPrevented;
        }
        removeEventListener(type, listener, options) {
            if (!(type in this._eventListeners)) {
                return;
            }
            var stack = this._eventListeners[type];
            for (var i = 0, l = stack.length; i < l; i++) {
                if (stack[i] === listener) {
                    stack.splice(i, 1);
                    return;
                }
            }
        }
    }
    Bowtie.Observable = Observable;
})(Bowtie || (Bowtie = {}));
//# sourceMappingURL=Observable.js.map