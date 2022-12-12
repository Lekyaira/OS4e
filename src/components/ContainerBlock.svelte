<script>
    export let containerSize;
    export let contains;
    let hovered = false;

    export let dropItem = ()=>{};

    function allowDrop(e) {
        e.preventDefault();
        hovered = true;
    }

    function dragLeave(e) {
        hovered = false;
    }

    function drop(e) {
        e.preventDefault();
        dropItem(e);
        // console.log("dropped!");
        // console.log(e);
        hovered = false;
    }
</script>

<ul class:hovered on:dragover={allowDrop} on:dragleave={dragLeave} on:drop={drop}>
{#each contains as item, i}
    {#if item.type == "container"}
        <svelte:self contains={item.system.contains} containerSize={item.system.slots} dropItem={dropItem} />
    {:else}
        <li class:over={i > containerSize}>{item.name}</li>
    {/if}
{/each}
{#if containerSize - contains.length > 0}
    {#each Array(containerSize - - contains.length) as _}
        <li class="blank"></li>
    {/each}
{/if}
</ul>

<style>
    .over {
        color: red;
    }

    .blank {
        width: 8rem;
        border-bottom: 1px solid;
    }

    ul {
        list-style-type: none;
        padding:0.5rem;
    }

    li {
        height: 1.4rem;
    }

    .hovered {
        background-color: rgba(120,120,120,0.1);
    }
</style>