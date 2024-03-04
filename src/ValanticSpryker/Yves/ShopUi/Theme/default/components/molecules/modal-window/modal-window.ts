import Component from 'ShopUi/models/component';

export default class ItemAmountSelector extends Component {
    private modal: HTMLElement;
    private openButtons: HTMLElement[];
    private modalName: string;
    private closeButtons: HTMLElement[];
    private modalQuery: string;
    private modalIsVisible: boolean;
    private startOpened: boolean;
    private noOutsideClose: boolean;
    private localKey: string;

    protected readyCallback(): void {
    }

    protected init() {
        this.modalName = <string>this.getAttribute('modalName');
        this.modal = <HTMLElement>this.querySelector(`.${this.name}__modal-wrapper`);
        this.openButtons = <HTMLElement[]>Array.from(document.querySelectorAll(`[data-trigger=${this.modalName}]`));
        this.closeButtons = <HTMLElement[]>Array.from(document.querySelectorAll(`[data-trigger="close-${this.modalName}"]`));
        this.modalQuery = `[modalname=${this.modalName}] > .modal-window__modal-wrapper > .modal-window__modal`
        this.startOpened = this.hasAttribute('data-start-opened');
        this.noOutsideClose = this.hasAttribute('data-no-outside-close');
        this.localKey = this.getAttribute('data-restrict-with-local-key');

        if (this.startOpened && !window.localStorage.getItem(this.localKey)) {
            this.modalIsVisible = true;
            this.modal.classList.add('visible');
        }

        this.mapEvents()
    }

    closeModal() {
        this.modalIsVisible = false;
        this.modal.classList.remove('visible');
    }

    private nodeIsOpenButton(target: HTMLElement, nodeList: HTMLElement[]) {
        return nodeList.find((node: HTMLElement) => node.contains(target) || target.classList.contains("select2-dropdown"));
    }

    private mapEvents() {
        this.openButtons.forEach((button: HTMLElement) => {
            button.addEventListener('click', (event: Event) => {
                this.modalIsVisible = true;
                this.modal.classList.add('visible');
            })
        })

        this.closeButtons.forEach((button: HTMLElement) => {
            button.addEventListener('click', () => {
                this.closeModal();
            })
        })

        window.addEventListener('click', (event: MouseEvent) => {
            const target: HTMLElement = <HTMLElement>event.target;

            if (!this.noOutsideClose && this.modalIsVisible && !this.nodeIsOpenButton(target, this.openButtons) && !target.closest(this.modalQuery)) {
                this.closeModal();
            }
        })
    }
}
