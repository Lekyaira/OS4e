<script>
    export let elementRoot;
 
    // Actor data passed in from os4eActorSheet.js
    export let data;
 
    // Callback to allow os4eActorSheet.js to update the actor data.
    export let update = () => {};
 
    // Callback to render file picker when portrait is clicked.
    export let editImage = () => {};
 </script>
  
 <!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
 <svelte:options accessors={true}/>

<main>
    <header>
    <img src={data.img} alt={data.name} on:click={editImage(data)} on:keypress={()=>{}} />
    <input type="text" bind:value={data.name} on:change={update(data)} />
    </header>
</main>
  
 <style lang="scss">
    main {
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
    }
 </style>