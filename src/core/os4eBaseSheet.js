import { SvelteApplication }  from '@typhonjs-fvtt/runtime/svelte/application';
import BaseSheetTemplate from './BaseSheetTemplate.svelte';

export default class os4eBaseSheet extends SvelteApplication
{
   #data;
   #updateData;
   #editImage;
   #component;
   #callbacks = {};
   object;

   constructor(object = {}, options = {}, component = false, callbacks = {}) 
   {
      super(options);

      this.object = object;

      this.#data = {
         id: object.id,
         name: object.name,
         img: object.img,
         system: object.system,
         derived: object.derived
      };

      this.#callbacks = callbacks;

      // Callback to update actor data
      // this.#updateData = (data) => this.object.update(data);
      this.#callbacks.update = (data) => this.object.update(data);


      // Callback up render file picker and update data when portrait is clicked.
      // this.#editImage = (data) =>
      this.#callbacks.editImage = (data) =>
      {
         // TODO: Replace with Tokenizer-like functionality.
         // Instantiate a new file picker
         const picker = new FilePicker();
         // When the file is picked...
         picker.callback = (e) =>
         {
            // Update the returned data object with the newly
            // picked image path.
            data.img = e;
            // Send the data back to the component
            this.svelte.applicationShell.$set({ data });
            // Update the actor's data
            this.object.update(data);
         };
         picker.render(true);
      };

      // Store the inner component
      this.#component = component;
   }

   /**
    * Default Application options
    *
    * @returns {object} options - Application options.
    * @see https://foundryvtt.com/api/Application.html#options
    */
   static get defaultOptions()
   {
      return foundry.utils.mergeObject(super.defaultOptions, {
         title: 'OS4e.title',  // Automatically localized from `lang/en.json`.
         width: 600,
         height: 400,

         svelte: {
            class: BaseSheetTemplate,
            target: document.body,
            props: function() 
            {
               return {
                  data: this.#data,
                  callbacks: this.#callbacks,
                  // update: this.#updateData,
                  // editImage: this.#editImage,
                  component: this.#component,
               };
            }
         }
      });
   }
}