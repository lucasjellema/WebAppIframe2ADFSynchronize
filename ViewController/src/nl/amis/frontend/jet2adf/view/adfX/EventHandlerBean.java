package nl.amis.frontend.jet2adf.view.adfX;


import javax.el.ELContext;
import javax.el.ExpressionFactory;
import javax.el.ValueExpression;

import javax.faces.context.FacesContext;

public class EventHandlerBean {
    public EventHandlerBean() {        
        super();
    }

    public void handleEvent(Object payload) {
        System.out.println(">>>>>> Consume Event: " + payload);
        DetailsBean db =
            (DetailsBean)evaluateEL("#{pageFlowScope.detailsBean}");
        db.process(payload);
    }

    public static Object evaluateEL(String el) {
        FacesContext fc = FacesContext.getCurrentInstance();
        ELContext elContext = fc.getELContext();
        ExpressionFactory ef = fc.getApplication().getExpressionFactory();
        ValueExpression exp =
            ef.createValueExpression(elContext, el, Object.class);
        Object obj = exp.getValue(elContext);
        return obj;
    }

}
