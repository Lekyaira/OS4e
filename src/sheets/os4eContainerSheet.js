import os4eBaseSheet from "../core/os4eBaseSheet";
import ContainerSheetTemplate from "./ContainerSheetTemplate.svelte";

export default class os4eContainerSheet extends os4eBaseSheet
{
    get item() 
    {
        return this.object;
    }

    get actor() 
    {
        return this.item.actor;
    }

    constructor(object = {}, options = {})
    {
        super(object, options, ContainerSheetTemplate, {
            dropItem: (event) => this.dropItem(event)
        });
    }

    async dropItem(event)
    {
        console.log("Dropped!");
        console.log(event);
        const data = TextEditor.getDragEventData(event);
        console.log(data);

        // Handle different data types
        switch (data.type) 
        {
            case "Item":
                return this._onDropItem(event, data);
            // case "Folder":
            //     return this._onDropFolder(event, data);
        }
    }

    async _onDropItem(event, data)
    {
        // if (!this.actor.isOwner) return false;
        const item = await Item.implementation.fromDropData(data);
        let itemData = item.toObject();
        itemData = itemData instanceof Array ? itemData : [itemData];
        const newItem = await Item.createDocuments(itemData, { parent: this.item.name });
        this.item.contains.push(newItem);
        return newItem;
        // const newItem = await this.item.createEmbeddedDocuments("Item", itemData);
        // this.item.contains.push(newItem);
        // return newItem;
    }
}