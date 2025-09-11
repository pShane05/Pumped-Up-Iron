export function randomRarity(isMagicPossible: boolean) {

    const roll = Math.random()
    var rarity;
    
    if (roll < .02) {
        rarity = 
            isMagicPossible ?
                "Magic"
            :
                "Common"

    } else if (roll < .17) {
        rarity = "Rare"

    } else if (roll < .5) {
        rarity = "Uncommon"

    } else rarity = "Common"

    return rarity
}