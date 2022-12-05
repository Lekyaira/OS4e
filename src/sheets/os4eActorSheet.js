import os4eBaseSheet from "../core/os4eBaseSheet";
import ActorSheetTemplate from "./ActorSheetTemplate.svelte";

export default class os4eActorSheet extends os4eBaseSheet
{
    get Actor() 
    {
        return this.object;
    }

    constructor(object = {}, options = {})
    {
        super(object, options, ActorSheetTemplate);
    }

    static get defaultOptions()
    {
        return foundry.utils.mergeObject(super.defaultOptions, 
            {
                width: 700,
                height: 900
            });
    }
}