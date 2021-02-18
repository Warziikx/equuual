let ERROR_CODE = {
	/**
	 * Erreur de Dao / database / requete
	 */

	//ERREUR utilisateurDao
	50010: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un utilisateur",
	},
	50011: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table utilisateur",
	},
	50012: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'utilisateur",
	},
	50013: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un utilisateur",
	},
	50014: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un utilisateur",
	},
	//ERREUR deviceDao
	50020: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un device",
	},
	50021: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table device",
	},
	50022: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un device",
	},
	50023: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un device",
	},
	50024: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un device",
	},
	//ERREUR groupDao
	50030: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un groupe",
	},
	50031: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table group",
	},
	50032: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un groupe",
	},
	50033: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un groupe",
	},
	50034: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un groupe",
	},
	//ERREUR friendDao
	50040: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un friend",
	},
	50041: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table friend",
	},
	50042: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un friend",
	},
	50043: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un friend",
	},
	50044: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un friend",
	},
	//ERREUR spendDao
	50050: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un spend",
	},
	50051: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table spend",
	},
	50052: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un spend",
	},
	50053: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un spend",
	},
	50054: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un spend",
	},
	//ERREUR spendCustomerDao
	50060: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un spend_customer",
	},
	50061: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table spend_customer",
	},
	50062: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un spend_customer",
	},
	50063: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un spend_customer",
	},
	50064: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un spend_customer",
	},
	//ERREUR spendCustomerDao
	50070: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un group_member",
	},
	50071: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table group_member",
	},
	50072: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un group_member",
	},
	50073: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un group_member",
	},
	50074: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un group_member",
	},
	//ERREUR customerImgDao
	50080: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un customer_img",
	},
	50081: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table customer_img",
	},
	50082: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un customer_img",
	},
	50083: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un customer_img",
	},
	50084: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un customer_img",
	},
	//ERREUR optionDao
	50090: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un option",
	},
	50091: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table option",
	},
	50092: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un option",
	},
	50093: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un option",
	},
	50094: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un option",
	},
	//ERREUR groupOptionDao
	50100: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un option",
	},
	50101: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table option",
	},
	50102: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un option",
	},
	50103: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un option",
	},
	50104: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un option",
	},
	//ERREUR customerOriginDao
	50100: {
		http: 500,
		message: "une erreur est survenu lors de la création d'un customer origin",
	},
	50101: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table customer origin",
	},
	50102: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'un customer origin",
	},
	50103: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'un customer origin",
	},
	50104: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'un customer origin",
	},
	//ERREUR categoryDao
	50110: {
		http: 500,
		message: "une erreur est survenu lors de la création d'une category",
	},
	50111: {
		http: 500,
		message: "une erreur est survenu lors de la lecture de la table category",
	},
	50112: {
		http: 500,
		message: "une erreur est survenu lors de la lecture d'une category",
	},
	50113: {
		http: 500,
		message: "une erreur est survenu lors de l'edition d'une category",
	},
	50114: {
		http: 500,
		message: "une erreur est survenu lors de la suppression d'une category",
	},
};
module.exports = ERROR_CODE;
