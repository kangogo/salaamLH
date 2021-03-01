(function ($) {

	CTXS.ExtensionAPI.addPlugin({
		name: "ns-nfactor", // Name of plugin - must match name sent in configuration
		initialize: function () {

			/*
			 * Custom credential handler for Google ReCaptcha.
			 * If a credential of type "nf-recaptcha" is sent in any factor, this code
			 * will be executed. The "submit" button of the form will be disabled
			 * by default until the captcha is completed correctly.
			 *
			 * Use with the below WebAuth action:
			 * add authentication webAuthAction recaptcha -serverIP <IP Address of google.com> -serverPort 443 -fullReqExpr q{"POST /recaptcha/api/siteverify HTTP/1.1\r\n" + "Host: www.google.com\r\n" + "Content-Type: application/x-www-form-urlencoded\r\n" + "Content-Length: 10000"+"\r\n\r\n" + "secret=<Secret key from Google Recaptcha>&response=" + http.req.body(10000).after_str("&recaptcha=")} -scheme https -successRule "http.RES.body(1000).REGEX_MATCH(re/\"success\": true.*\"hostname\": \"<FQDN of the Gateway/Auth vServer>\"/)"
			 *
			 */
			CTXS.ExtensionAPI.addCustomCredentialHandler({
				getCredentialTypeName: function () { return "nf-recaptcha"; },

				getCredentialTypeMarkup: function (requirements) {
					var reCaptchaSiteKey = ""; //Replace this with the SiteKey from Google ReCaptcha
					var div = $("<div></div>");
					var captcha = $('<div id="g-recaptcha" class="g-recaptcha" data-callback="captchaSuccess"></div>').attr("data-sitekey", reCaptchaSiteKey);
					var input = $('<input id="captchaResponse" name="recaptcha" type="hidden" value=""/>');
					div.append(captcha, input);
					
					loadJSFile("https://www.google.com/recaptcha/api.js");

					$(document).on('ctxsformsauthenticationdisplayform', function (e, data) {
						var $form = data.authenticationElement.find('.credentialform');
						var $captcha = $form.find('#g-recaptcha');
						$loginButton = $form.find('#loginBtn');
						if ($captcha.length && $loginButton.length) {
							// This is a Captcha form
							// Disable the submit button by default
							disableFormsButton($loginButton);
						}
					});

					return div;
				}
			});

			
			/* End ReCaptcha code */

			/*
			 * Custom code to be run when there is a challenge response from the authentication server
			 */
			CTXS.ExtensionAPI.addCustomCredentialHandler({
				getCredentialTypeName: function () { return "ns-dialogue"; },

				getCredentialTypeMarkup: function (requirements) {
					//var challengeText = requirements.label.text;
				if(typeof generateDialogHTML != "undefined") {
					return generateDialogHTML(requirements.label.text);
				}
					return $("<div></div>");
				}
			});

			/*
			   Move this funciton to script.js if you want custom HTML to be rendered during dialog mode

			   function generateDialogHTML(challengeText) {
			   		return $("<img src='https://otp.com'/>");
			   }
			 */

			CTXS.ExtensionAPI.addCustomAuthLabelHandler({

				getLabelTypeName: function () { return "dialogue-label"; },

				getLabelTypeMarkup: function (requirements) {
					var label = $('<div id="nf-dialogue" class="standaloneText label nsg_information" role="alert"></div>').html(requirements.label.text);
					return label;
				},
				parseAsType: function () {
				    	return "plain";
				    }
			});

			CTXS.ExtensionAPI.addCustomAuthLabelHandler({

				getLabelTypeName: function () { return "nsg-change-pass-assistive-text"; },

				getLabelTypeMarkup: function (requirements) {
					var label = $("<div></div>");
					var assistiveText = "chpasswd-assistive-text";
					var localizedMsg = _localize(assistiveText);
					if(localizedMsg != assistiveText){
						//Assistive text message has been configured. Display it as an information label
						var label = $('<div class="standaloneText label nsg_information" role="alert"></div>').text(localizedMsg);
					}					
					return label;
				},
				parseAsType: function () {
					return "plain";
				}
			});
			/* End challenge response code */


			CTXS.ExtensionAPI.addCustomAuthLabelHandler({
				// The name of the credential, must match the type returned by the server
				getLabelTypeName: function () { return "nf-manage-otp"; },
				// Generate HTML for the custom credential
				getLabelTypeMarkup: function (requirements) {
					var div = $("<div></div>").attr("id", "otp-main").addClass("otp-main");                
					var span = $("<span></span>").text(_localize("OTPRegisteredDevices")).addClass("standaloneText label plain").css("display","block");
					div.append(span);
					var br = $("<br/>");
					div.append(br);

					
					var selectWrapper = $("<div></div>");
					var select = $("<select name='registered-otp'></select>").attr("id", "registered-otp").addClass("unified-width");
					
					selectWrapper.append(select);
					
					var addButton = $("<a></a>").attr({"href":"#", "id":"add-otp", "title":_localize("OTPAddDeviceToolTip")}).addClass("otp-action default button padding-normal");
					selectWrapper.append(addButton);
					
					addButton.click(function (e) {
						e.preventDefault();
						showTextBox(this, "add", _localize("OTPEnterName"));
					});
					
					var testButton = $("<a></a>").attr({"href":"#", "id":"test-otp", "title":_localize("OTPTestDeviceToolTip")}).addClass("otp-action otp-test-delete default button").text(_localize("OTPTest"));
					
					testButton.click(function (e) {
						e.preventDefault();
						showTextBox(this, "test", _localize("OTPEnterTestValue"));
					});
					selectWrapper.append(testButton);
					
					var deleteButton = $("<a></a>").attr({"id":"delete-otp","href":"#"}).addClass("default button otp-action otp-test-delete").text(_localize("Delete"));
					deleteButton.click(function(e) {
							deleteDevice(e);
					});
					
					selectWrapper.append(deleteButton);					
									
					div.append(selectWrapper);
					div.append(br.clone());
					
					var right = $("<div></div>").addClass("left").css({"margin-top": "10px", "display": "none"}).attr("id", "text-container");
					var text = $("<input/>").attr({"id" : "otp-value", "name" : "otp-value", "type" : "text", "autocomplete" : "off", "spellcheck" : "false", "command" : "none", "maxlength" : "126"}).addClass("unified-width");
					
					right.append(text);
					
					var go = $("<a></a>").attr({"id":"otp-go","class":"default button"}).css("cursor", "pointer").text(_localize("Go"));
					
					go.click(function (e) {
						e.preventDefault();
						handleGo();
					});
					right.append(go);
					div.append(right);
					
					createTopMenu();
					$(document).on('ctxsformsauthenticationdisplayform', function (e, data) {
						ListDevices();
					});
					return div;
				},
				parseAsType: function () {
				    	return "plain";
				    }
			});

			CTXS.ExtensionAPI.addCustomCredentialHandler({
			    // The name of the credential, must match the type returned by the server
			    getCredentialTypeName: function () { return "nsg_qrcode"; },
			    // Generate HTML for the custom credential
			    getCredentialTypeMarkup: function (requirements) {
				    return $("<div id='otp-add-div'></div>");
					var image = $("<img/>");
					var secret = requirements.input.text.initialValue; //Get the secret from the response
					var data = secret.split(":");
					image.attr({
					    "id" : "qrcode-img",
						"src" : "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=otpauth%3A%2F%2Ftotp%2F" + data[1] + "%3Fsecret%3D" + data[0]
					});
			        div.append(image);
			        return div;
			    },
				getDataToAutoPost: function($form, requirements, success_callback) {
					var responseData = atob(requirements.input.text.initialValue);
					var data = responseData.split(":");
					var image = $("<img/>");
					var clear = $("<div></div>").attr("id", "clear-div").addClass("field");
					var addDiv = $("<div></div>").attr("id", "otp-conf-div").addClass("field unified-width");
					image.attr({
						"id" : "qrcode-img",
						"src" : "https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=otpauth%3A%2F%2Ftotp%2F" + data[1] + "%3Fsecret%3D" + data[0]
					});

					var messageLabel = $("<span></span>").addClass("standaloneText label information").attr({"role": "alert", "id" : "add-info-msg"});
					var message = _localize("OTPCode").split("{0}");
					var span1 = $("<span></span>").text(message[0]);
					var span2 = $("<span></span>").text(data[0]).addClass("otp-bold");
					var span3 = $("<span></span>").text(message[1]);

					messageLabel.append(span1, span2, span3);

					var div = $("<div></div>").addClass("left").attr("id", "add-info-msg-div");
					div.append(messageLabel);
					var div2 = $("<div></div>").addClass("field");
					div2.append(div);
					addDiv.append(div2);
					addDiv.append(image);

					var testButton = $("<a></a>").attr({"id":"conf-device-button","class":"default button"}).css("cursor", "pointer").text(_localize("Done"));
					testButton.click(function(e) {
						e.preventDefault();
						success_callback("Done");
					});

					addDiv.append(testButton);
					$("#otp-add-div").append(addDiv);

				}
			});
			
			CTXS.ExtensionAPI.addCustomCredentialHandler({
			    // The name of the credential, must match the type returned by the server
				getCredentialTypeName: function () { return "nsg_manageotp"; },
			    // Generate HTML for the custom credential
			    getCredentialTypeMarkup: function (requirements) {
				var div = $("<div></div>");
				var devicehint = $('<input name="otpdevice" id="otpdevice" type="text"><br>');
				div.append(devicehint);
				
				//This code is run just before a form is displayed to the user
				//Register this only if nsg_manageotp is sent in the authv2 form
				$(document).on('ctxsformsauthenticationdisplayform', function (e, data) {
					var otpDevice = $(".CredentialTypensg_manageotp");
					otpDevice.hide(); //Hide by default
					$('#otpregister').click(function() {
						var rsaField = $($(".credentialform").find(".CredentialTypepassword")[1]);
						if (rsaField) {
							if($(this).is(':checked')){
								$("#passwd1").val("");
								rsaField.hide();
								otpDevice.show();
							} else {
								$("#otpdevice").val("");
								rsaField.show();
								otpDevice.hide();
							}
				}
			});
				});

				return div;
		}
	});
		}
	});
})(jQuery);

