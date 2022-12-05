<script>
   import { ApplicationShell }   from '@typhonjs-fvtt/runtime/svelte/component/core';
   import { getContext } from 'svelte';
 
   export let elementRoot;

   // Actor data passed in from os4eActorSheet.js
   export let data;

   // Inner component
   export let component = false;

   // Callback to allow os4eActorSheet.js to update the actor data.
   export let update = () => {};

   // Callback to render file picker when portrait is clicked.
   export let editImage = () => {};

   // External application
   const application = getContext('external').application;

   // Two-way binding to title, sets title to the object's name.
   const storeTitle = application.reactive.storeAppOptions.title;
   $: $storeTitle = data.name;
</script>
 
<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>
 
<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
   <svelte:component this={component} bind:elementRoot={elementRoot} bind:data={data} update={update} editImage={editImage} />
</ApplicationShell>
 
<style lang="scss">
/*   main {
      text-align: center;
      display: flex;
      flex-direction: column;
   }

   header {
      display: flex;
   }

   header img {
      width: 6rem;
      height: 6rem;
   }*/
</style>