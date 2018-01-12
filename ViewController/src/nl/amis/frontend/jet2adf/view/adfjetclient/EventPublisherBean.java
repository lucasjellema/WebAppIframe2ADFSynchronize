package nl.amis.frontend.jet2adf.view.adfjetclient;

public class EventPublisherBean {
    public EventPublisherBean() {
        super();
    }
    
    public  Object publishEvent(Object payload) {
        System.out.println("<<< Publish Event: "+payload);
        return payload;
    }
}
