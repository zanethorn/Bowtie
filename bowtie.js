var Bowtie;
(function (Bowtie) {
    class DataContext {
        constructor(data, element, token, parent) {
            if (!parent) {
                parent = this;
            }
            this._data = data;
            this._element = element;
            this._parent = parent;
            this._token = token;
        }
        get data() {
            return this._data;
        }
        get element() {
            return this._element;
        }
        get parent() {
            return this._parent;
        }
        get token() {
            return this._token;
        }
        get root() {
            if (this._parent === this) {
                return this;
            }
            return this._parent.root;
        }
        getContext(element, path) {
            if (!path) {
                return this;
            }
            let segments = path.split(".");
            let token = segments[0];
            let remainder = null;
            if (segments.length > 1) {
                remainder = segments.slice(1).join(".");
            }
            if (token === "") {
                return this.root.getContext(element, remainder);
            }
            let data = new Bowtie.Observable(this.data.getValue(token));
            let ctx = new DataContext(data, element, token, this);
            if (remainder) {
                return ctx.getContext(element, remainder);
            }
            return ctx;
        }
    }
    Bowtie.DataContext = DataContext;
})(Bowtie || (Bowtie = {}));
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
var Bowtie;
(function (Bowtie) {
    function bindInternal(context, element) {
        let contextAttr = element.getAttribute("data-context");
        if (contextAttr) {
            context = context.getContext(element, contextAttr);
        }
        let attributeNames = element.getAttributeNames();
        for (let name of attributeNames) {
            if (name.startsWith("data-bind-")) {
                var value = element.getAttribute(name);
            }
        }
        for (let child of element.childNodes) {
            if (child instanceof Element) {
                bindInternal(context, child);
            }
        }
    }
    function tie(data) {
        let observableData = new Bowtie.Observable(data);
        let body = document.body;
        let context = new Bowtie.DataContext(observableData, body, null);
        bindInternal(context, body);
    }
    Bowtie.tie = tie;
})(Bowtie || (Bowtie = {}));
//# sourceMappingURL=bowtie.js.map