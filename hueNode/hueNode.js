var huepi = require('../huepi');

var MyHue = new huepi();
// OBSOLETE! May not be set externally, comes from bridge when whitelisting! MyHue.Username = '085efe879ee3ed83c04efc28a0da03d3';
var HeartbeatInterval;

ConnectMyHue();

function consoleTlog(string) {
  console.log(new Date() + ': ' + string);
}

function ConnectMyHue() {
  consoleTlog('Discovering hue Bridge via hue Portal');
  MyHue.PortalDiscoverLocalBridges().then(function BridgesDiscovered() {
    consoleTlog('Bridge IP: ' + MyHue.BridgeIP);
    MyHue.BridgeGetConfig().then(function BridgeConfigReceived() {
      consoleTlog('Bridge ID: ' + MyHue.BridgeID);
      consoleTlog('Bridge Name: ' + MyHue.BridgeName);
      MyHue.BridgeGetData().then(function BridgeDataReceived() {
        consoleTlog('Bridge Username: ' + MyHue.Username);
        StartHeartbeat();
      }, function UnableToRetreiveBridgeData() {
        consoleTlog('Please press connect button on the Bridge');
        MyHue.BridgeCreateUser().then(function BridegeUserCreated() {
          consoleTlog('Bridge Username Created: ' + MyHue.Username);
          StartHeartbeat();
        }, function UnableToCreateUseronBridge() {
          consoleTlog('.Please press connect button on the Bridge.');
          setTimeout(ConnectMyHue, 1000);
        });
      });
    }, function UnableToRetreiveBridgeConfiguration() {
      consoleTlog('Unable to Retreive Bridge Configuration');
      setTimeout(ConnectMyHue, 1000);
    });
  }, function UnableToDiscoverLocalBridgesViaPortal() {
    consoleTlog('Unable to find Local Bridge via hue Portal');
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
    while (MyHue.Lights[MyHue.LightGetId(LightNr)] !== undefined) {
      if ((MyHue.Lights[MyHue.LightGetId(LightNr)].state.reachable) !== (PrevHueLights[MyHue.LightGetId(LightNr)].state.reachable)) {
        if (MyHue.Lights[MyHue.LightGetId(LightNr)].state.reachable) {
          onLightSwitchOn(MyHue.LightGetId(LightNr));
        } else {
          onLightSwitchOff(MyHue.LightGetId(LightNr));
        }
      }
      LightNr++;
    }
  }, function BridgetHeartbeatGetFailed() {
    consoleTlog('StatusHeartbeat BridgeGet Failed');
    clearInterval(HeartbeatInterval);
    ConnectMyHue();
  });
}

function onLightSwitchOn(LightNr) {
  consoleTlog('LightSwitch ' +LightNr+ ' On  - ' +MyHue.Lights[MyHue.LightGetId(LightNr)].name);
  MyHue.GroupOn(2);
  MyHue.GroupSetCT(2, 467);
  MyHue.GroupSetBrightness(2, 144);
}

function onLightSwitchOff(LightNr) {
  consoleTlog('LightSwitch ' +LightNr+ ' Off - ' +MyHue.Lights[MyHue.LightGetId(LightNr)].name);
  MyHue.GroupOff(2);
}

