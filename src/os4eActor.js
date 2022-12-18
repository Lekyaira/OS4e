import { getModifier } from "./stats";

export default class os4eActor extends Actor {
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
    };

    prepareDerivedData() {
        const data = this.system;
        const derived = this.derived;

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

        // Prepare the actor's data from items.
        this.prepareItems();
    }

    prepareItems() {
        const derived = this.derived;
        let hasSpecies = false;

        // Loop through all the embedded items.
        for (const item of this.items) {
            // Species items
            if (item.type === "species") {
                // There can be only one. Delete the rest.
                if (hasSpecies) {
                    item.delete();
                } else {
                    // Add the species
                    derived.species = item;
                    hasSpecies = true;

                    // TODO: Do bonuses
                }
                // Item items
            } else if (item.type === "item") {
                // TODO: Inventory related stuff here
            }
        }
    }

    getNumSlots(type) {
        switch (type) {
            case 0:
                return 1;
            case 1:
                return 5;
            case 2:
                return 3;
            case 3:
                return 2;
            case 5:
                return 1;
            default:
                return 0;
        }
    }
}