var $loginButton;
function captchaSuccess(data) {
	$("#captchaResponse").val(data);
	enableFormsButton($loginButton);
}

function disableFormsButton($button) {
	// Disable the button and stop it appearing clickable
	$button.addClass('disabled').removeAttr('href');
}
function enableFormsButton($button) {
	// Enable the button and make it clickable again
	$button.removeClass('disabled').attr('href', '#');
}

function loadJSFile(path, qrcodeDiv, data)
{
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = path;
	script.onerror = function(){
		var $form = $(".credentialform")[0];
		var fieldDiv = $('<div class="field CredentialTypenone"></div>');
		var leftDiv = $('<div class="left"></div>');
		var label = $('<div class="standaloneText label error qrerror" role="alert"></div>').text(_localize("OTPQRError"));
		leftDiv.append(label);
		fieldDiv.append(leftDiv);
		$($form).append(fieldDiv);
	};
	if(qrcodeDiv != null && data != null)
	{
		script.onload = function(){
			var qrcode = new QRCode(qrcodeDiv, {
			text: "otpauth://totp/" + data[1] + "?secret=" + data[0],
			width: 128,
			height: 128,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
			});
		};
	}

	$("head")[0].appendChild(script);
}

/* OTP Functions start */


function showTextBox(btn, command, message) {
	if($(btn).hasClass("otp-disabled")) {
		return;
	}
	removeInfoMessage();
	var textBox = $("#otp-value");
	textBox.val("");
	textBox.attr({"placeholder": message, "title": message});
	var prevCommand = textBox.attr("command");
	if(textBox.is(":visible")) {
		if(prevCommand === command) {
			textBox.attr("command", "none");
			$("#text-container").slideUp(250);
		} else {
			textBox.attr("command", command);
		}	
	} else {
		textBox.attr("command", command);
		$("#text-container").slideDown(250);
	}
}

