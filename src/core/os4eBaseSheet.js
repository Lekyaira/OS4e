import { SvelteApplication } from "@typhonjs-fvtt/runtime/svelte/application";
import BaseSheetTemplate from "./BaseSheetTemplate.svelte";

export default class os4eBaseSheet extends SvelteApplication {
    #component; // Reference to the inner Svelte sheet template
    object; // Reference to the document object (Actor/Item etc.)

    // Svelte template
    get template() {
        return this.svelte.applicationShell;
    }

    constructor(
        object = {}, // This is typically passed in by Foundry
        options = {}, // This is typically passed in by Foundry
        component = false // Sheets derived from os4eBaseSheet need to pass
        // in the inner sheet template.
    ) {
        super(options); // SvelteApplication doesn't need object.

        // Save our document object for later use.
        this.object = object;

        // Store the inner sheet template component.
        this.#component = component;
    }

    /**
     * Default Application options
     *
     * @returns {object} options - Application options.
     * @see https://foundryvtt.com/api/Application.html#options
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            title: "OS4e.title", // Automatically localized from `lang/en.json`.
            width: 600,
            height: 400,

            svelte: {
                class: BaseSheetTemplate, // Svelte base template
                target: document.body, // Where we are rendering the sheet
                props: function () {
                    // This allows us to load in default
                    // properties to the sheet.
                    return {
                        // We'll pass in the sheet and the document object
                        sheet: this,
                        doc: this.object,
                        // The inner sheet template to render
                        component: this.#component,
                    };
                },
            },
        });
    }

    async editImage() {
        // TODO: Replace with Tokenizer-like functionality.
        // Instantiate a new file picker.
        const picker = new FilePicker();
        // When the file is picked...
        picker.callback = async (imgPath) => {
            // Update  the returned data object with the newly picked image path.
            this.object.img = imgPath;

            // Save object data to Foundry.
            await this.object.update({ _id: this.object.id, img: imgPath });

            console.log(this.object);
            this.template.doc.img = imgPath;
            this.template.doc = this.template.doc;
            // Force a refresh of the Svelte template's data.
            // Nessecary becase Svelte won't update reactive data on mutation.
            // this.refresh();
        };
        // Render the picker.
        picker.render(true);
    }

    async refresh() {
        // Force a refresh of the Svelte template's data.
        // Nessecary becase Svelte won't update reactive data on mutation.
        // this.template.$set({ doc: this.object, sheet: this });
        this.template.$set({ doc: this.object });
    }
}
