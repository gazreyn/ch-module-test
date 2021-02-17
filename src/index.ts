import css from '@/styles.scss';

export default class extends window.casthub.module {
    constructor() {
        super();

        // Set the Module HTML using the Template file.
        this.$container.appendChild(this.template());

        // Set the CSS from the external file.
        this.css = css;
    }

    public async mounted(): Promise<void> {
        await super.mounted();
    }
}
