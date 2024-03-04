import Component from 'ShopUi/models/component';
import OverlayBlock from '../../atoms/overlay-block/overlay-block';

export default class ModalContainer extends Component {
    protected overlay: OverlayBlock;
    protected triggers: HTMLElement[];
    protected closeButtons: HTMLElement[];
    protected modals: HTMLElement[];
    protected jsModalContainer: string;
    protected modalContainer: string;
    protected checkoutTrigger: HTMLElement;

    protected readyCallback(): void {
    }

    protected init(): void {
        this.jsModalContainer = <string>'js-modal-container';
        this.modalContainer = <string>'modal-container';
        this.triggers = <HTMLElement[]>Array.from(document.querySelectorAll('[js-trigger]'));
        this.modals = <HTMLElement[]>Array.from(document.getElementsByClassName(`${this.jsModalContainer}__content`));
        this.overlay = <OverlayBlock>document.getElementsByClassName(this.overlayClassName)[0];
        this.checkoutTrigger = <HTMLElement>document.getElementsByClassName('js-submit-summary-form')[0];

        this.mapEvents();
    }

    protected mapEvents(): void {
        this.triggers.forEach((trigger: HTMLElement) => {
            trigger.addEventListener('click', (event: Event) => this.onTriggerClick(event, trigger));
        });
        this.modals.forEach((modal: HTMLElement) => {
            modal.addEventListener('click', (event: Event) => this.onOutsideClick(event, modal));
        });
        this.overlay.addEventListener('click', (event: Event) => {
            this.modals.forEach((modal: HTMLElement) => {
                this.onCloseClick(event, modal);
            });
        });
    }

    onTriggerClick(event: Event, trigger: HTMLElement): void {
        const timeoutNumber = 1500;
        this.closeButtons =
            <HTMLElement[]>Array.from(document.getElementsByClassName(`${this.jsModalContainer}__close`));
        let currentModal: HTMLElement;

        this.closeButtons.forEach((button: HTMLElement) => {
            button.addEventListener('click', (buttonEvent: Event) => this.onCloseClick(buttonEvent, button));
        });

        if (this.checkoutTrigger) {
            setTimeout(() => {
                const form = <HTMLFormElement>document.getElementsByName('summaryWithAttachmentForm')[0];
                form.submit();
            }, timeoutNumber);
        }

        this.modals.forEach((modal: HTMLElement) => {
            const modalTrigger = trigger.getAttribute('js-trigger');

            if (modal.classList.contains(modalTrigger)) {
                currentModal = <HTMLElement>modal;
            }
        });

        if (!currentModal) {
            return;
        }

        const isModalOpen = currentModal.classList.contains(`${this.modalContainer}--open`);

        if (!isModalOpen) {
            this.showModal(currentModal);

            return;
        }

        this.hideModal(currentModal);
    }

    protected onOutsideClick(event: Event, modal: HTMLElement): void {
        const modalDialog = modal.getElementsByClassName(`${this.modalContainer}__dialog`)[0];
        const isModalOpen = modalDialog.classList.contains(`${this.modalContainer}__dialog--open`);

        if (!isModalOpen) {
            return;
        }

        const eventTarget = <HTMLElement>event.target;

        if (eventTarget !== modal) {
            return;
        }

        this.hideModal(modal);
    }

    protected onCloseClick(event: Event, button: HTMLElement): void {
        let currentModal: HTMLElement;

        this.modals.forEach((modal: HTMLElement) => {
            if (modal.contains(button)) {
                currentModal = <HTMLElement>modal;
            }
        });

        this.hideModal(currentModal);
    }

    protected showModal(currentModal: HTMLElement): void {
        const modalContent = <HTMLElement>currentModal.getElementsByClassName(`${this.modalContainer}__dialog`)[0];
        modalContent.classList.add(`${this.modalContainer}__dialog--open`);
        currentModal.classList.add(`${this.modalContainer}--open`);
        this.overlay.showOverlay('modal-open', 'modal-open');

        const cadObject = <HTMLElement>currentModal.getElementsByClassName(`cad-box-lazy__object`)[0];

        if (cadObject) {
            this.loadCadObject(cadObject);
        }
    }

    protected loadCadObject(cadObject: HTMLElement): void {
        const url: string = cadObject.getAttribute('data-url');
        if (!url) {
            return;
        }

        cadObject.setAttribute('data', url);
        cadObject.removeAttribute('data-url');
    }

    protected hideModal(currentModal: HTMLElement): void {
        const modalContent = <HTMLElement>currentModal.getElementsByClassName(`${this.modalContainer}__dialog`)[0];
        modalContent.classList.remove(`${this.modalContainer}__dialog--open`);
        currentModal.classList.remove(`${this.modalContainer}--open`);
        this.overlay.hideOverlay('modal-open', 'modal-open');
    }

    protected get overlayClassName(): string {
        return this.getAttribute('overlay-block-class-name');
    }
}