function handleGo() {
	var textBox = $("#otp-value");
	var command = textBox.attr("command");
	removeInfoMessage();
	$("#otp-conf-div").remove();
	if(command === "test") {
		testDevice();
	} else if (command === "add") {
		AddOTPDevice();
	}
}

function removeInfoMessage() {
	$("#confirmation-msg").remove();
}

function testDevice(e) {

	if($("#registered-otp").find("option").length == 0) {
		return;
	}
	if($("#otp-value").val() == "") {
		displayMessage("error", "OTPEnterTestValue");
		return;
	}
	var postData = {};
	postData['command'] = 'test';
	postData['devicename'] = $("#registered-otp").val();
	postData['otp'] = $("#otp-value").val();
	sendOTPRequest(otpURL, postData, testSuccess, testError);
	
}

function testSuccess(responseData, textStatus, XMLHttpRequest) {
	var deviceName = $("#registered-otp option:selected").text();
	if (responseData.indexOf("yes") != -1) {
		displayMessage("confirmation", "OTPTestSuccess", deviceName);
	} else {
		displayMessage("error", "OTPTestFailure", deviceName);
	}
}

function testError(responseData, textStatus, XMLHttpRequest) {
	var deviceName = $("#registered-otp option:selected").text();
	displayMessage("error", "OTPTestFailure", deviceName);
}

