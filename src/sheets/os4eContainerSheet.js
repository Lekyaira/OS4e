import os4eBaseSheet from "../core/os4eBaseSheet";
import ContainerSheetTemplate from "./ContainerSheetTemplate.svelte";

export default class os4eContainerSheet extends os4eBaseSheet
{
    get Item() 
    {
        return this.object;
    }

    constructor(object = {}, options = {})
    {
        super(object, options, ContainerSheetTemplate);
    }
}