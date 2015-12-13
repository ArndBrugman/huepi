var huepi = require('../huepi');

var MyHue = new huepi();
// OBSOLETE! May not be set externally, comes from bridge when whitelisting! MyHue.Username = '085efe879ee3ed83c04efc28a0da03d3';
var HeartbeatInterval;

ConnectMyHue();

function ConnectMyHue() {
  console.log('Discovering hue Bridge via hue Portal');
  MyHue.PortalDiscoverLocalBridges().then(function BridgesDiscovered() {
    console.log('Bridge IP: ' + MyHue.BridgeIP);
    MyHue.BridgeGetConfig().then(function BridgeConfigReceived() {
      console.log('Bridge ID: ' + MyHue.BridgeID);
      console.log('Bridge Name: ' + MyHue.BridgeName);
      MyHue.BridgeGetData().then(function BridgeDataReceived() {
        console.log('Bridge Username: ' + MyHue.Username);
        StartHeartbeat();
      }, function UnableToRetreiveBridgeData() {
        console.log('Please press connect button on the Bridge');
        MyHue.BridgeCreateUser().then(function BridegeUserCreated() {
          console.log('Bridge Username Created: ' + MyHue.Username);
          StartHeartbeat();
        }, function UnableToCreateUseronBridge() {
          console.log('.Please press connect button on the Bridge.');
          setTimeout(ConnectMyHue, 1000);
        });
      });
    }, function UnableToRetreiveBridgeConfiguration() {
      console.log('Unable to Retreive Bridge Configuration');
      setTimeout(ConnectMyHue, 1000);
    });
  }, function UnableToDiscoverLocalBridgesViaPortal() {
    console.log('Unable to find Local Bridge via hue Portal');
    setTimeout(ConnectMyHue, 3000);
  });
}

function StartHeartbeat() {
  //MyHue.GroupOn(0);
  //MyHue.GroupEffectNone(0);
  MyHue.GroupAlertSelect(0);
  HeartbeatInterval = setInterval(StatusHeartbeat, 2500);
  //StatusHeartbeat(); // Execute Immediate Too!
}

function StatusHeartbeat() {
  var PrevHueLights = MyHue.Lights; // Store Previous State of Lights
  MyHue.LightsGetData().then(function CheckLightSwitches() {
    // Triggers on Reachable which actually means Powered On/Off in my case ;-)
    LightNr = 1;
    while (MyHue.Lights[LightNr]) {
      if ((MyHue.Lights[LightNr].state.reachable) !== (PrevHueLights[LightNr].state.reachable)) {
        if (MyHue.Lights[LightNr].state.reachable) {
          onLightSwitchOn(LightNr);
        } else {
          onLightSwitchOff(LightNr);
        }
      }
      LightNr++;
    }
  }, function BridgetHeartbeatGetFailed() {
    console.log('StatusHeartbeat BridgeGet Failed');
    clearInterval(HeartbeatInterval);
    ConnectMyHue();
  });
}

function onLightSwitchOn(LightNr) {
  console.log('LightSwitch ' +LightNr+ ' On  - ' +MyHue.Lights[LightNr].name);
  MyHue.GroupOn(0);
  MyHue.GroupSetCT(0, 467);
  MyHue.GroupSetBrightness(0, 144);
}

function onLightSwitchOff(LightNr) {
  console.log('LightSwitch ' +LightNr+ ' Off - ' +MyHue.Lights[LightNr].name);
  MyHue.GroupOff(0);
}

