package nl.amis.frontend.jet2adf.view.adfjetclient;

import oracle.adf.model.BindingContext;
import oracle.adf.view.rich.render.ClientEvent;

import oracle.binding.BindingContainer;
import oracle.binding.OperationBinding;

public class Client2Server {

    public Client2Server() {
        super();
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

}

