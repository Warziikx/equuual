let ERROR_CODE = {
	20400: {
		http: 204,
		message: "Aucun resultat",
	},
	20401: {
		http: 204,
		message: "Aucun utilisateur",
	},
	20402: {
		http: 204,
		message: "Aucun groupe",
	},
	30300: {
		http: 200,
		message: "L'utilisateur doit définir un login",
		exception: "L'utilisateur doit définir un login",
	},

	40000: {
		http: 400,
		message: "Paramètres invalide",
		exception: "Parametre Invalide",
	},
	40101: {
		http: 401,
		message: "Impossible de trouver un utilisateur avec ce token",
	},

	40901: {
		http: 409,
		message: "Un utilisateur existe déjà avec cet identifiant",
	},
};
module.exports = ERROR_CODE;