function AddOTPDevice(e) {
	var deviceName = $.trim($("#otp-value").val());
	var exists = false;
	if(deviceName == "" || deviceName == undefined) {
		displayMessage("error", "OTPEnterName");
		return;
	}
	$('#registered-otp option').each(function(){
	    if (this.value == deviceName) {
	        exists = true;
	        return false;
	    }
	});
	if(exists == true)
	{
		displayMessage("error", "OTPDeviceExists", deviceName);
		return;
	}
	var postData = {};
	postData['devicename'] = deviceName;
	postData['command'] = 'add';
	sendOTPRequest(otpURL, postData, AddOTPDeviceSuccess, AddOTPDeviceSuccess);
}

function AddOTPDeviceSuccess(responseData, textStatus, XMLHttpRequest) {
	var deviceName = $.trim($("#otp-value").val());
	if (responseData.indexOf("code") == -1) {
		displayMessage("error", "OTPAddFailure", deviceName);
		return;
	}
	//format: code=foobar&url=foobar:uname
	var resp = responseData.split("&");
	var image = $("<img/>");
	var code = resp[0].split("=");
	var url = resp[1].split("=");
	data = url[1].split(":")
	var clear = $("<div></div>").attr("id", "clear-div").addClass("field");
	var addDiv = $("<div></div>").attr("id", "otp-conf-div").addClass("field unified-width");
	
	var qrcodeDiv = document.createElement("div");
	qrcodeDiv.id = "qrcode-img";

	loadJSFile("plugins/ns-gateway/qrcode.min.js", qrcodeDiv, data);
	
	var messageLabel = $("<span></span>").addClass("standaloneText label information").attr({"role": "alert", "id" : "add-info-msg"});
	var message = _localize("OTPCode").split("{0}");

	var span1 = $("<span></span>").text(message[0]);
	var span2 = $("<span></span>").text(code[1]).css("font-weight", "bold");
	var span3 = $("<span></span>").text(message[1]);
	
	messageLabel.append(span1, span2, span3);
	
	var div = $("<div></div>").addClass("left").attr("id", "add-info-msg-div");
	div.append(messageLabel);
	var div2 = $("<div></div>").addClass("field");
	div2.append(div);
	addDiv.append(div2);
	addDiv.append($(qrcodeDiv));
	
	var testButton = $("<a></a>").attr({"id":"conf-device-button","class":"default button"}).css("cursor", "pointer").text(_localize("Done"));
	testButton.click(function(e) {
		e.preventDefault();
		$("#otp-conf-div").remove();
		$("#clear-div").remove();
		removeInfoMessage();
		$("#otp-val").val("");
		$("#text-container").slideUp(250);
		enableOTPButtons();
		displayMessage("confirmation", "OTPAddSuccess", deviceName);
	});
	
	disableOTPButtons();
	addDiv.append(testButton);
	
	$("#text-container").hide();
	
	$("#registered-otp").prop('disabled', false);
	$("#otp-main").append(clear, addDiv);
	var option = $("<option></option>").text(deviceName).val(deviceName);
	var exists = false;
	$('#registered-otp option').each(function(){
		if (this.value == deviceName) {
			exists = true;
		}
	});
	if (exists == false) {
		$("#registered-otp").append(option);
		var noDevicesOption = $("#no-devices");
		if(noDevicesOption.length) {
			//Device was added from FTU. Shrink add button and show test and delete.
			$("#add-otp").text("").removeClass("padding-FTU").addClass("padding-normal");
			$(".otp-test-delete").show();
			noDevicesOption.remove();
		}
	}
}

