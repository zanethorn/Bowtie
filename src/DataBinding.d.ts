declare namespace Bowtie {
    interface DataBinding {
        readonly dataSource: Observable;
        readonly element: Element;
        readonly bindingText: string;
    }
}
