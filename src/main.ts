namespace Bowtie {

    let _binders: Array<Binder> = new Array<Binder>();

    function bindInternal(context: DataContext, element: Element): void {

        let contextAttr = element.getAttribute("data-context");
        if (contextAttr) {
            context = context.getContext(element, contextAttr);
        }

        let attributeNames = [];//element.getAttributeNames();

        for (let name of attributeNames) {
            if (name.startsWith("data-bind-")) {
                var value = element.getAttribute(name);
                //createBinding(element, context, value);
            }
        }

        for (let child of element.childNodes) {
            if (child instanceof Element) {
                bindInternal(context, child);
            }
        }
    }

    export function binders(): Array<Binder> {
        return _binders.slice();
    }



    export function tie(data: any): void {
        let observableData = new Observable(data);
        let body = document.body;
        let context = new DataContext(observableData, body, null);
        bindInternal(context, body);
    }

}