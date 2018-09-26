declare namespace Bowtie {
    class Observable implements EventTarget {
        private _state;
        private _eventListeners;
        constructor(state?: any);
        readonly state: any;
        getValue(key: string): any;
        setValue(key: string, value: any): void;
        addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
        dispatchEvent(evt: Event): boolean;
        removeEventListener(type: string, listener?: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    }
}