function deleteDevice(e) { 
	e.preventDefault();
	if(($("#registered-otp").find("option").length == 0) ||
		($("#delete-otp").hasClass("otp-disabled"))) {
			return;
	}
	var deviceName = $("#registered-otp option:selected").text();

	CTXS.ExtensionAPI.showMessage({
		localize: true,
		messageText: _localize("OTPDeleteDeviceConfirm", deviceName),
		messageTitle: "OTPConfirmDelete",
		okButtonText: "Yes",
		cancelButtonText: "No",
		isalert: true,
		okAction: function() {
				$("#otp-value").val("").attr("command", "none");
				$("#text-container").slideUp(250);
				var postData = {};
				postData['devicename'] = $("#registered-otp").val();
				postData['command'] = 'rm';
				sendOTPRequest(otpURL, postData, deleteSuccess, deleteSuccess);
		},
		cancelAction: function() {
		}
	});
}

function displayFTUUI() {
	$("#add-otp").text(_localize("OTPAddDeviceToolTip")).removeClass("padding-normal").addClass("padding-FTU");
	var noDevice = $("<option></option>").attr("id", "no-devices").text(_localize("OTPNoDevices"));
	$("#registered-otp").append(noDevice).prop('disabled', 'disabled');
	$(".otp-test-delete").hide();
}

function ListSuccess(responseData, textStatus, XMLHttpRequest) {
	if (responseData.length == 0 || responseData == "no") {
		//FTU Case
		displayFTUUI();
		return;
	}
	$("#registered-otp").empty().prop('disabled', false);
	var current_device = $("#otp-value").val();
	var devicenames = responseData.split(",")
	for(i=0; i<devicenames.length; i++) {
		var deviceName = decodeURIComponent(devicenames[i].replace(/\+/g, ' '));
		option = $("<option></option>").text(deviceName).val(deviceName);
		if(current_device == deviceName)
        {
           option.attr("selected","selected");
        }
		$("#registered-otp").append(option);
	}
}

function deleteAllDevices(e) {
	//e.preventDefault();
	if($("#registered-otp").find("option").length == 0) {
			//return;
	}
	CTXS.ExtensionAPI.showMessage({
			localize: true,
			messageText: "OTPDeleteAllConfirm",
			messageTitle: "OTPConfirmDelete",
			okButtonText: "Yes",
			cancelButtonText: "No",
			isalert: true,
			okAction: function() {
					var postData = {};
					postData['command'] = 'rm';
					sendOTPRequest(otpURL, postData, deleteAllSuccess, deleteAllSuccess);
			},
			cancelAction: function() {
			}
	});
}

function deleteSuccess(responseData, textStatus, XMLHttpRequest) {
	var deviceName = $("#registered-otp option:selected").text();
	if (responseData.indexOf("yes") != -1) {
		$("#registered-otp option:selected").remove();
		displayMessage("confirmation", "OTPDeleteDeviceSuccess", deviceName);
		if($("#registered-otp option").length == 0) {
			displayFTUUI();
		}
	} else {
		displayMessage("error", "OTPDeleteDeviceFailure", deviceName);
	}
}

function deleteAllSuccess(responseData, textStatus, XMLHttpRequest) {
	if (responseData.indexOf("yes") != -1) {
		displayMessage("confirmation", "OTPDeleteAllSuccess");
		$("#registered-otp").empty();
	} else {
		displayMessage("error", "OTPDeleteAllFailure");
	}
        
}

