
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojinputtext'    
],
    function (oj, ko, $) {
        'use strict';
        function WorkareaViewModel() {
            var self = this;
            // initialize two country observables
            self.country = ko.observable("Italy");

            self.init = function() {
                // attach listener to receive message from parent; this is not required for sending messages to the parent window
                window.addEventListener("message", function (event) {
                    console.log("Iframe receives message from parent" + event.data);
                    if (event.data && event.data.eventType =='countryChanged' && event.data.payload) {
                        self.country(event.data.payload);
                    }
                },
                false);
            } //init
            $(document).ready(function(){ self.init(); })

            }

        return new WorkareaViewModel();
    }
);
