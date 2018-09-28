namespace Bowtie {

    export class Observable implements EventTarget {
        private _state: any;
        private _eventListeners: any = {};

        constructor(state?: any) {
            if (state instanceof Observable) {
                return state;
            }

            if (!state) {
                state = {}
            }

            this._state = state;
        }

        get state(): any {
            return this._state;
        }

        getValue(key: string): any {
            return this._state[key];
        }

        setValue(key: string, value: any): void {
            if (this._state[key] !== value) {
                let previousValue = this._state[key];
                this._state[key] = value;
                this.dispatchEvent(
                    new CustomEvent(
                        "changed",
                        {
                            detail: {
                                propertyName: key,
                                previousValue: previousValue,
                                newValue: value
                            }
                        }
                    )
                );
            }
        }

        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
            if (!(type in this._eventListeners)) {
                this._eventListeners[type] = [];
            }
            this._eventListeners[type].push(listener);
        }
        dispatchEvent(evt: Event): boolean {
            if (!(event.type in this._eventListeners)) {
                return true;
            }
            var stack = this._eventListeners[event.type].slice();

            for (var i = 0, l = stack.length; i < l; i++) {
                stack[i].call(this, event);
            }
            return !event.defaultPrevented;
        }
        removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
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

}