var crypto = require('crypto');
var db = require('../modules/database.js')

exports.confirm = function(query) {


	return isValidHmac(query) && isValidShop(query);
}

function isValidShop(query) {
	var shop = query.shop;
	var nonce = query.state;

	//validate shop name. Must end with myshopify.com and must not contain characters other than letters (a-z), numbers (0-9), dots, and hyphens. 
	var suffix = "myshopify.com";
	if (shop.indexOf(suffix, shop.length - suffix.length) != -1 && shop.indexOf("([^0-9a-z\.\-])+") == -1) {

		var shopObject = db.getObject("users/" + shop);
		if (shopObject == undefined)
			if (shopObject.nonce == nonce)
				return true; //VALID
	}

	return false;
}

function isValidHmac(query) {
	var shared_secret = "1604e972c082a4a3bb6384c1460f3458";

	var preprocString = encodeParamsForSignature(query);

	// console.log(query);
	console.log("shared_secret: " + shared_secret);
	console.log("timestamp: " + query.timestamp);
	console.log("preprocString " + preprocString);

	var calcedHmac = crypto.createHmac("SHA256", shared_secret).update(new Buffer(preprocString)).digest('hex');

	var givenHmac = query.hmac;

	console.log("Given HMAC      " + givenHmac);
	console.log("Calculated HMAC " + calcedHmac);

	if (givenHmac != calcedHmac) {
		console.log("FAILED Authentication");
		return false;
	}
	return true;
}


function encodeParamsForSignature(object) {
	var list = [];
	for (var property in object) {
		if (object.hasOwnProperty(property)) {
			if (property != "hmac" && property != "signature")
				list.push(property + "=" + object[property]);
		}
	}
	return list.sort().join('&');
}