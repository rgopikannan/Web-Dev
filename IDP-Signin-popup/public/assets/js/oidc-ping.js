//var brokerENVUrls={
//	devnx:'https://devnx-idp-cluster.np.elsevier-ae.com',
//	certnx:'https://certnx-idp-cluster.np.elsevier-ae.com',
//	loadrc:'https://loadrc-idp-cluster.np.elsevier-ae.com',
//	loadcp:'https://loadcp-idp-cluster.np.elsevier-ae.com',
//	local:'https://localhost:9031'
//}
//var allowedENVs=['devnx','certnx','loadcp','loadrc','local'];

var tokenParams = {
	brokerUri: getBrokerURI(),
	redirectionURI: getRedirectionURI(),
	clientId: getContentByMetaTagName('clientId'),
	scope: getContentByMetaTagName('scope'),
	platSite: getContentByMetaTagName('platSite'),
	uiLocales: getContentByMetaTagName('uiLocales')	
}




function getBrokerURI() {
	var element = document.getElementById('CTALibrary');
	var bokerURI;
	if (element) {
		url = element.src;
		var arr = url.split("/");
		bokerURI = arr[0] + "//" + arr[1];
		if (url.indexOf(":") >= 0) {
			bokerURI = bokerURI + arr[2];
		}
	}
	return bokerURI;
}
//step 1, Reading response from Ping , and storing it into session storage it is  
if (window.location.href.indexOf('#') >= 0) {
	var errorMsg = getErrorMessage();
	if (!errorMsg) {
		var accessToken = getAccessToken();
		var idToken = getIdToken();
		// Check for sessionStorage support.
		if (sessionStorage) {
			// Save the token in sessionStorage.
			sessionStorage.setItem('access', accessToken);
			sessionStorage.setItem('idtoken', idToken);
		}
	}
}

// this function will autorun and assign href value for sign in button.
prepareTokenUrl();


//it will be called by Client. if they like to implement SSO on their website
function getAccessTokenUsingSSO() {
	var ssoToken;
	if (sessionStorage) {
		ssoToken = sessionStorage.getItem('access');
	}
	if (!ssoToken || typeof ssoToken === 'undefined') {
		url = getTokenUrlWithPrompt('none')
		window.location = url;
	}
	return ssoToken;
}

//To read value of meta tags which are considered standard for CTACLient Library	
function getContentByMetaTagName(c) {
	for (var b = document.getElementsByTagName("meta"), a = 0; a < b.length; a++) {
		if (c == b[a].name || c == b[a].getAttribute("property"))
		{ return b[a].content; }
	} return false;
}

// Read Meta tag value for CTAClient Library , dedicated function is being written to determine protocal for redirectionURI . it should be same as Client URL's protocal http[s]
function getRedirectionURI() {
	var uri = getContentByMetaTagName('redirectionURI')
	if (uri.indexOf(window.location.host) >= 0) {
		return uri;
	} else { uri = location.host + uri };
	if (!(uri.indexOf("http") >= 0 || uri.indexOf("https") >= 0)) {
		uri = getProtocal() + uri;
	}
	return uri;
}

//determine env name and get ping host
function getBrokerURI() {
	var element = document.getElementById('CTALibrary');
	var bokerURI;
	if (element) {
		url = element.src;
		var arr = url.split("/");
		bokerURI = arr[0] + "//" + arr[1];
		if (url.indexOf(":") >= 0) {
			bokerURI = bokerURI + arr[2];
		}
	}
	return bokerURI;
}



//Return OAUTH authorization endpoint for token URL , implicit flow will be triggered using this endpoint URL
function getTokenUrl() {
	var brokerUri = tokenParams.brokerUri;
	if (!brokerUri) {
		brokerUri = getBrokerURI();
	}
	var authorizationUrl = brokerUri + '/as/authorization.oauth2';

	var response_type = "token id_token";
	var auth_type = "SINGLE_SIGN_IN";
	var url =
		authorizationUrl + "?" +
		"client_id=" + encodeURI(tokenParams.clientId) + "&" +
		"redirect_uri=" + encodeURI(tokenParams.redirectionURI) + "&" +
		"response_type=" + encodeURI(response_type) + "&" +
		"scope=" + encodeURI(tokenParams.scope) + "&" +
		"authType=" + encodeURI(auth_type) + "&" +
		"prompt=login&" +
		"platSite=" + encodeURI(tokenParams.platSite) + "&" +
		"ui_locales="+encodeURI(tokenParams.uiLocales)+ "&" +
		"nonce="+getState()+ "&" +
		"state="+getState();
	return url;
}


