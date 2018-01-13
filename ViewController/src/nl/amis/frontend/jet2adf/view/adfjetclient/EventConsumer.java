package nl.amis.frontend.jet2adf.view.adfjetclient;

import javax.faces.context.FacesContext;

import org.apache.myfaces.trinidad.render.ExtendedRenderKitService;
import org.apache.myfaces.trinidad.util.Service;

public class EventConsumer {
    public EventConsumer() {
        super();
    }

    public void handleCountryChangedEvent(Object payload) {
        System.out.println(">>>>>> Consume Event: " + payload);
        writeJavaScriptToClient("console.log('CountryChangeEvent was consumed; the new country value = "+payload+"'); processCountryChangedEvent('"+payload+"');");
      }

    //generic, reusable helper method to call JavaScript on a client
    private void writeJavaScriptToClient(String script) {
        FacesContext fctx = FacesContext.getCurrentInstance();
        ExtendedRenderKitService erks = null;
        erks = Service.getRenderKitService(fctx, ExtendedRenderKitService.class);
        erks.addScript(fctx, script);
    }
}
