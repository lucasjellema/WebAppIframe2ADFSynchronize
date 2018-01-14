In order to support datababound JSON, the following changes were made:

+ add csv files : continents.csv, countries.csv and empty-grid.csv
+ create ADF Placeholder Data Control RichAppPlaceHolder with data types for each of these files; also a link between Continents and Countries
+ create a JSF page;
* add         <af:resource type="javascript" source="/resources/js/AppLibraryDataboundJson.js"/>
        <af:clientListener method="init" type="load"/>

* create selectOneChoice with data (list) binding Continents Data Control : 
                            <af:selectOneChoice id="nl1" autoSubmit="true"
                                                value="#{bindings.ContinentsDataType.inputValue}"
                                                label="Select Continent">
                                <f:selectItems value="#{bindings.ContinentsDataType.items}" id="si1"/>
                            </af:selectOneChoice>

* add list view for detail (tree)binding for  countries in continent
                            <af:panelHeader text="Country Details in Continent" partialTriggers="nl1" id="ph3">
                                <af:listView value="#{bindings.CountriesInContinentDataType.collectionModel}" var="item"
                                             emptyText="#{bindings.CountriesInContinentDataType.viewable ? 'No data to display.' : 'Access Denied.'}"
                                             fetchSize="#{bindings.CountriesInContinentDataType.rangeSize}" id="lv1">
                                    <af:listItem id="li1">
                                        <af:panelGroupLayout layout="horizontal" id="pgl3">
                                            <f:facet name="separator">
                                                <af:spacer width="10" id="s1"/>
                                            </f:facet>
                                            <af:outputFormatted value="#{item.bindings.name.inputValue}" id="of1"/>
                                            <af:outputFormatted value="#{item.bindings.population.inputValue}"
                                                                id="of2"/>
                                            <af:outputFormatted value="#{item.bindings.area.inputValue}" id="of3"/>
                                            <af:outputFormatted value="#{item.bindings.birthrate.inputValue}" id="of4"/>
                                            <af:outputFormatted value="#{item.bindings.url.inputValue}" id="of5"/>
                                        </af:panelGroupLayout>
                                    </af:listItem>
                                </af:listView>
                            </af:panelHeader>

* add snippet - invisible - to specify the data that should be generated into the page
                        <af:inputText label="x" id="jsonPayloadContainer" styleClass="jsonPayload" visible="false"
                                      binding="#{jsonProviderBackingBean.jsonContainer}">
                            <!-- initialize JS variable jsonData['countryData'] with data based on bindings.CountriesInContinentDataType data binding -->          
                            <af:clientAttribute name="jsonPayloadAttributes" value="{'attributes':['countryData']}"/>
                            <af:clientAttribute name="countryData"
                                                value=" #{jsonProviderBean[bindings.CountriesInContinentDataType]}"/>
                        </af:inputText>


* create managed bean jsonProviderBackingBean and jsonProviderBean - in adfc-config.xml (application wide, stateless); note : the backing bean should perhaps be viewscope/taskflow scope
<managed-bean id="__3">
    <managed-bean-name>jsonProviderBean</managed-bean-name>
    <managed-bean-class>nl.amis.app.view.json.JsonProvider</managed-bean-class>
    <managed-bean-scope>request</managed-bean-scope>
  </managed-bean>
<managed-bean id="__4">
    <managed-bean-name>jsonProviderBackingBean</managed-bean-name>
    <managed-bean-class>nl.amis.app.view.json.JsonProviderBean</managed-bean-class>
    <managed-bean-scope>request</managed-bean-scope>
  </managed-bean>



+ add JavaScript library: AppLibraryDatabound.json
 
+ create class JsonProviderBean 
package nl.amis.app.view.json;


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


- create class: JsonProvider

package nl.amis.app.view.json;

import java.math.BigDecimal;

import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.Set;

import oracle.adf.model.binding.DCIteratorBinding;
import oracle.adf.share.logging.ADFLogger;

import oracle.jbo.AttributeDef;
import oracle.jbo.Row;
import oracle.jbo.server.ViewRowSetImpl;
import oracle.jbo.uicli.binding.JUCtrlHierBinding;

import org.apache.myfaces.trinidad.model.TreeModel;

public class JsonProvider implements Map {
    private static ADFLogger _logger = ADFLogger.createADFLogger(JsonProvider.class);


    @Override
    public int size() {
        // TODO Implement this method
        return 0;
    }

    @Override
    public boolean isEmpty() {
        // TODO Implement this method
        return false;
    }

    @Override
    public boolean containsKey(Object key) {
        // TODO Implement this method
        return false;
    }

    @Override
    public boolean containsValue(Object value) {
        // TODO Implement this method
        return false;
    }

