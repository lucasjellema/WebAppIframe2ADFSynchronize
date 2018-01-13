
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojinputtext','ojs/ojselectcombobox'
    ],
    function (oj, ko, $) {
        'use strict';
        function WorkareaViewModel() {
            var self = this;
            // initialize two country observables
            self.country = ko.observable("Italy");
            self.color = ko.observable("Greenish");
            self.browser = ko.observable("Chrome");

            self.callParent = function (message) {
                console.log('send message from Web App to parent window');
                // here we can restrict which parent page can receive our message
                // by specifying the origin that this page should have
                var targetOrigin = '*';
                parent.postMessage(message, targetOrigin);

            }


            self.valueChangedListener = function (event) {
                var newCountry = event.detail.value;
                var oldCountry = event.detail.previousValue;
                
                console.log("country changed to:"+newCountry);                
                var message = {
                    "message": {
                        "value": newCountry
                    },
                    "mydata": {
                        "param1": 42, "param2": "train"
                    }
                };
                self.callParent(message);
  
            }

            self.browserChangedListener = function (event) {
                var newBrowser = event.detail.value;
                var oldBrowser = event.detail.previousValue;
                
                console.log("browser  changed to:"+newBrowser);                
                var message = {
                    "message": {
                        "eventType":"browserChanged",
                        "value": newBrowser
                    }
                };
                self.callParent(message);
                
            }
/*
            self.country.subscribe(function (newValue) {
                console.log("The country's new name is " + newValue);
          });
*/
            self.init = function () {
                // attach listener to receive message from parent; this is not required for sending messages to the parent window
                window.addEventListener("message", function (event) {
                    console.log("Iframe receives message from parent" + event.data);
                    if (event.data && event.data.eventType == 'countryChanged' && event.data.payload) {
                        self.country(event.data.payload);
                    }
                    if (event.data && event.data.eventType == 'colorChanged' && event.data.payload) {
                        self.color(event.data.payload);
                    }
                },
                    false);
            } //init
            $(document).ready(function () { self.init(); })

        }

        return new WorkareaViewModel();
    }
);
