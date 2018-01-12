package nl.amis.frontend.jet2adf.view.adfjetclient;

import javax.faces.context.FacesContext;

import oracle.adf.model.BindingContext;
import oracle.adf.view.rich.component.rich.output.RichInlineFrame;
import oracle.adf.view.rich.render.ClientEvent;

import oracle.binding.BindingContainer;
import oracle.binding.OperationBinding;

import org.apache.myfaces.trinidad.render.ExtendedRenderKitService;
import org.apache.myfaces.trinidad.util.ComponentReference;
import org.apache.myfaces.trinidad.util.Service;

public class Client2Server {

    public Client2Server() {
        super();
    }
    public String getJetInlineFrameClientId() {
        FacesContext ctx = FacesContext.getCurrentInstance();
        String id = this.getJetIframe().getClientId(ctx);
        writeJavaScriptToClient("console.log('Inline Frame Id = "+id+"'); jetIframeClientId ='"+id+"'");
        return id;
    }
    //generic, reusable helper method to call JavaScript on a client
    private void writeJavaScriptToClient(String script) {
        FacesContext fctx = FacesContext.getCurrentInstance();
        ExtendedRenderKitService erks = null;
        erks = Service.getRenderKitService(fctx, ExtendedRenderKitService.class);
        erks.addScript(fctx, script);
    }

    
    // this method is called from the serverListener in client-to-server.jsf; it receives an event with a payload that contains a key helpTopic
    public void handleMessageFromJet(ClientEvent clientEvent) {
        System.out.println("handleMessageFromJet in Server!" + clientEvent);
        String message = clientEvent.getParameters()
                                    .get("message")
                                    .toString();
        System.out.println("String from JET = " + message);
        // find operation binding publishEvent and execute in order to publish contextual event
        BindingContainer bindingContainer = BindingContext.getCurrent().getCurrentBindingsEntry();
        OperationBinding method = bindingContainer.getOperationBinding("publishEvent");
        method.getParamsMap().put("payload", message);
        method.execute();
    }


    private ComponentReference jetInlineFrame;

    public void setJetIframe(RichInlineFrame jetIframe) {
        this.jetInlineFrame = ComponentReference.newUIComponentReference(jetIframe);
    }

    public RichInlineFrame getJetIframe() {
        if (this.jetInlineFrame != null) {
            return (RichInlineFrame) this.jetInlineFrame.getComponent();
        } else {
            return null;
        }
    }

}

