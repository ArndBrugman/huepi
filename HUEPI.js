//////////
//
// HUE (Philips Wireless Lighting) API for JavaScript
//  +-> HUEPI sounds like Joepie which makes me smile during Development...
//
// Requires JQuery for ajax calls for now..
//
//

/**
 * 'Namespace' HUEPI
 *
 */
HUEPI = function() {
};

/**
 * HUEPI.Username Overidable Username must be 10-40 digits long
 * @type String
 */
HUEPI.Username = "1234567890";

// Forward Declarations, by lack of a better word
HUEPI.Portal = function() {
};
HUEPI.Portal.Bridges = [];

HUEPI.Bridge = function() {
};
HUEPI.Bridge.Config = [];
HUEPI.Bridge.IP = "";
HUEPI.Bridge.Name = "";
HUEPI.Bridge.UsernameWhitelisted = false; // Will be checked on Bridge.

HUEPI.Light = function() {
};
HUEPI.Lights = [];

HUEPI.Group = function() {
};
HUEPI.Groups = [];
// To Do: Add Schedules & Scenes
HUEPI.Schedule = function() {
};
HUEPI.Schedules = [];
HUEPI.Scene = function() {
};
HUEPI.Scenes = [];


/**
 * HUEPI.Portal
 *
 */
HUEPI.Portal.DiscoverLocalBridges = function()
{
  $.get("https://www.meethue.com/api/nupnp", function(data) {
    if (data[0].internalipaddress) {
      HUEPI.Portal.Bridges = data;
      HUEPI.Bridge.IP = HUEPI.Portal.Bridges[0].internalipaddress; // Default to 1st Bridge internalip
    }
  }, "json");
};

/**
 * HUEPI.Bridge
 *
 */
HUEPI.Bridge.Get = function()
{ // GET /api/username -> data.config.whitelist.username
  var url = "http://" + HUEPI.Bridge.IP + "/api/" + HUEPI.Username;
  $.get(url, function(data) {
    HUEPI.Lights = data.lights;
    HUEPI.Groups = data.groups;
    HUEPI.Bridge.Config = data.config;
    HUEPI.Schedules = data.schedules;
    HUEPI.Scenes = data.scenes;
    if (HUEPI.Bridge.Config !== undefined) {
      HUEPI.Bridge.Name = HUEPI.Bridge.Config.name;
      // if able to read Config, Username must be Whitelisted
      HUEPI.Bridge.UsernameWhitelisted = true;
    }
  });
};

HUEPI.Bridge.CreateUser = function()
{ // POST /api {"devicetype": "iPhone", "username": "1234567890"}
  $.ajax({
    type: "POST",
    dataType: "json",
    contentType: "application/json",
    url: "http://" + HUEPI.Bridge.IP + "/api",
    data: '{"devicetype": "WebInterface", "username": "' + HUEPI.Username + '"}'
  }).done(function(data) { // a Buttonpress on the Bridge is required
  });
};

HUEPI.Bridge.DeleteUser = function(UsernameToDelete)
{ // DELETE /api/username/config/whitelist/username {"devicetype": "iPhone", "username": "1234567890"}
  $.ajax({
    type: "DELETE",
    dataType: "json",
    contentType: "application/json",
    url: "http://" + HUEPI.Bridge.IP + "/api/" + HUEPI.Username + "/config/whitelist/" + UsernameToDelete,
    data: '{"devicetype": "WebInterface", "username": "' + HUEPI.Username + '"}'
  }).done(function(data) {
  });
};

/**
 * HUEPI.Light
 *
 */
HUEPI.Light = function() {
};

HUEPI.Light.Get = function()
{ // GET /api/username/lights -> [].name
  var url = "http://" + HUEPI.Bridge.IP + "/api/" + HUEPI.Username + "/lights";
  $.get(url, function(data) {
    if (data) {
      HUEPI.Lights = data;
      HUEPI.Light.Names = new Array();
      for (var i = 1; true; i++) {
        if (data[i]) {
          HUEPI.Light.Names[i] = data[i].name;
        } else
          break;
      }
    } // else error
  });
};

/**
 * HUEPI.Lightstate
 *
 */
