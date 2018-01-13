var jetIframeClientId ="";

function init() {
    window.addEventListener("message", function (event) {
        console.log("Parent receives message from iframe " + event);
        sendMessageFromJetToServer(event.data);
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
    
    var iframe = findIframeWithIdEndingWith('jetIframe');
        var targetOrigin = '*';

    iframe.contentWindow.postMessage("{'eventType':'countryChanged','payload':'"+newCountry+"'}", targetOrigin);

}

  function loadHandler(event)
   {
    console.log("Reload eevnt from iframe "+JSON.stringify(event));
   }