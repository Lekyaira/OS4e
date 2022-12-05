<script>
   import { onMount } from "svelte";

   export let elementRoot;

   // Actor data passed in from os4eActorSheet.js
   export let data;

   // Callback to allow os4eActorSheet.js to update the actor data.
   export let update = () => {};

   // Callback to render file picker when portrait is clicked.
   export let editImage = () => {};

   // Toggles document edit mode
   let editMode = false;

   $: window.$('input').attr('disabled', !editMode);

   // Set all inputs to update on change
   onMount(async () =>
   {
      window.$('input').on('change', () => update(data));
      window.$('input').attr('disabled', !editMode);
   });
 </script>
  
 <!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
 <svelte:options accessors={true}/>

<main>
   <i id="edit-button" class="fas fa-pen-to-square"
      on:click={() => editMode = !editMode}
      on:keypress
      style:color={editMode ? 'black' : 'gray'} />
   <header>
      <img src={data.img} alt={data.name} 
         on:click={editMode ? editImage(data) : ''} 
         on:keypress />
      <section id="info-block">
         <section id="title-block">
            <input id="name" type="text" bind:value={data.name} />
            <span id="title">Level 1 Beastkin Fighter</span>
         </section>
         <section id="ability-scores">
            <span>Strength 10</span>
            <span>Dexterity 10</span>
            <span>Charisma 10</span>
            <span>Intelligence 10</span>
            <span>Luck 10</span>
         </section>
      </section>
   </header>
</main>
  
 <style lang="scss">
   #edit-button {
      position: absolute;
      top: 2.1rem;
      right: 0.2rem;
   }

   input:disabled {
      color: black;
      border: none;
      background: none;
   }

   main {
      display: flex;
      flex-direction: column;
   }

   #info-block {
      margin-left: 0.5rem;
   }

   header {
      display: flex;
   }

   header img {
      width: 20rem;
      height: 20rem;
   }

   header #name {
      width: 21.2rem;
      height: 3rem;
      font-size: 2rem;
   }

   #title-block {
      margin-bottom: 1rem;
      border-bottom: 1px solid;
   }

   #title {
      font-size: 1.1rem;
   }

   #ability-scores {
      display: flex;
      flex-direction: column;
   }
 </style>