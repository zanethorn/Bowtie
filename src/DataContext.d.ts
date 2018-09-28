declare namespace Bowtie {
    class DataContext {
        private readonly _data;
        private readonly _element;
        private readonly _parent;
        private readonly _token;
        constructor(data: Observable, element: Element, token?: string, parent?: DataContext);
        readonly data: Observable;
        readonly element: Element;
        readonly parent: DataContext;
        readonly token: string;
        readonly root: DataContext;
        getContext(element: Element, path: string): DataContext;
    }
}
