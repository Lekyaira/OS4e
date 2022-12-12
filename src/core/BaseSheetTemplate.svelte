<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import { getContext, onMount } from 'svelte';
 
   export let elementRoot;

   // Sheet class
   export let sheet;

   // Actor data passed in from os4eActorSheet.js
   export let data;
   data.refresh = refreshSheet;

   // Inner component
   export let component = false;

   // Callbacks
   export let callbacks = {};

   // Callback to allow os4eActorSheet.js to update the actor data.
   // export let update = () => {};

   // Callback to render file picker when portrait is clicked.
   // export let editImage = () => {};

   // External application
   const application = getContext('external').application;

   // Two-way binding to title, sets title to the object's name.
   const storeTitle = application.reactive.storeAppOptions.title;
   $: $storeTitle = data.name;

   // Update data when input fields are changed
   onMount(async () =>
   {
      window.$('input').on('change', () => callbacks.update(data));
   });

   async function refreshSheet()
   {
      console.log("Refreshed!");
      data = data;
   }
</script>
 
<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>
 
<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <svelte:component this={component} bind:elementRoot={elementRoot} bind:sheet={sheet} bind:data={data} callbacks={callbacks} />
</ApplicationShell>