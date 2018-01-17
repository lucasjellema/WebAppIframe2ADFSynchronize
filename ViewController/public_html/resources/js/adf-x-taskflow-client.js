function publishColorSelection(color) {
    publishEvent("colorSelectionEvent", 
    {
        "selectedColor" : color, "sourceTaskFlow" : "ADF-X-taskflow"
    });
}

function clickRed(evt) {
    evt.cancel();
    publishColorSelection('red');
}

function clickYellow(evt) {
    evt.cancel();
    publishColorSelection('yellow');
}

function clickBlue(evt) {
    evt.cancel();
    publishColorSelection('blue');
}

subscribeToEvent("browserSelectionEvent", handleBrowserSelection);
subscribeToEvent("deepMessageEvent", handleDeepMessageSelection);

function handleBrowserSelection(payload) {
    console.log("BrowserSelectionEvent consumed in ADF X Taskflow" + JSON.stringify(payload));
    var browser = payload.selectedBrowser;
    console.log("selected browser " + browser + " going to update component " + ADFXBrowserClientId);
    var browserInputText = AdfPage.PAGE.findComponentByAbsoluteId(ADFXBrowserClientId);
    browserInputText.setValue(browser);
    // global variable ADFXBrowserClientId was set 
}

function handleDeepMessageSelection(payload) {
    console.log("DeepMessageEvent consumed in ADF X Taskflow" + JSON.stringify(payload));
    var message = payload.message;
    // find inputText component using its fake styleClass: messageInputHandle
    var msgInputFieldId = document.getElementsByClassName("messageInputHandle")[0].id;
    var msgInputText = AdfPage.PAGE.findComponentByAbsoluteId(msgInputFieldId);
    msgInputText.setValue(message);    
}

function countrySelectionListener(event) {
    var selectOneChoice = event.getSource();
    var newValue = selectOneChoice.getSubmittedValue();
    var selectItems= selectOneChoice.getSelectItems();
    var selectedItem = selectItems[newValue];
    publishEvent("countrySelectionEvent", 
    {
        "selectedCountry" : selectedItem._label, "sourceTaskFlow" : "ADF-X-taskflow"
    });
}