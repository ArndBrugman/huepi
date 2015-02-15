var huepi = require('../huepi');

var MyHue = new huepi();
MyHue.Username = '085efe879ee3ed83c04efc28a0da03d3';
var HeartbeatInterval;

ConnectMyHue();

function ConnectMyHue() {

  console.log('Bridge IP: Trying to Discover hue Bridge via hue Portal');
  MyHue.PortalDiscoverLocalBridges().then(function GetBridgeConfig() {
    MyHue.BridgeGetData().then(function EnsureWhitelisting() {
      console.log('hue Bridge IP: ' + MyHue.BridgeIP);
      if (!MyHue.BridgeUsernameWhitelisted) {
        console.log('Please press connect button on the hue Bridge');
        MyHue.BridgeCreateUser().then(function ReReadBridgeConfiguration() {
          return ConnectMyHue();
        }, function UnableToCreateUseronBridge() {
          console.log('Unable to Create User on hue Bridge');
        });
      } else {
        StartHeartbeat();
      }
    }, function UnableToRetreiveBridgeConfiguration() {
      console.log('Unable to Retreive hue Bridge Configuration');
      return ConnectMyHue();
    });
  }, function UnableToDiscoverLocalBridgesViaPortal() {
    console.log('Unable to find Local hue Bridge via hue Portal');
    return ConnectMyHue();
  });
}

function StartHeartbeat() {

  console.log('hue Bridge Name: ' + MyHue.BridgeName);
  console.log('Found hue Bridge and Whitelisted');
  //MyHue.GroupOn(0);
  //MyHue.GroupEffectNone(0);
  HeartbeatInterval = setInterval(StatusHeartbeat, 1000);
  StatusHeartbeat(); // Execute Immediate Too!
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
  console.log('LightSwitch ' +LightNr+ ' On  -' +MyHue.Lights[LightNr].name);
  MyHue.GroupOn(0);
  MyHue.GroupSetCT(0, 467);
  MyHue.GroupSetBrightness(0, 144);
}

function onLightSwitchOff(LightNr) {
  console.log('LightSwitch ' +LightNr+ ' Off -' +MyHue.Lights[LightNr].name);
  MyHue.GroupOff(0);
}

