import os4eBaseSheet from "../core/os4eBaseSheet";
import ItemSheetTemplate from "./ItemSheetTemplate.svelte";

export default class os4eItemSheet extends os4eBaseSheet
{
    get Item() 
    {
        return this.object;
    }

    constructor(object = {}, options = {})
    {
        super(object, options, ItemSheetTemplate);
    }
}