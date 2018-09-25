namespace Bowtie {

    function bindInternal(context: DataContext, element: Element): void {
        let attrs = element.getAttribute();
        
    }

    export function tie(data: any): void {
        let observableData = new Observable(data);
        let body = document.body;
        let context = new DataContext(observableData, body);
        bindInternal(context, body);
    }

}