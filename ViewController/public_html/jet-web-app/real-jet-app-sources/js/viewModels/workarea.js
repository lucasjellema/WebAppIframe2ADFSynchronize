
define(
    ['ojs/ojcore', 'knockout', 'jquery', 'ojs/ojknockout', 'ojs/ojinputtext', 'ojs/ojselectcombobox', 'ojs/ojtreemap'
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

                console.log("country changed to:" + newCountry);
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

                console.log("browser  changed to:" + newBrowser);
                var message = {
                    "message": {
                        "eventType": "browserChanged",
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
                    if (event.data && event.data.eventType == 'freshJSON' && event.data.payload) {
                        var freshJSON = event.data.payload.countryData.values;
                        console.log("Fresh Countries " + freshJSON);

                        self.refreshCountriesTreeMap(freshJSON);

                        /* freshJSON is an array with country objects
                        [{name: "American Samoa", code: "AS", continent: "Oceania", capital: null, population: "54194", …}
1
:
{name: "Cook Islands", code: "CK", continent: "Oceania", capital: null, population: "9556", …}
2
:
{name: "Fiji", code: "FJ", continent: "Oceania", capital: null, population: "915303", …}
3
:
{name: "French Polynesia", code: "PF", continent: "Oceania", capital: null, population: "285321", …}
4
:
{name: "Guam", code: "GU", continent: "Oceania", capital: null, population: "162742", …}
*/
                    }
                },
                    false);
            } //init
            var handler = new oj.ColorAttributeGroupHandler();

            self.nodeValues = ko.observableArray([]);


            self.refreshCountriesTreeMap = function (countries) {
                // treemap
                self.world = createNode("World", 1301461533, 514251);
                var countryNodes = [];
                countries.forEach(function (country) { countryNodes.push(createNode(country.name, parseInt(country.population), parseInt(country.area))) })
                addChildNodes(self.world, countryNodes);

                self.nodeValues([self.world]);

            }
            self.refreshCountriesTreeMap([]);
            $(document).ready(function () { self.init(); })


            function createNode(label, population, area) {
                return {
                    label: label,
                    id: label,
                    value: population,
                    color: getColor(area),
                    shortDesc: "&lt;b&gt;" + label +
                        "&lt;/b&gt;&lt;br/&gt;Population: " +
                        population + "&lt;br/&gt;Area: " + area
                };
            }

            function getColor(area) {
                if (area < 1000) // 1st quartile
                    return handler.getValue('1stQuartile');
                else if (area < 10000) // 2nd quartile
                    return handler.getValue('2ndQuartile');
                else if (area < 100000) // 3rd quartile
                    return handler.getValue('3rdQuartile');
                else
                    return handler.getValue('4thQuartile');
            }

            function addChildNodes(parent, childNodes) {
                parent.nodes = [];
                for (var i = 0; i < childNodes.length; i++) {
                    parent.nodes.push(childNodes[i]);
                }
            }

        }

        return new WorkareaViewModel();
    }
);
