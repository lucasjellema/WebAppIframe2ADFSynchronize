package nl.amis.frontend.jet2adf.view;


import javax.faces.context.FacesContext;

import javax.servlet.http.HttpServletRequest;

import oracle.adf.view.rich.component.rich.input.RichInputText;
import oracle.adf.view.rich.context.AdfFacesContext;

import org.apache.myfaces.trinidad.render.ExtendedRenderKitService;
import org.apache.myfaces.trinidad.util.ComponentReference;
import org.apache.myfaces.trinidad.util.Service;

public class JsonProviderBean {
    private ComponentReference jsonContainer;

    public RichInputText getJsonContainer() {
        if (jsonContainer != null) {
            return (RichInputText) jsonContainer.getComponent();
        }
        return null;
    }

    // in every HTTP request cycle (including PPR requests) this method will be invoked. That means there is a new opportunity to refresh the JSON payload container and execute JavaScript to trigger any client side code
    public void setJsonContainer(RichInputText jsonContainer) {        
        this.jsonContainer = ComponentReference.newUIComponentReference(jsonContainer);
        //https://technology.amis.nl/2008/08/07/forcing-refresh-of-an-adf-faces-component-with-every-partial-page-request/
        FacesContext fctx = FacesContext.getCurrentInstance();
        //http://stackoverflow.com/questions/41821470/oracle-adf-response-sendredirect-is-not-working-for-ppr-requests
        boolean isPPR = fctx.getPartialViewContext().isAjaxRequest();
        HttpServletRequest req =
            (HttpServletRequest) fctx.getExternalContext().getRequest();
        if (isPPR) {
            ExtendedRenderKitService erks = Service.getRenderKitService(fctx, ExtendedRenderKitService.class);
            String myJavaScriptCode = "initializeJsonPayloads();";
            // this javaScript snippet is executed for each PPR request!
            erks.addScript(fctx, myJavaScriptCode);
            
            // add as partial target the UI Components that carry the client attributes with the JSON payloads
            AdfFacesContext.getCurrentInstance().addPartialTarget(jsonContainer);
        }


    }
}
