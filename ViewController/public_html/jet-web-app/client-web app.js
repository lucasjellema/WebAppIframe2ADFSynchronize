function callParent() {
    console.log('call parent/send message');
    var jetinputfield = document.getElementById('jetinputfield');
    var inputvalue = jetinputfield.value;
    
    var message = {
"message":{"p1":"Funny you","p2":34,"value": inputvalue}, 
            "mydata" :  {
            "param1" : 42, "param2" : "train"
        }
    };
    var targetOrigin = '*';

    parent.postMessage(message, targetOrigin);
}//callParent

function init() {
    window.addEventListener("message", function (event) {
        console.log("Iframe receives message from parent" + event);
    },
    false);
}
//init

document.addEventListener("DOMContentLoaded", function (event) {
    init();
});