function ListDevices(e) {
	sendOTPRequest(otpURL, "command=list", ListSuccess, ListSuccess);
}

function displayMessage(type, text)
{
	$("#confirmation-msg").remove();
	var localizedText = text;

	if(arguments.length > 2) {
		localizedText = _localize(text, arguments[2]);
	} else {
		localizedText = _localize(text);
	}
	
	var message = $("<div></div>").addClass("standaloneText label " + type).attr({"role": "alert", "id" : "otp-message-text"}).text(localizedText);
	var div = $("<div></div>").addClass("left");
	div.append(message);
	var div2 = $("<div></div>").addClass("field").attr("id", "confirmation-msg");
	div2.append(div);
	$(".credentialform").append(div2);
}

function errorHandler(responseData, textStatus, XMLHttpRequest) {
	console.log("Error! Status = " + textStatus);
}

var otpURL = "/nf/auth/nsotp";

function sendOTPRequest(url, postData, successFunction, failureFunction)
{
	$.ctxsAjax({
			store: null,
			type: 'POST',
			url: url,
			dataType: 'text',
			data: postData,
			async: false,
			refreshSession: true,
			success: successFunction,
			error: failureFunction
	});
}


function createTopMenu() {
	var menuItems = [];
	var $header = $("#customExplicitAuthHeader");
	$header.html("<header class=\"gateway store-header theme-header-bgcolor\"><span class=\"header-title theme-header-color phone-only\"></span><div class=\"headerRight\"><div class=\"dropdown-menu-container user-menu\"><a id=\"userMenuBtn\" href=\"#\" class=\"dropdown-menu-trigger settings-button\"><p class=\"theme-header-color user-display-name _ctxstxt_Menu\"></p><div class=\"settings-button-arrow view-sprite\"></div></a><div class=\"dropdown-menu\"><div class=\"dropdown-menu-top\"></div><div class=\"dropdown-menu-body\"></div><div class=\"dropdown-menu-bottom\"></div></div></div><a class=\"help-icon view-sprite\" href=\"#\"></a></div></header>");

	var $userMenu = $header.find('.user-menu.dropdown-menu-container');

	menuItems.push({
		linkId: "menuLogOffBtn_gateway",
		linkText: _localize('LogOff'),
		ariaLabel: _localize('LogOff'),
		toolTip: null,
		onClick: function() {
			// Wrapped so 'this' is set correctly
			CTXS.Environment.logOff();
		}
	});

	var userMenu = new CTXS.Widgets.DropDownMenuWidget($userMenu, $('#user-menu-overlay'), {
		menuItems: menuItems,
		menuItemClass: 'theme-highlight-color'
	});

	function SuccessCallback_username(username){
		$(".user-display-name").text(username);
	}
	CTXS.Environment.getUserDisplayName(SuccessCallback_username);
}

function disableOTPButtons() {
	$(".otp-action").addClass("otp-disabled");
}

function enableOTPButtons() {
	$(".otp-action").removeClass("otp-disabled");
}

/* OTP Functions End */

/* Credential handler for handling negotiate/ntlm */
CTXS.ExtensionAPI.addCustomCredentialHandler({
    // The name of the credential, must match the type returned by the server
    getCredentialTypeName: function () { return "negotiate"; },
    // Generate HTML for the custom credential
    getCredentialTypeMarkup: function (requirements) {
        return $("<div></div>");
    },
    getDataToAutoPost: function ($form, requirements, success_callback) {
        var callback = success_callback;
		var negotiateURL = base64decode(requirements.input.text.initialValue);
		var context = negotiateURL;
		negotiateURL = "/nf/auth/doNegotiate.do?" + negotiateURL;
        $.ctxsAjax({
            store: null,
            type: 'POST',
            url: negotiateURL,
            dataType: 'text',
            async: false,
            refreshSession: true,
            success: function (data) {
                success_callback(data);
            },
            error: function (data) {
                success_callback("failure&"+context);
            }
        });
    }
});
