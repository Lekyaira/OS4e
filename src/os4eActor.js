import { getModifier } from "./stats";

export default class os4eActor extends Actor 
{
    // Derived statistics
    derived = {
        species: {},

        sp: 6,
        fly: 0,
        overland: 0,
        climb: 0,
        swim: 0,
        burrow: 0,

        strength: 10,
        dexterity: 10,
        charisma: 10,
        intelligence: 10,
        luck: 10,

        str: 0,
        dex: 0,
        cha: 0,
        int: 0,
        luk: 0,

        baseAttack: 6,

        fortitude: 10,
        reflexes: 10,
        will: 10,
        insight: 10,
        armor: 0,

        encumbrance: 5,
        items: {},
        inventory: [],
        looseItems: []
    };

    prepareDerivedData() 
    {
        const data = this.system;
        const derived = this.derived;

        // Reset the species bonuses
        derived.species = {};

        // this.prepareItems();

        // Set derived stats
        
        // Set ability scores
        derived.strength = data.abilities.strength;
        derived.dexterity = data.abilities.dexterity;
        derived.charisma = data.abilities.charisma;
        derived.intelligence = data.abilities.intelligence;
        derived.luck = data.abilities.luck;

        // Set ability score modifiers
        derived.str = getModifier(derived.strength);
        derived.dex = getModifier(derived.dexterity);
        derived.cha = getModifier(derived.charisma);
        derived.int = getModifier(derived.intelligence);
        derived.luk = getModifier(derived.luck);

        // Set defenses
        derived.fortitude = 5 + derived.str;
        derived.reflexes = 5 + derived.dex;
        derived.will = 5 + derived.cha;
        derived.insight = 5 + derived.int;
        derived.armor = 0;

        // Encumbrance
        derived.encumbrance = 5 + derived.str;

        derived.items = new Map();
        derived.inventory = [];
        derived.looseItems = [];
        for (let i = 0; i < derived.encumbrance; i++)
        {
            let s = 0;
            let a = [];
            if (this.system.inventory && i < this.system.inventory.length)
            {
                s = this.system.inventory[i].type;
                // a = this.system.inventory[i].items;
                if (this.system.inventory[i].items.length)
                {
                    for (const item of this.system.inventory[i].items)
                    {
                        derived.items.set(item.id, derived.inventory[i].items);
                        a.push({
                            id: item,
                            item: undefined
                        });
                    }
                }
            }
            derived.inventory.push({
                type: s,
                items: a
            });
        }

        this.prepareItems();

        console.log("OS4E | prepareDerivedData");
        console.log(derived);

        // Set speed
        // derived.sp = (derived.species['sp'] ? derived.species.sp : 6);
        // derived.fours = (derived.species['fours'] ? derived.species.fours : 0);
        // derived.fly = (derived.species['fly'] ? derived.species.fly : 0);
        // derived.overland = (derived.species['overland'] ? derived.species.overland : 0);
        // derived.climb = (derived.species['climb'] ? derived.species.climb : 0);
        // derived.swim = (derived.species['swim'] ? derived.species.swim : 0);
        // derived.burrow = (derived.species['burrow'] ? derived.species.burrow : 0);

        // // Set HP
        // data.hp.max = data.level + derived.str + (derived.species['hp'] ? derived.species.hp : 0);

        // // Set WP
        // data.wp.max = 5 /* <-- This will be set by class later */ + derived.cha + (derived.species['wp'] ? derived.species.wp : 0);
    }

    prepareItems()
    {
        const derived = this.derived;
        let hasSpecies = false;

        for (const item of this.items)
        {
            if (item.type === "species")
            {
                // There can be only one. Delete the rest.
                if (hasSpecies)
                {
                    item.delete();
                }
                else
                {
                    // Add the species
                    derived.species = item;
                    hasSpecies = true;

                    // TODO: Do bonuses
                }
            }
            else if (item.type === "item")
            {
                if (derived.items.has(item.id))
                {
                    for (const i of derived.items.get(item.id))
                    {
                        if (i.id === item.id)
                        {
                            i.item = item;
                            break;
                        }
                    }
                }
                else
                {
                    derived.looseItems.push(item);
                }
            }
        }
    }
}