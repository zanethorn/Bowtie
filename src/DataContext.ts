namespace Bowtie {

    export class DataContext {

        private _data: Observable;
        private _element: Element;
        private _parent: DataContext;

        constructor(data: Observable, element: Element, parent?: DataContext) {
            if (!parent) {
                parent = this;
            }

            this._data = data;
            this._element = element;
            this._parent = parent;
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

        get root(): DataContext {
            if (this._parent === this) {
                return this;
            }
            return this._parent.root;
        }
    }

}