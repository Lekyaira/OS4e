<script>
    import { onMount, afterUpdate } from "svelte";
    import { formatModifier } from "../stats.js"


    // Sheet and Actor data passed in from base sheet.
    export let sheet;
    export let doc;
    // Set actor variable so we can refer to it later.
    const actor = doc;

    // Toggles document edit mode
    let editMode = false;

    // Disable all inputs when editMode is false, and enable them when true.
    $: window.$('input').attr('disabled', !editMode);
    // Make sure inputs continue to behave this way.
    onMount(async () => {
        window.$('input').attr('disabled', !editMode);
    });

    ////////////////////////////////////////////
    // Handle portrait re-positioning on drag //
    ////////////////////////////////////////////
    let pos = {x: 0, y: 0};
    let start = {x: 0, y: 0};
    let offset = {x: 0, y: 0};
    let objectPosition = {x: 0, y: 0};
    let imgStart = {x: 0, y: 0};
    let draggingPortrait = false;
    const objectFits = ["none", "cover", "contain", "scaled-down", "fill"];
    let objectFit = objectFits[1];
    let holdDelay;

    let img;
    let imgBounds = {};
    let imgDimensions = {};
    let imgScaledDimensions = {};
    let imgLimit = {};

    afterUpdate(async ()=> {
        imgBounds = {
            width: img.clientWidth,
            height: img.clientHeight
        }
        imgDimensions = {
            width: img.naturalWidth,
            height: img.naturalHeight
        };
        imgScaledDimensions = getContainedSize(img);
        if(objectFit == "none"){
            imgLimit = {
                x: (imgDimensions.width - imgBounds.width) * -1,
                y: (imgDimensions.height - imgBounds.height) * -1
            }
        }
        else if(objectFit == "cover"){
            imgLimit = {
                x: (imgScaledDimensions.width - imgBounds.width) * -1,
                y: (imgScaledDimensions.height - imgBounds.height) * -1
            }
        }
        else {
            imgLimit = {x: 0, y: 0};
        }

        // Update portrait image position from saved data
        if(actor.system.portraitPosition){
            objectPosition = actor.system.portraitPosition;
        }
    }); 

    function onPointerMove(event){
        if(draggingPortrait){
            pos.x = event.clientX;
            pos.y = event.clientY;
            offset.x = pos.x - start.x;
            offset.y = pos.y - start.y;
            objectPosition.x = imgStart.x + offset.x;
            objectPosition.y = imgStart.y + offset.y;
            if(objectPosition.x > 0) objectPosition.x = 0;
            else if(objectPosition.x < imgLimit.x) objectPosition.x = imgLimit.x;
            if(objectPosition.y > 0) objectPosition.y = 0;
            else if(objectPosition.y < imgLimit.y) objectPosition.y = imgLimit.y;
        }
    }

    function onPointerDown(e){
        holdDelay = setTimeout(()=>{
            draggingPortrait = true;
            start.x = e.clientX;
            start.y = e.clientY;
            imgStart.x = objectPosition.x;
            imgStart.y = objectPosition.y;
        }, 200);
    }

    function onPointerUp(e){
        clearTimeout(holdDelay);
        setTimeout(()=>{
            draggingPortrait = false;
            start.x = 0;
            start.y = 0;
            offset.x = 0;
            offset.y = 0;
            actor.system.portraitPosition = objectPosition;
            // Save actor data to Foundry database.
            actor.update({_id: actor.id, system: {portraitPosition: objectPosition}});
        }, 50);
    }

    function onMouseLeave() {
        onPointerUp();
    }

    function getContainedSize(img) {
        var ratio = img.naturalWidth/img.naturalHeight
        var width = img.height*ratio
        var height = img.height
        if (width < img.width) {
            width = img.width
            height = img.width/ratio
        }
        width = Math.round(width);
        height = Math.round(height);
        return {width: width, height: height};
    }

    ////////////////////////////////
    // Handle Inventory Functions //
    ////////////////////////////////
    async function addNewItem(item, i, j)
    {
        console.log("OS4E | addNewItem");
        // TODO: Add some cool item adding code here!
    }

    async function deleteItem(item)
    {
        await Item.deleteDocuments([item.id], { parent: actor });
    }

    async function editItem(item)
    {
        item.sheet.render(true);
    }

</script>

<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true}/>

