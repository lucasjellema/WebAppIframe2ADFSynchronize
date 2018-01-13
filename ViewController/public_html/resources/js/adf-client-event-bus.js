
var subscriptions = {};

function publishEvent( eventType, payload) {
   console.log('Event published of type '+eventType);
   console.log('Event payload'+JSON.stringify(payload));
    // find all subscriptions for this event type
   if (subscriptions[eventType]) { 
    // loop over subscriptions and invoke callback function for each subscription
    for (i = 0; i < subscriptions[eventType].length; i++) {
       var callback = subscriptions[eventType][i];
       try {
         callback(payload);
       }
       catch (err) {
           console.log("Error in calling callback function to handle event. Error: "+err.message);
       }
    }//for 
   }//if     
    
}// publishEvent


// register an interest in an eventType by providing a callback function that takes a payload parameter
function subscribeToEvent( eventType, callback) {
   if (!subscriptions[eventType]) { subscriptions[eventType]= [ ]};
   subscriptions[eventType].push(callback);
   console.log('added subscription for eventtype '+eventType);
}//subscribeToEvent


function initializeEventBus(evt) {
    console.log('event bus reports for pubsub  duty');
}