HUEPI.Lightstate = function()
{
  //this.SetOn = function(On) {
  //  this.on = On;
  //};
  this.On = function() {
    this.on = true;
    return this;
  };
  this.Off = function() {
    this.on = false;
    return this;
  };
  this.SetHSB = function(Hue, Saturation, Brightness) {
    // prev this.hue = Hue;
    // prev this.sat = Saturation;
    this.bri = Brightness;
    // prev return this;
    //
    // Color Correct Hue Sat To xy via RGB
    Hue = Math.round(Hue * 360 / 65535);
    Saturation = Saturation / 255;
    Brightness = Brightness / 255;
    if (Saturation === 0) {
      var Red = Brightness;
      var Green = Brightness;
      var Blue = Brightness;
    } else
    {
      var Sector = Math.floor(Hue / 60);
      var Fraction = (Hue / 60) - Sector;
      var p = Brightness * (1 - Saturation);
      var q = Brightness * (1 - Saturation * Fraction);
      var t = Brightness * (1 - Saturation * (1 - Fraction));
      switch (Sector) {
        case 0:
          Red = Brightness;
          Green = t;
          Blue = p;
          break;
        case 1:
          Red = q;
          Green = Brightness;
          Blue = p;
          break;
        case 2:
          Red = p;
          Green = Brightness;
          Blue = t;
          break;
        case 3:
          Red = p;
          Green = q;
          Blue = Brightness;
          break;
        case 4:
          Red = t;
          Green = p;
          Blue = Brightness;
          break;
        default: // case 5:
          Red = Brightness;
          Green = p;
          Blue = q;
          break;
      }
    }
    // Adjust to Light XY CIE is Work In Progress using
    // https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/commit/f41091cf671e13fe8c32fcced12604cd31cceaf3
    // for details...
    //
    // Gamma Correct RGB
    if (Red > 0.04045) {
      Red = Math.pow((Red + 0.055) / (1.055), 2.4);
    } else {
      Red = Red / 12.92;
    }
    if (Green > 0.04045) {
      Green = Math.pow((Green + 0.055) / (1.055), 2.4);
    } else {
      Green = Green / 12.92;
    }
    if (Blue > 0.04045) {
      Blue = Math.pow((Blue + 0.055) / (1.055), 2.4);
    } else {
      Blue = Blue / 12.92;
    }
    // Translate to XYZ
    var X = Red * 0.649926 + Green * 0.103455 + Blue * 0.197109;
    var Y = Red * 0.234327 + Green * 0.743075 + Blue * 0.022598;
    var Z = Red * 0.000000 + Green * 0.053077 + Blue * 1.035763;
    // But we don't want Capital X,Y,Z you want lowercase [x,y] (called the color point) as per:
    var Px = X / (X + Y + Z);
    var Py = Y / (X + Y + Z);
    // Check if point is inside Triangle for correct model of light
    //
    //For the hue bulb the corners of the triangle are:
    var PRed = {x: 0.6750, y: 0.3220};
    var PGreen = {x: 0.4091, y: 0.5180};
    var PBlue = {x: 0.1670, y: 0.0400};
    //For LivingColors Bloom, Aura and Iris the triangle corners are:
    //var PRed = { x:0.704, y:0.296 };
    //var PGreen = { x:0.2151, y:0.7106 };
    //var PBlue = { x:0.138, y:0.08 };

    var VBR = {x: PRed.x - PBlue.x, y: PRed.y - PBlue.y}; // Blue to Red
    var VRG = {x: PGreen.x - PRed.x, y: PGreen.y - PRed.y}; // Red to Green
    var VGB = {x: PBlue.x - PGreen.x, y: PBlue.y - PGreen.y}; // Green to Blue

    var GBR = (PGreen.x - PBlue.x) * VBR.y - (PGreen.y - PBlue.y) * VBR.x; // Sign Green on Blue to Red
    var BRG = (PBlue.x - PRed.x) * VRG.y - (PBlue.y - PRed.y) * VRG.x; // Sign Blue on Red to Green
    var RGB = (PRed.x - PGreen.x) * VGB.y - (PRed.y - PGreen.y) * VGB.x; // Sign Red on Green to Blue

    var VBP = {x: Px - PBlue.x, y: Py - PBlue.y}; // Blue to Point
    var VRP = {x: Px - PRed.x, y: Py - PRed.y}; // Red to Point
    var VGP = {x: Px - PGreen.x, y: Py - PGreen.y}; // Green to Point

    var PBR = VBP.x * VBR.y - VBP.y * VBR.x; // Sign Point on Blue to Red
    var PRG = VRP.x * VRG.y - VRP.y * VRG.x; // Sign Point on Red to Green
    var PGB = VGP.x * VGB.y - VGP.y * VGB.x; // Sign Point on Green to Blue

    if ((GBR * PBR >= 0) && (BRG * PRG >= 0) && (RGB * PGB >= 0)) // All Signs Match so Px,Py must be in Gamut
      return this.SetXY(Px, Py);

    //  Outside Triangle, Find Closesed point on Edge or Pick Vertice...
    if (GBR * PBR <= 0) { // Outside Blue to Red
      var NormDot = (VBP.x * VBR.x + VBP.y * VBR.y) / (VBR.x * VBR.x + VBR.y * VBR.y);
      if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
        return this.SetXY(PBlue.x + NormDot * VBR.x, PBlue.y + NormDot * VBR.y);
      else if (NormDot < 0.0) // Outside Edge, Pick Vertice
        return this.SetXY(PBlue.x, PBlue.y); // Start
      else
        return this.SetXY(PRed.x, PRed.y); // End
    }
    else if (BRG * PRG <= 0) { // Outside Red to Green
      var NormDot = (VRP.x * VRG.x + VRP.y * VRG.y) / (VRG.x * VRG.x + VRG.y * VRG.y);
      if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
        return this.SetXY(PRed.x + NormDot * VRG.x, PRed.y + NormDot * VRG.y);
      else if (NormDot < 0.0) // Outside Edge, Pick Vertice
        return this.SetXY(PRed.x, PRed.y); // Start
      else
        return this.SetXY(PGreen.x, PGreen.y); // End
    }
    else if (RGB * PGB <= 0) { // Outside Green to Blue
      var NormDot = (VGP.x * VGB.x + VGP.y * VGB.y) / (VGB.x * VGB.x + VGB.y * VGB.y);
      if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
        return this.SetXY(PGreen.x + NormDot * VGB.x, PGreen.y + NormDot * VGB.y);
      else if (NormDot < 0.0) // Outside Edge, Pick Vertice
        return this.SetXY(PGreen.x, PGreen.y); // Start
      else
        return this.SetXY(PBlue.x, PBlue.y); // End
    }

  };
  this.SetHue = function(Hue) {
    this.hue = Hue;
    return this;
  };
  this.SetSaturation = function(Saturation) {
    this.sat = Saturation;
    return this;
  };
  this.SetBrightness = function(Brightness) {
    this.bri = Brightness;
    return this;
  };
  this.SetHueAngSatBri = function(Ang, Sat, Bri) {
    // In: Hue in Deg, Saturation, Brightness 0.0-1.0 Transform To Philips Hue Range...
    if (Ang < 0)
      Ang = Ang + 360;
    Ang = Ang % 360;
    return this.SetHSB(Math.round(Ang / 360 * 65535), Sat * 255, Bri * 255);
  };
  this.SetRGB = function(Red, Green, Blue) {// In RGB [0..255]
    var Ang, Sat, Bri;
    Red = Red / 255; // from 0-255 to 0.0-1.0
    Green = Green / 255;
    Blue = Blue / 255;
    var Min = Math.min(Red, Green, Blue);
    var Max = Math.max(Red, Green, Blue);
    if (Min !== Max) {
      if (Red === Max) {
        Ang = (0 + ((Green - Blue) / (Max - Min))) * 60;
      } else if (Green === Max) {
        Ang = (2 + ((Blue - Red) / (Max - Min))) * 60;
      } else {
        Ang = (4 + ((Red - Green) / (Max - Min))) * 60;
      }
      Sat = (Max - Min) / Max;
      Bri = Max;
    } else { // Max == Min
      Ang = 0;
      Sat = 0;
      Bri = Max;
    }
    return this.SetHueAngSatBri(Ang, Sat, Bri);
  };
  this.SetCT = function(Ct) {
    this.ct = Ct;
    return this;
  };
  this.SetColortemperature = function(Colortemperature) {
    this.ct = 0 | (1000000 / Colortemperature); // Kelvin to micro reciprocal degree
    return this;
  };
  this.SetXY = function(X, Y) {
    this.xy = [X, Y];
    return this;
  };
  //this.SetAlert = function(Alert) {
  //  this.alert = Alert;
  //};
  this.AlertSelect = function() {
    this.alert = 'select';
    return this;
  };
  this.AlertLSelect = function() {
    this.alert = 'lselect';
    return this;
  };
  this.AlertNone = function() {
    this.alert = 'none';
    return this;
  };
  //this.SetEffect = function(Effect) {
  //  this.effect = Effect;
  //};
  this.EffectColorloop = function() {
    this.effect = 'colorloop';
    return this;
  };
  this.EffectNone = function() {
    this.effect = 'none';
    return this;
  };
  this.SetTransitiontime = function(Transitiontime) {
    if (typeof Transitiontime !== 'undefined') // Optional Parameter
      this.transitiontime = Transitiontime;
    return this;
  };

  this.Get = function() {
    return JSON.stringify(this);
  };
};