<main 
    on:pointermove={editMode ? onPointerMove : ''} 
    on:pointerup={editMode ? onPointerUp : ''}
    on:mouseleave={editMode ? onMouseLeave : ''}>

    <i id="edit-button" class="fas fa-pen-to-square"
        on:click={() => editMode = !editMode}
        on:keypress
        style:color={editMode ? 'black' : 'gray'} />
    <header>
        <img src={actor.img} alt="{actor.name}'s portrait" bind:this={img}
            class:editMode
            style:object-position={`${objectPosition.x}px ${objectPosition.y}px`}
            style:object-fit={objectFit}
            on:click={editMode && !draggingPortrait ? sheet.editImage() : ''} 
            on:pointerdown={editMode ? onPointerDown : ''}
            on:keypress />
        <div id="portraitTooltip">
            <div>Click to change portrait.</div>
            <div>Drag to re-position.</div>
        </div>
        <section id="info-block">
            <section id="title-block">
                <input id="name" name="name" type="text" bind:value={actor.name} />
                <span id="title">Level 1 Beastkin Fighter</span>
            </section>
            <!--Ability Scores-->
            <section id="ability-scores">
                <section id="score-labels">
                    <span>Strength</span>
                    <span>Dexterity</span>
                    <span>Charisma</span>
                    <span>Intelligence</span>
                    <span>Luck</span>
                </section>
                <section id="score-base-values" class="score-values"
                    style:display={editMode ? "initial" : "none"}>
                    <input type="number" id="score-base-strength" name="system.abilities.strength" bind:value={actor.system.abilities.strength} />
                    <input type="number" id="score-base-dexterity" name="system.abilities.dexterity" bind:value={actor.system.abilities.dexterity} />
                    <input type="number" id="score-base-charisma" name="system.abilities.charisma" bind:value={actor.system.abilities.charisma} />
                    <input type="number" id="score-base-intelligence" name="system.abilities.intelligence" bind:value={actor.system.abilities.intelligence} />
                    <input type="number" id="score-base-luck" name="system.abilities.luck" bind:value={actor.system.abilities.luck} />
                </section>
                <section id="score-derived-values" class="score-values">
                    <span>{actor.derived.strength}</span>
                    <span>{actor.derived.dexterity}</span>
                    <span>{actor.derived.charisma}</span>
                    <span>{actor.derived.intelligence}</span>
                    <span>{actor.derived.luck}</span>
                </section>
                <section id="score-modifiers" class="score-values">
                    <span>({formatModifier(actor.derived.str)})</span>
                    <span>({formatModifier(actor.derived.dex)})</span>
                    <span>({formatModifier(actor.derived.cha)})</span>
                    <span>({formatModifier(actor.derived.int)})</span>
                    <span>({formatModifier(actor.derived.luk)})</span>
                </section>
                <!--Defenses-->
                <section id="defense-labels">
                    <span>Fortitude</span>
                    <span>Reflexes</span>
                    <span>Will</span>
                    <span>Insight</span>
                </section>
                <section id="defense-values" class="score-values">
                    <span>{actor.derived.fortitude}</span>
                    <span>{actor.derived.reflexes}</span>
                    <span>{actor.derived.will}</span>
                    <span>{actor.derived.insight}</span>
                </section>
            </section>
            <!--Stats-->
            <section id="stats">
                <section>
                    <span>HP</span>
                    <span>WP</span>
                    <span>Armor</span>
                </section>
                <section>
                    <span>1</span>
                    <span>5</span>
                </section>
                <section>
                    <span>/</span>
                    <span>/</span>
                </section>
                <section>
                    <span>1</span>
                    <span>5</span>
                    <span>0</span>
                </section>
                <section>
                    <span>XP</span>
                    <span>SP</span>
                </section>
                <section>
                    <span>0</span>
                    <span>{actor.derived.sp}sq.</span>
                </section>
            </section>
        </section>
    </header>
    <section id="body">
        <!--Inventory-->
        <section id="inventory">
            <!-- <span class="inventory-title">Equipment</span> -->
            <!-- {#each actor.system.inventory as slot, i} -->
            <!--     <div class="inventory-row"> -->
            <!--         <span class="inventory-type" class:editMode>{slotTypeToText(slot.type)}</span> -->
            <!--         <div class="inventory-block"> -->
            <!--             {#each slot.items as item, j} -->
            <!--                 {#if item.item == undefined} -->
            <!--                     <span class="inventory-item"> -->
            <!--                         <i class="fas fa-plus" on:click={addNewItem(item, i, j)} /> -->
            <!--                     </span> -->
            <!--                 {:else} -->
            <!--                     <span class="inventory-item">{item.item.name}</span> -->
            <!--                 {/if} -->
            <!--             {/each} -->
            <!--         </div> -->
            <!--     </div> -->
            <!-- {/each} -->
            <!-- <i class="fas fa-plus" on:click={addNewItem} on:keypress>New</i> -->
            <!-- {#if sheet.looseItems.length > 0} -->
            <!--     <span class="inventory-title">Loose Items</span> -->
            <!-- {/if} -->
            <!-- {#each sheet.looseItems as item} -->
            <!--     <span class="inventory-item"> -->
            <!--         <img src="{item.img}" alt="{item.name}" /> -->
            <!--         {item.name} -->
            <!--         <i class="fas fa-pen-to-square" on:click={editItem(item)} on:keypress /> -->
            <!--         <i class="fas fa-trash-can" on:click={deleteItem(item)} on:keypress /> -->
            <!--     </span> -->
            <!-- {/each} -->
        </section>
    </section>
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
        width: 15rem;
        height: 20rem;
        object-fit:cover;
        box-shadow: 1px 1px 2px 1px rgba(0,0,0,0.3);
        /*box-shadow: 1px 1px 2px gray;*/
        /*object-position: 50% 50%;*/
    }

    header #portraitTooltip {
        display: none;
        position: absolute;
        top: 19.5rem;
        left: 4rem;
        font-size: 0.7rem;
        padding: 0.3rem;
        width: 8rem;
        border: 1px solid black;
        background-color: lightgray;
        box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.3);
    }

    .editMode {
        /*border-color: blue;*/
        box-shadow: 0px 0px 5px rgba(0,0,255,0.7);
    }

    header .editMode:hover {
        /*border-color: red;*/
        box-shadow: 0 0 5px red;
    }

    header .editMode:hover + #portraitTooltip {
        display: block;
    }

    header #name {
        width: 26.2rem;
        height: 3rem;
        font-size: 2rem;
    }

    #title-block {
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
        border-bottom: 1px solid;
    }

    #title {
        font-size: 1.4rem;
    }

    #ability-scores {
        display: flex;
        flex-direction: row;
        font-size: 1rem;
        padding-bottom: 1rem;
        margin-bottom: 1rem;
        border-bottom: 1px solid;
    }

    #ability-scores span {
        height: 1.3rem;
    }

    #ability-scores input {
        height: 1.3rem;
    }

    #ability-scores section {
        display: flex;
        flex-direction: column;
        margin-left: 0.2rem;
    }

    #ability-scores #score-labels {
        width: 6rem;
    }

    #ability-scores .score-values {
        width: 2rem;
    }

    #ability-scores #score-derived-values {
        width: 1.5rem;
    }

    #ability-scores #defense-labels {
        margin-left: 4rem;
        width: 5rem;
    }

    #stats {
        display: flex;
        flex-direction: row;
        font-size: 1.2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid;
    }

    #stats section {
        display: flex;
        flex-direction: column;
    }

    #stats section:first-child {
        width: 2rem;
    }

    #stats section:first-child + section {
        width: 2rem;
        align-items: center;
    }

    #stats section:first-child + section + section {
        width: 1rem;
        align-items: center;
    }

    #stats section:first-child + section + section + section {
        width: 2rem;
        align-items: center;
    }

    #stats section:first-child + section + section + section + section {
        width: 2rem;
        margin-left: 4rem;
    }

    #stats section:first-child + section + section + section + section + section {
        width: 12rem;
    }

    #body {
        display: flex;
        flex-direction: row;
    }

    #inventory {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-top: 0.4rem;
    }

    #inventory .inventory-title {
        font-size: 1.3rem;
        text-align: center;
        margin: 0.4rem 0 0.4rem 0
    }

    #inventory .inventory-row {
        display: flex;
        flex-direction: row;
        margin: 0.1rem;
    }

    #inventory .inventory-type {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border: 1px solid;
    }

    #inventory .inventory-block {
        align-self: flex-end;
        margin-left: 0.2rem;
    }

    #inventory .inventory-item {
        display: flex;
        align-self: flex-end;
        width: 10rem;
        border-bottom: 1px solid;
    }

    #inventory .inventory-item img {
        width: 1rem;
        height: 1rem;
        border: none;
    }
    </style>
