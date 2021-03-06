package nl.amis.frontend.jet2adf.view.adfX;

import javax.faces.context.FacesContext;

import javax.faces.event.ValueChangeEvent;

import oracle.adf.model.BindingContext;
import oracle.adf.view.rich.component.rich.input.RichInputText;
import oracle.adf.view.rich.context.AdfFacesContext;

import oracle.binding.BindingContainer;
import oracle.binding.OperationBinding;

import org.apache.myfaces.trinidad.render.ExtendedRenderKitService;
import org.apache.myfaces.trinidad.util.ComponentReference;
import org.apache.myfaces.trinidad.util.Service;


public class DetailsBean {

    private String message;
    private ComponentReference messageField;

    public void setMessageComponent(RichInputText messageFieldInputText) {
        this.messageField = ComponentReference.newUIComponentReference(messageFieldInputText);
    }

    public RichInputText getMessageComponent() {
        if (this.messageField != null) {
            return (RichInputText) this.messageField.getComponent();
        } else {
            return null;
        }
    }
    public String getMessageComponentClientId() {
        FacesContext ctx = FacesContext.getCurrentInstance();
        return this.getMessageComponent().getClientId(ctx);
    }

    private ComponentReference browserField;

    public void setBrowserComponent(RichInputText browserFieldInputText) {
        this.browserField = ComponentReference.newUIComponentReference(browserFieldInputText);
    }

    public RichInputText getBrowserComponent() {
        if (this.browserField != null) {
            return (RichInputText) this.browserField.getComponent();
        } else {
            return null;
        }
    }
    public String getBrowserComponentClientId() {
        FacesContext ctx = FacesContext.getCurrentInstance();
        String id = this.getBrowserComponent().getClientId(ctx);
        writeJavaScriptToClient("console.log('Browser InputText CLient Id = "+id+"'); ADFXBrowserClientId ='"+id+"'");
        return id;
    }

    //generic, reusable helper method to call JavaScript on a client
    private void writeJavaScriptToClient(String script) {
        FacesContext fctx = FacesContext.getCurrentInstance();
        ExtendedRenderKitService erks = null;
        erks = Service.getRenderKitService(fctx, ExtendedRenderKitService.class);
        erks.addScript(fctx, script);
    }

    public void process(Object payload) {
        System.out.println("busy processing " + payload);
        setMessage(payload.toString());
        AdfFacesContext adfctx = AdfFacesContext.getCurrentInstance();
        adfctx.addPartialTarget(getMessageComponent());
        writeJavaScriptToClient("console.log('Message received "+payload.toString()+"');");
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }


    public void countryChangeHandler(ValueChangeEvent valueChangeEvent) {
        System.out.println("Country Changed to = " + valueChangeEvent.getNewValue());
        // find operation binding publishEvent and execute in order to publish contextual event
        BindingContainer bindingContainer = BindingContext.getCurrent().getCurrentBindingsEntry();
//        OperationBinding method = bindingContainer.getOperationBinding("publishCountryChangedEvent");
        OperationBinding method = bindingContainer.getOperationBinding("publishEvent");
        method.getParamsMap().put("payload", valueChangeEvent.getNewValue());
        method.execute();
    }
}
