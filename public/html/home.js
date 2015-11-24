ShopifyApp.init({
	apiKey: read_cookie('GLOB_API_KEY'),
	shopOrigin: 'https://' + read_cookie('GLOB_SHOP')
});

ShopifyApp.ready(function() {
	ShopifyApp.Bar.loadingOff()
});


function toggleWebhook(checked, webhookName) {
	console.log("toggled for " + webhookName);
	if (checked) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				if (xhttp.status == 200) {
					console.log("Success Adding Webhook");
				} else {
					console.log("Failed Adding Webhook");
				}
				console.log(xhttp.responseText);
			}
		};
		xhttp.open("GET", "action/createhook?topic=" + webhookName, true);
		xhttp.send();
	} else {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (xhttp.readyState == 4) {
				if (xhttp.status == 200) {
					console.log("Success Removing Webhook");
				} else {
					console.log("Failed Removing Webhook");
				}
				console.log(xhttp.responseText);
			}
		};
		xhttp.open("GET", "action/removehook?topic=" + webhookName, true);
		xhttp.send();		
	}
}