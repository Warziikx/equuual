/*
Palette de couleurs : 
https://colorhunt.co/palette/206723

Pour compilé :
npx tailwind build styles.css -o output.css

*/

module.exports = {
	future: {
		// removeDeprecatedGapUtilities: true,
		// purgeLayersByDefault: true,
	},
	purge: [],
	theme: {
		extend: {
			colors: {
				eminence: {
					default: "#6C2C72",
					100: "#D095D6",
					200: "#C070C7",
					300: "#B04BB9",
					400: "#8F3B97",
					500: "#6C2C72",
					600: "#491E4D",
					700: "#261028",
					800: "#030104",
					900: "#000000",
				},
				"night-shadz": {
					default: "#B93C5F",
					100: "#F0D1DA",
					200: "#E4AABB",
					300: "#D7849B",
					400: "#CB5D7C",
					500: "#B93C5F",
					600: "#922F4B",
					700: "#6C2338",
					800: "#451624",
					900: "#1F0A10",
				},
				"sandy-brown": {
					default: "#F0885C",
					100: "#FFFFFF",
					200: "#FDEEE8",
					300: "#F8CCB9",
					400: "#F4AA8A",
					500: "#F0885C",
					600: "#EB662D",
					700: "#D24D14",
					800: "#A33C0F",
					900: "#752B0B",
				},
				"white-rock": {
					default: "#EDEBD9",
					100: "#FFFFFF",
					200: "#FFFFFF",
					300: "#FFFFFF",
					400: "#FDFDFC",
					500: "#EDEBD9",
					600: "#DDD9B6",
					700: "#CDC793",
					800: "#BDB570",
					900: "#ABA24F",
				},
			},
		},
	},
	variants: {},
	plugins: [require("tailwindcss-neumorphism")],
};