HUEPI.Light.SetState = function(LightNr, State)
{ // PUT /api/username/lights/[LightNr]/state
  $.ajax({
    type: "PUT", dataType: "json", contentType: "application/json",
    url: "http://" + HUEPI.Bridge.IP + "/api/" + HUEPI.Username + "/lights/" + LightNr + "/state",
    data: State.Get()
  }).done(function(data) {
  });
};

HUEPI.Light.On = function(LightNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.On();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.Off = function(LightNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.Off();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetHSB = function(LightNr, Hue, Saturation, Brightness, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetHSB(Hue, Saturation, Brightness);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetHue = function(LightNr, Hue, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetHue(Hue);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetSaturation = function(LightNr, Saturation, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetSaturation(Saturation);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetBrightness = function(LightNr, Brightness, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetBrightness(Brightness);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetHueAngSatBri = function(LightNr, Ang, Sat, Bri, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetHueAngSatBri(Ang, Sat, Bri);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetRGB = function(LightNr, Red, Green, Blue, Transitiontime) // 0-255;FF
{
  var State = new HUEPI.Lightstate();
  State.SetRGB(Red, Green, Blue);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetCT = function(LightNr, CT, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetCT(CT);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetColortemperature = function(LightNr, Colortemperature, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetColortemperature(Colortemperature);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetXY = function(LightNr, X, Y, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetXY(X, Y);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.AlertSelect = function(LightNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.AlertSelect();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.AlertLSelect = function(LightNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.AlertLSelect();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.AlertNone = function(LightNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.AlertNone();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.EffectColorloop = function(LightNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.EffectColorloop();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.EffectNone = function(LightNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.EffectNone();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Light.SetState(LightNr, State);
};

/**
 * HUEPI.Group
 *
 */
HUEPI.Group = function() {
};

HUEPI.Group.Get = function()
{ // GET /api/username/lights -> [].name
  var url = "http://" + HUEPI.Bridge.IP + "/api/" + HUEPI.Username + "/groups";
  $.get(url, function(data) {
    if (data) {
      HUEPI.Groups = data;
      HUEPI.Group.Names = new Array();
      for (var i = 1; true; i++) {
        if (data[i]) {
          HUEPI.Group.Names[i] = data[i].name;
        } else
          break;
      }
    } // else error
  });
};

HUEPI.Group.SetState = function(GroupNr, State)
{ // PUT /api/username/groups/[GroupNr]/action
  $.ajax({
    type: "PUT", dataType: "json", contentType: "application/json",
    url: "http://" + HUEPI.Bridge.IP + "/api/" + HUEPI.Username + "/groups/" + GroupNr + "/action",
    data: State.Get()
  }).done(function(data) {
  });
};

HUEPI.Group.On = function(GroupNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.On();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.Off = function(GroupNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.Off();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetHSB = function(GroupNr, Hue, Saturation, Brightness, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetHSB(Hue, Saturation, Brightness);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetHue = function(GroupNr, Hue, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetHue(Hue);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetSaturation = function(GroupNr, Saturation, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetSaturation(Saturation);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetBrightness = function(GroupNr, Brightness, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetBrightness(Brightness);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetHueAngSatBri = function(GroupNr, Ang, Sat, Bri, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetHueAngSatBri(Ang, Sat, Bri);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetRGB = function(GroupNr, Red, Green, Blue, Transitiontime) // 0-255;FF
{
  var State = new HUEPI.Lightstate();
  State.SetRGB(Red, Green, Blue);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetCT = function(GroupNr, CT, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetCT(CT);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetColortemperature = function(GroupNr, Colortemperature, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetColortemperature(Colortemperature);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetXY = function(GroupNr, X, Y, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.SetXY(X, Y);
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.AlertSelect = function(GroupNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.AlertSelect();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.AlertLSelect = function(GroupNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.AlertLSelect();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.AlertNone = function(GroupNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.AlertNone();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.EffectColorloop = function(GroupNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.EffectColorloop();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.EffectNone = function(GroupNr, Transitiontime)
{
  var State = new HUEPI.Lightstate();
  State.EffectNone();
  State.SetTransitiontime(Transitiontime);
  HUEPI.Group.SetState(GroupNr, State);
};

///
//
// Changes:
//
// 0.1
// Initial Public Release
//
// 0.2
// Renamed class HUEPI.Light.State -> HUEPI.Lightstate
// Renamed function HUEPI.Bridge.GetConfig -> HUEPI.Bridge.Get
// Renamed functions HUEPI.Config.* -> HUEPI.Bridge.*
// Added Gamut Color Correction in HUEPI.Lightstate.SetHSB RGB+HSB Settings Will be Color Corrected to HUE Lamp -> xy
//
// 0.21
// Rewrote Gamut Color Correction in HUEPI.Lightstate.SetHSB
// 