function getState() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";

  for (var i = 0; i < 10; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

//Assign OAUTH Token end point url to button having ID as CTAClient
function prepareTokenUrl() {
	var url = getTokenUrl();
	var cta = document.getElementById("CTAClient");
	if (cta) {
		if (location.href.indexOf(cta.href) >= 0) {
			cta.href = url;
		}
	}
}

//Function to return url for prompt=none or can say SSO 
function getTokenUrlWithPrompt(prompt) {
	var brokerUri = tokenParams.brokerUri;
	if (!brokerUri) {
		brokerUri = getBrokerURI();
	}
	var authorizationUrl = brokerUri + '/as/authorization.oauth2';

	var response_type = "token id_token";
	var auth_type = "SINGLE_SIGN_IN";
	var url =
		authorizationUrl + "?" +
		"client_id=" + encodeURI(tokenParams.clientId) + "&" +
		"redirect_uri=" + encodeURI(tokenParams.redirectionURI) + "&" +
		"response_type=" + encodeURI(response_type) + "&" +
		"scope=" + encodeURI(tokenParams.scope) + "&" +
		"authType=" + encodeURI(auth_type) + "&" +
		"platSite=" + encodeURI(tokenParams.platSite) + "&" +
		"prompt=" + encodeURI(prompt) + "&" +
		"ui_locales="+encodeURI(tokenParams.uiLocales)+ "&" +
		"nonce=cba56666-4b12-456a-8407-3d3023fa1002";
	return url;
}

//get accesss token from sessionStorage 
function getAccessToken() {
	var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
	if (!queryString || queryString.length <= 0) {
		queryString = sessionStorage.getItem('access');
		return queryString;
	} else {
		while (m = regex.exec(queryString)) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		if (params.access_token) {
			//return parseJwt(params.access_token,1);
			return params.access_token;
		}
	}
}

//get accesss token from sessionStorage 
function getStateParam() {
	var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
	if (!queryString || queryString.length <= 0) {
		queryString = sessionStorage.getItem('state');
		return queryString;
	} else {
		while (m = regex.exec(queryString)) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		if (params.access_token) {
			//return parseJwt(params.access_token,1);
			return params.access_token;
		}
	}
}

//get accesss token from sessionStorage 
function getDecodedAccessToken() {
	var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
	if (!queryString || queryString.length <= 0) {
		queryString = sessionStorage.getItem('access');
		return queryString;
	} else {
		while (m = regex.exec(queryString)) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		if (params.access_token) {
			return parseJwt(params.access_token,1);
			
		}
	}
}

//get ID Token from sessionStorage
function getIdToken() {
	var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
	if (!queryString || queryString.length <= 0) {
		queryString = sessionStorage.getItem('idtoken');
		return queryString;
	} else {
		while (m = regex.exec(queryString)) {
			params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
		}
		return parseJwt(params.id_token, 1);
	}
}

//read error messages in if any
function getErrorMessage() {
	var params = {}, queryString = location.hash.substring(1), regex = /([^&=]+)=([^&]*)/g, m;
	while (m = regex.exec(queryString)) {
		params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
	}
	if (params.error_description) {
		return params.error_description;
	}
	return params["error"];

}


function parseJwt(token, c) {
	var base64Url = token.split('.')[c];
	var base64 = base64Url.replace('-', '+').replace('_', '/');
	return JSON.stringify(JSON.parse(window.atob(base64)));
}

function getJsonDom(token) {
	var base64Url = token.split('.')[1];
	var base64 = base64Url.replace('-', '+').replace('_', '/');
	var dom = JSON.parse(window.atob(base64));
	return dom;
}

function getUserName() {
	var dom = JSON.parse(getIdToken());
	return dom.preferred_username;
}

function getUserInfo() {
	var dom = JSON.parse(getIdToken());
	return dom.email + ',' + dom.given_name + ',' + dom.preferred_username
}

function getClientName() {
	var dom = JSON.parse(getIdToken());
	return dom.aud;
}

function getDN() {
	var dom = JSON.parse(getIdToken());
	return dom.DN;
}

function getMail() {
	var dom = JSON.parse(getIdToken());
	return dom.mail;
}

function getSubject() {
	var dom = JSON.parse(getIdToken());
	return dom.sub;
}

function getNonce() {
	var dom = JSON.parse(getIdToken());
	return dom.nonce;
}

function getWebUserId() {
	var dom = JSON.parse(getIdToken());
	return dom.DN;
}

function getClientID() {
	var dom = JSON.parse(getIdToken());
	return dom.aud;
}

function getScope() {
	var dom = JSON.parse(getAccessToken());
	return dom.scope;
}

function getExpiry() {
	var dom = JSON.parse(getAccessToken());
	var date = getDuration(dom.exp);

	var time = date.toString("MMM dd");
	return new Date(dom.exp).toUTCString();
}

function getDuration(millis) {
	var dur = {};
	var units = [
		{ label: "millis", mod: 1000 },
		{ label: "seconds", mod: 60 },
		{ label: "minutes", mod: 60 },
		{ label: "hours", mod: 24 },
		{ label: "days", mod: 31 }
	];
	// calculate the individual unit values...
	units.forEach(function (u) {
		millis = (millis - (dur[u.label] = (millis % u.mod))) / u.mod;
	});
	// convert object to a string representation...
	var nonZero = function (u) { return dur[u.label]; };
	dur.toString = function () {
		return units
			.reverse()
			.filter(nonZero)
			.map(function (u) {
				return dur[u.label] + " " + (dur[u.label] == 1 ? u.label.slice(0, -1) : u.label);
			})
			.join(', ');
	};
	return dur;
};

function getProtocal() {
	var url = window.location.href
	var arr = url.split("/");
	return arr[0] + "//";
}

function getUrlParams(url) {
	var s = url.slice(1); // removes the beginning "?"
	var keyValuePairs = s.split("&");
	var keyValue, params = {};
	keyValuePairs.forEach(function (pair) {
		keyValue = pair.split("=");
		params[keyValue[0]] = decodeURIComponent(keyValue[1]).replace("+", " ");
	});
	return params
}


function signOutUser() {
	window.sessionStorage.removeItem('access');
	window.sessionStorage.removeItem('idtoken');
}
