import os4eActor from './os4eActor.js';
import os4eItem from './os4eItem.js';
import os4eActorSheet from './sheets/os4eActorSheet.js';
import os4eItemSheet from './sheets/os4eItemSheet.js';

// Hooks.once('ready', () => new BasicApplication().render(true, { focus: true }));

Hooks.once("init", async () => 
{
    console.log("OS4E | Initializing system...");

    CONFIG.Actor.documentClass = os4eActor;
    CONFIG.Item.documentClass = os4eItem;

    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("os4e", os4eActorSheet, { 
        types: ["character"],
        makeDefault: true 
    });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("os4e", os4eItemSheet, { 
        types: ["item"],
        makeDefault: true 
    });

    console.log("OS4E | Initialization complete!");
});