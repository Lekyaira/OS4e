<script>
   import ContainerBlock from "../components/ContainerBlock.svelte";
   export let elementRoot;

   // Item data passed in from os4eItemSheet.js
   export let data;

   // Callbacks
   export let callbacks;

   // // Callback to allow os4eItemSheet.js to update the actor data.
   // export let update = () => {};

   // // Callback to render file picker when portrait is clicked.
   // export let editImage = () => {};
</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<main>
   <header>
      <img src={data.img} alt={data.name} on:click={callbacks.editImage(data)} on:keypress={()=>{}} />
      <input type="text" bind:value={data.name} />
   </header>
   <section id="body">
      <section id="stats">
         <span>
            <label for="slots">Slots</label>
            <input type="number" name="slots" bind:value={data.system.slots} />
         </span>
      </section>
      <section id="contained-items">
         <label for="items">Contains</label>
         <ContainerBlock contains={data.system.contains} containerSize={data.system.slots} dropItem={callbacks.dropItem} />
      </section>
   </section>
</main>
  
<style lang="scss">
   main {
      text-align: center;
      display: flex;
      flex-direction: column;
   }

   header {
      display: flex;
      height: 5.2rem;
      border-bottom: 1px solid;
   }

   header img {
      width: 5rem;
      height: 5rem;
   }

   header input {
      font-size: 1.5rem;
      height: 2rem;
   }

   #body {
      /*width: 100%;*/
      display: flex;
      flex-direction: row;
   }

   #stats {
      display: flex;
      flex-direction: column;
      width: 8rem;
      text-align: left;
      margin: 0.5rem;
      border-right: 1px solid;
      height: 15.9rem;
   }

   #stats span {
      display: flex;
      flex-direction: row;
   }

   #stats span input {
      height: 1rem;
      margin-left: 0.2rem;
      width: 3rem;
   }

   #contained-items {
      text-align: left;
      display: flex;
      flex-direction: column;
   }

   #contained-items label {
      width: 26rem;
      text-align: center;
      font-size: 1.2rem;
   }
</style>