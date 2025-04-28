export function getAchievements() {
// hardcoded cause I couldn't bother
    const achievements = [
        {
            name: "The beginning",
            description: "Play your first game",
            index: 0,
            elementId: "first-game",
        },
        {
            name: "Ben-10",
            description: "Drop 10 cubes",
            index: 1,
            elementId: "drop10",
        },
        {
            name: "Why",
            description: "Drop 500 cubes",
            index: 2,
            elementId: "drop500",
        },
        {
            name: "A million squared",
            description: "Drop 1000 cubes",
            index: 3,
            elementId: "drop1000",
        },
        {
            name: "Is that a star wars reference?",
            description: "\"Two hundred thousand units are ready...\"",
            index: 4,
            elementId: "drop200000",
        },
        {
            name: "It definitely is",
            description: "\"... with a million more on the way\"",
            index: 5,
            elementId: "play1000000",
        },
        {
            name: "π",
            description: "drop 3,141,592 cubes (I'll be compensating you 100$ and a beer if you do this one)",
            index: 6,
            elementId: "playpi",
        }
    ];

    return achievements;
}