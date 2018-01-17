var jetIframeClientId = "";

function init() {
    window.addEventListener("message", function (event) {
        console.log("Parent receives message from iframe " + JSON.stringify(event.data));
        //{"message":{"eventType":"browserChanged","value":"Safari"}}
        var data = event.data;
        var message = data["message"];

        if (data && message){
        if ( message['eventType'] == 'browserChanged') {
            console.log("ADF JET Container Taskflow received browser changed event from JET App")
            var browser = message.value;
            publishEvent("browserSelectionEvent", 
            {
                "selectedBrowser" : browser
               ,"sourceTaskFlow" :"ADF-JET-container-taskflow"
               ,"eventOrigin" : "JET:jet-embedded"

            });
        }
        if ( message['eventType'] == 'deepMessage') {
            console.log("ADF JET Container Taskflow received deep message event from web App")
            var message = message.value;
            publishEvent("deepMessageEvent", 
            {
                "message" : message
               ,"sourceTaskFlow" :"ADF-JET-container-taskflow"
               ,"eventOrigin" : "JET:jet-embedded"

            });
        }        }
        else {
            sendMessageFromJetToServer(event.data);
        }
    },
    false);
    //    jetIframe.contentWindow.postMessage("hello tyhere", '*');
}

document.addEventListener("DOMContentLoaded", function (event) {
    init();
});

function sendMessageFromJetToServer(message) {
    //    // the actual IFRAME element rendered by ADF has an id thats ends with ::f
    //    var jetIframe = findIframeWithIdEndingWith('jetIframe::f');
    //    // the corresponding ADF element does not have that ::f postfix
    //    var jetIframeADFid  = jetIframe.id.substring(0, jetIframe.id.length-3); 
    //    // now we have the absolute id with which to find the client ide ADF component we are looking for
    //    console.log("The iframe id = "+ jetIframeClientId );
    //    
    var jetIframeADF = AdfPage.PAGE.findComponentByAbsoluteId(jetIframeClientId);
    AdfCustomEvent.queue(jetIframeADF, "messageRouter", message, true);
}

function findIframeWithIdEndingWith(idEndString) {
    var iframe;
    var iframeHtmlCollectionArray = document.getElementsByTagName("iframe");
    //http://clubmate.fi/the-intuitive-and-powerful-foreach-loop-in-javascript/#Looping_HTMLCollection_or_a_nodeList_with_forEach
[].forEach.call(iframeHtmlCollectionArray, function (el, i) {
        if (el.id.endsWith(idEndString)) {
            iframe = el;
        }
    });
    return iframe;
}

function processCountryChangedEvent(newCountry) {
    console.log("Client Side handling of Country Changed event; now transfer to IFRAME");

    var message = {
        'eventType' : 'countryChanged', 'payload' : newCountry
    };
    postMessageToJETIframe(message);
}

function postMessageToJETIframe(message) {
    var iframe = findIframeWithIdEndingWith('jetIframe::f');
    var targetOrigin = '*';
    iframe.contentWindow.postMessage(message, targetOrigin);
}

subscribeToEvent("colorSelectionEvent", handleColorSelection);

function handleColorSelection(payload) {
    console.log("ColorSelectionEvent consumed " + JSON.stringify(payload));
    var color = payload.selectedColor;
    console.log("selected color " + color);
    var message = {
        'eventType' : 'colorChanged', 'payload' : color
    };
    postMessageToJETIframe(message);
}
//handleColorSelection


subscribeToEvent("countrySelectionEvent", handleCountrySelection);
function handleCountrySelection(payload) {
    var country= payload.selectedCountry;
    var message = {
        'eventType' : 'countryChanged', 'payload' : country
    };
    postMessageToJETIframe(message);
}
//handleCountrySelection

subscribeToEvent("dataBoundJSONRefreshed", handleJSONRefreshed);

function handleJSONRefreshed(payload) {
    console.log("JSONRefreshed Event consumed in ADF-JET-Container " + JSON.stringify(payload));
    var jsonData = payload.jsonData;
    console.log("fresh JSON " + jsonData);
    var message = {
        'eventType' : 'freshJSON', 'payload' : jsonData
    };
    postMessageToJETIframe(message);

}
//handleColorSelection