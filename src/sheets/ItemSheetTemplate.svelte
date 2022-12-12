<script>
    export let elementRoot;
 
    // Item data passed in from os4eItemSheet.js
    export let data;

    // Callbacks
    export let callbacks;
 
    // Callback to allow os4eItemSheet.js to update the actor data.
   //  export let update = () => {};
 
   //  // Callback to render file picker when portrait is clicked.
   //  export let editImage = () => {};
 </script>
  
 <!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
 <svelte:options accessors={true}/>

<main>
    <header>
    <img src={data.img} alt={data.name} on:click={callbacks.editImage(data)} on:keypress={()=>{}} />
    <input type="text" bind:value={data.name} />
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