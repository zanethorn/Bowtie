namespace Bowtie {

    export class DataContext {

        private readonly _data: Observable;
        private readonly _element: Element;
        private readonly _parent: DataContext;
        private readonly _token: string;

        constructor(data: Observable, element: Element, token?:string, parent?: DataContext) {
            if (!parent) {
                parent = this;
            }

            this._data = data;
            this._element = element;
            this._parent = parent;
            this._token = token;
        }

        get data(): Observable {
            return this._data;
        }

        get element(): Element {
            return this._element;
        }

        get parent(): DataContext {
            return this._parent;
        }

        get token(): string {
            return this._token;
        }

        get root(): DataContext {
            if (this._parent === this) {
                return this;
            }
            return this._parent.root;
        }

        getContext(element: Element, path:string):DataContext {
            if (!path){
                return this;
            }

            let segments = path.split(".");
            let token = segments[0];
            let remainder = null;
            
            if (segments.length > 1) {
                remainder = segments.slice(1).join(".");
            }

            if (token === ""){
                return this.root.getContext(element, remainder);
            }

            let data = new Observable(this.data.getValue(token));
            let ctx = new DataContext(data, element, token, this);

            if (remainder) {
                return ctx.getContext(element, remainder);
            }

            return ctx;
        }
    }

}