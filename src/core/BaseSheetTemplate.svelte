<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import { getContext, onMount } from 'svelte';
 
   export let elementRoot;

   // Sheet
   export let sheet;
   // Document
   export let doc;

   // Inner sheet template component
   export let component = false;

   // External application
   const application = getContext('external').application;

   // Two-way binding to title, sets title to the object's name.
   const storeTitle = application.reactive.storeAppOptions.title;
   $: $storeTitle = doc.name;

   // Update data when input fields are changed
   onMount(async () =>
   {
           // Set the onChange event for all inputs
           window.$('input').on('change', function() {
               // Create update data with our document id.
               let docData = {_id: $doc.id};
               // Get the calling element's name and value and update the data.
               docData[window.$(this).attr('name')] = window.$(this).val();
               // Update our document with the changes.
               $doc.update(docData);
           });
           // Refresh the sheet template data.
           // sheet.refresh();
   });
</script>
 
<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>
 
<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
    <!-- svelte:component tag represents our inner sheet template data. -->
    <!-- "this" is the Svelte componente we're rendering on this sheet. -->
    <!-- "sheet" is the sheet object that controls the sheet rendering. -->
    <!-- "doc" is the document object (Actor, Item, etc.) that handles the actual data representation. -->
   <svelte:component 
        this={component} 
        bind:sheet={sheet} 
        bind:doc={doc} />
</ApplicationShell>
