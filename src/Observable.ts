namespace Bowtie {

    export class Observable implements EventTarget {
        private _state: any;
        private _eventListeners = {};

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

        onchanged: EventHandler;

        change(key: string, value: any): void {
            let existing = this._state[key];
            if (existing !== value) {
                this._state[key] = value;
                this.onchanged();
            }
        }

        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void {
            throw new Error("Method not implemented.");
        }
        dispatchEvent(evt: Event): boolean {
            throw new Error("Method not implemented.");
        }
        removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void {
            throw new Error("Method not implemented.");
        }

    }

}