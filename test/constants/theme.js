const COLORS = {
    primary: "#45631f",
    secondary: "#444262",
    tertiary: "#FF7754",

    black: "#000000",
    
    darkGreen: "#478D04",
    mediumGreen: "#00894C",
    lightGreen: "#A6FFD1",

    gray: "#83829A",
    gray2: "#C1C0C8",

    white: "#F3F4F8",
    lightWhite: "#FAFAFC",

};

const FONT = {
    regular: "Arial",
    medium: "Arial",
    bold: "Arial",
};

const SIZES = {
    xSmall: 10,
    small: 12,
    medium: 16,
    large: 20,
    xLarge: 24,
    xxLarge: 32,
};

const SHADOWS = {
    small: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5.84,
        elevation: 5,
    },
};

export { COLORS, FONT, SHADOWS, SIZES };
