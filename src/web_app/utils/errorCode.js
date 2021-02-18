let ERROR_CODE = {
	40000: {
		message: "Paramètre invalide",
		exception: "Paramètre invalide",
		http: 400,
	},
	40401: {
		message: "Impossible de trouver un compte correspondant à ces identifiant",
		exception: "Aucun utilisateur avec ces identifiants",
		http: 500,
	},
	40402: {
		message: "Impossible de trouver un groupe correspondante",
		exception: "Aucun groupe avec cet identifiant",
		http: 500,
	},
	40403: {
		message: "Aucun utilisateur avec cet id n'est membre de ce groupe",
		exception: "Aucun utilisateur avec cet id n'est membre de ce groupe",
		http: 500,
	},
	40404: {
		message: "Impossible de trouver un compte correspondant à cette adresse email",
		exception: "Aucun utilisateur avec ces identifiants",
		http: 500,
	},
	40900: {
		message: "Un utilisateur existe déjà avec cet identifiant",
		exception: "User already exist with this number",
		http: 500,
	},
	40901: {
		message: "Une publication existe déjà avec ce numéro",
		exception: "Issue already exist with this number",
		http: 500,
	},
};

module.exports = ERROR_CODE;
