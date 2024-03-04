import "./modal-window.scss";
import register from 'ShopUi/app/registry';
export default register (
    'modal-window',
    () =>
        import(
            /* webpackMode: "lazy" */
            /* webpackChunkName: "modal-window" */
            './modal-window'
            ),
);
