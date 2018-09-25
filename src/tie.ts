namespace Bowtie {

    async function bindInternal(context: DataContext, element: Element): void {

        let contextAttr = element.getAttribute("data-context");
        if (contextAttr) {
            context = context.getContext(element, contextAttr);
        }

        let attributeNames = element.getAttributeNames();

        for(let name in attributeNames) {
            if (name.startsWith("data-bind-")) {
                var value = element.getAttribute(name);
                createBinding(element, context, value);
            }
        }
        
        for(let child in element.childNodes) {
            await bindInternal(context, child);
        }
    }

    export function tie(data: any): void {
        let observableData = new Observable(data);
        let body = document.body;
        let context = new DataContext(observableData, body);
        bindInternal(context, body);
    }

}