    /***
     *   This method returns a String that contains a JSON formatted data object.
     *   This nested JSON object represents the data retrieved from the DCIteratorBinding passed into this method.
     *   The nested JSON object contains data for all rows and all attributes per row from the iterator directly as well as from nested rows.
     *
     *   this method is supposed to be invoked with an DCIteratorBinding --
     *   especially a tree binding works well, defined in the PageDefinition as:
     *       <tree IterBinding="DeptView2Iterator" id="DeptView2">?
     *   The EL expression used in the page to send the iterator binding to this method is something like:
     *             var deptData = #{jsonProviderBean[bindings.DeptView2.DCIteratorBinding]};
     *
     *
     *
     **/
    //TODO: at the very least use StringBuilder and append instead of String
    //TODO : create structured Java objects (HashMap, ArrayList) and (use Jackson to) serialize to JSON
    @Override
    public Object get(Object dataBinding) {
        System.out.println(">>> Producing JSON for dataBinding");
        String json = "{";
        try {
            TreeModel treeModel;
            if (dataBinding instanceof TreeModel) {
                treeModel = (TreeModel) dataBinding;
            }
            JUCtrlHierBinding hb;
            if (dataBinding instanceof JUCtrlHierBinding) {
                hb = (JUCtrlHierBinding) dataBinding;

                // write meta data in JSON object for all attributes
                AttributeDef[] attributeDefs = hb.getAttributeDefs();                
                json = processAttributeDefs(json + " \"attributes\":", attributeDefs);
                // fetch values for all rows
                Row[] rows = hb.getAllRowsInRange();
                json = processRows(json + ", \"values\":", rows);
            
            }
            if (dataBinding instanceof DCIteratorBinding) {
                DCIteratorBinding iterBind = (DCIteratorBinding) dataBinding;

                // write meta data in JSON object for all attributes
                AttributeDef[] attributeDefs = iterBind.getAttributeDefs();                
                json = processAttributeDefs(json + " \"attributes\":", attributeDefs);
                // fetch values for all rows
                Row[] rows = iterBind.getAllRowsInRange();
                json = processRows(json + ", \"values\":", rows);
            } //if
        } catch (Exception e) {
            _logger.severe("Exception" + e.getMessage(), e);
            json = json + ",\"exception\": \"" + e.getMessage() + "\"";
        }
        return json + "}";
    }

    private String processRows(String json, Row[] rows) {
        boolean firstAtt = true;
        json = json + "[";
        boolean firstRow = true;
        for (Row row : rows) {
            firstAtt = true;
            json = json + (firstRow ? "" : ",") + "{";
            firstRow = false;
            for (String attributeName : row.getAttributeNames()) {
                if (row.getAttribute(attributeName) instanceof ViewRowSetImpl) {
                    ViewRowSetImpl vrs = (ViewRowSetImpl) row.getAttribute(attributeName);
                    try {
                        json =
                            processRows(json + (firstAtt ? "\"" : ",\"") + attributeName + "\":",
                                        vrs.getAllRowsInRange());
                    } catch (Exception e) {
                        _logger.severe("Exception in nested rows " + e.getMessage(), e);
                    }
                } else {
                    json =
                        json + (firstAtt ? "" : ",") + "\"" + attributeName + "\": " +
                        writeAttribute(row.getAttribute(attributeName));
                }
                //                 json = json +  ",\""+attributeName+"Type\": \""+ row.getAttribute(attributeName).getClass().getCanonicalName()+"\"";
                firstAtt = false;
            }
            json = json + "}";
        }
        json = json + "]";
        return json;
    }

    private String writeAttribute(Object attribute) {
        // if attribute is numeric, do not write quotation marks
        if (attribute == null) {
            return "null";
        } else if (attribute instanceof Integer || attribute instanceof BigDecimal || attribute instanceof Number) {
            return attribute.toString();
        } else {
            return "\"" + attribute + "\"";
        }
    }

    @Override
    public Object put(Object key, Object value) {
        // TODO Implement this method
        return null;
    }

    @Override
    public Object remove(Object key) {
        // TODO Implement this method
        return null;
    }

    @Override
    public void putAll(Map m) {
        // TODO Implement this method
    }

    @Override
    public void clear() {
        // TODO Implement this method
    }

    @Override
    public Set keySet() {
        // TODO Implement this method
        return Collections.emptySet();
    }

    @Override
    public Collection values() {
        // TODO Implement this method
        return Collections.emptySet();
    }

    @Override
    public Set entrySet() {
        // TODO Implement this method
        return Collections.emptySet();
    }

    public JsonProvider() {
        super();
    }

    private String processAttributeDefs(String json, AttributeDef[] attributeDefs) {
        json = json + " {";
        boolean firstAtt = true;
        for (AttributeDef attributeDef : attributeDefs) {
            json =
                json + (firstAtt ? "" : ",") + "\"" + attributeDef.getName() + "\": \"" +
                attributeDef.getJavaType().getCanonicalName() + "\"";
            firstAtt = false;
        }
        json = json + "}";
        return json;
    }
}
