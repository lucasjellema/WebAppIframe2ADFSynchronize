 function publishColorSelection(color) {
          publishEvent("colorSelectionEvent", 
          {
              "selectedColor" : color
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

function handleBrowserSelection(payload) {
    console.log("BrowserSelectionEvent consumed in ADF X Taskflow" + JSON.stringify(payload));
    var browser = payload.selectedBrowser;
    console.log("selected browser " + browser+" going to update component "+ADFXBrowserClientId);
        var browserInputText = AdfPage.PAGE.findComponentByAbsoluteId(ADFXBrowserClientId);
        browserInputText.setValue(browser); 
    // global variable ADFXBrowserClientId was set 

}      