//////////
//
// HUE (Philips Wireless Lighting) API for JavaScript
//  +-> HUEPI sounds like Joepie which makes me smile during development...
//
// Requires JQuery 1.5+ for ajax calls and Deferreds
//
//

/*
 * Object HUEPI
 *
 */
HUEPI = function() {
  /**
   * Username Overidable Username must be 10-40 digits long
   * @type String
   */
  this.Username = "1234567890";

  this.PortalBridges = [];

  this.BridgeConfig = [];
  this.BridgeIP = "";
  this.BridgeName = "";
  this.UsernameWhitelisted = false; // Will be checked on Bridge in BridgeGet()

  this.Lights = [];
  this.Groups = [];

// To Do: Add Schedules & Scenes
  this.Schedules = [];
  this.Scenes = [];


  /*
   * Portal
   *
   */
  this.PortalDiscoverLocalBridges = function()
  {
    var That = this;
    return $.get("https://www.meethue.com/api/nupnp", function(data) {
      if (data[0].internalipaddress) {
        That.PortalBridges = data;
        That.BridgeIP = That.PortalBridges[0].internalipaddress; // Default to 1st Bridge internalip
      }
    });
  };

  /*
   * Bridge
   *
   */
  this.BridgeGet = function()
  { // GET /api/username -> data.config.whitelist.username
    var That = this;
    var url = "http://" + this.BridgeIP + "/api/" + this.Username;
    return $.get(url, function(data) {
      That.Lights = data.lights;
      That.Groups = data.groups;
      That.BridgeConfig = data.config;
      That.Schedules = data.schedules;
      That.Scenes = data.scenes;
      if (That.BridgeConfig !== undefined) {
        That.BridgeName = That.BridgeConfig.name;
        // if able to read Config, Username must be Whitelisted
        That.UsernameWhitelisted = true;
      }
    });
  };

  this.BridgeCreateUser = function()
  { // POST /api {"devicetype": "iPhone", "username": "1234567890"}
    return $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api",
      data: '{"devicetype": "WebInterface", "username": "' + this.Username + '"}'
    });
  };

  this.BridgeDeleteUser = function(UsernameToDelete)
  { // DELETE /api/username/config/whitelist/username {"devicetype": "iPhone", "username": "1234567890"}
    return $.ajax({
      type: "DELETE",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/config/whitelist/" + UsernameToDelete,
      data: '{"devicetype": "WebInterface", "username": "' + this.Username + '"}'
    });
  };

  /*
   * Helper Functions
   *
   */
  HelperRGBtoHueAngSatBri = function(Red, Green, Blue)
  { // Range 0..1, return .Ang (360), .Sat, .Brig
    var Ang, Sat, Bri;
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
    return {Ang: Ang, Sat: Sat, Bri: Bri};
  };

  HelperHueAngSatBritoRGB = function(Ang, Sat, Bri)
  { // Range 360, 1, 1, return .Red, .Green, .Blue
    var Red, Green, Blue;
    if (Sat === 0) {
      Red = Bri;
      Green = Bri;
      Blue = Bri;
    } else
    {
      var Sector = Math.floor(Ang / 60);
      var Fraction = (Ang / 60) - Sector;
      var p = Bri * (1 - Sat);
      var q = Bri * (1 - Sat * Fraction);
      var t = Bri * (1 - Sat * (1 - Fraction));
      switch (Sector) {
        case 0:
          Red = Bri;
          Green = t;
          Blue = p;
          break;
        case 1:
          Red = q;
          Green = Bri;
          Blue = p;
          break;
        case 2:
          Red = p;
          Green = Bri;
          Blue = t;
          break;
        case 3:
          Red = p;
          Green = q;
          Blue = Bri;
          break;
        case 4:
          Red = t;
          Green = p;
          Blue = Bri;
          break;
        default: // case 5:
          Red = Bri;
          Green = p;
          Blue = q;
          break;
      }
    }
    return {Red: Red, Green: Green, Blue: Blue};
  };

  HelperRGBtoXY = function(Red, Green, Blue)
  { // Range 0..1, return .x, .y
    // Adjust to Light XY CIE
    // https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/commit/f41091cf671e13fe8c32fcced12604cd31cceaf3
    // for details...
    //
    // Gamma Correct RGB
    if (Red > 0.04045)
      Red = Math.pow((Red + 0.055) / (1.055), 2.4);
    else
      Red = Red / 12.92;
    if (Green > 0.04045)
      Green = Math.pow((Green + 0.055) / (1.055), 2.4);
    else
      Green = Green / 12.92;
    if (Blue > 0.04045)
      Blue = Math.pow((Blue + 0.055) / (1.055), 2.4);
    else
      Blue = Blue / 12.92;
    // Translate to XYZ
    var X = Red * 0.649926 + Green * 0.103455 + Blue * 0.197109;
    var Y = Red * 0.234327 + Green * 0.743075 + Blue * 0.022598;
    var Z = Red * 0.000000 + Green * 0.053077 + Blue * 1.035763;
    //
    // http://www.everyhue.com/vanilla/discussion/comment/635
    //
    // var X = 1.076450 * Red - 0.237662 * Green + 0.161212 * Blue;
    // var Y = 0.410964 * Red + 0.554342 * Green + 0.034694 * Blue;
    // var Z = -0.010954 * Red - 0.013389 * Green + 1.024343 * Blue;

    //
    // But we don't want Capital X,Y,Z you want lowercase [x,y] (called the color point) as per:
    if ((X + Y + Z) === 0)
      return {x: 0, y: 0};
    return {x: X / (X + Y + Z), y: Y / (X + Y + Z)};
  };

  HelperGamutXYforModel = function(Px, Py, Model)
  { // return .x, .y
    // Check if point is inside Triangle for correct model of light
    if (Model === "LCT001") { // For the hue bulb the corners of the triangle are:
      var PRed = {x: 0.6750, y: 0.3220};
      var PGreen = {x: 0.4091, y: 0.5180};
      var PBlue = {x: 0.1670, y: 0.0400};
    } else { // For LivingColors Bloom, Aura and Iris the triangle corners are:
      var PRed = {x: 0.704, y: 0.296};
      var PGreen = {x: 0.2151, y: 0.7106};
      var PBlue = {x: 0.138, y: 0.08};
    }

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

    if ((GBR * PBR >= 0) && (BRG * PRG >= 0) && (RGB * PGB >= 0)) // All Signs Match so Px,Py must be in triangle
      return {x: Px, y: Py};

    //  Outside Triangle, Find Closesed point on Edge or Pick Vertice...
    else if (GBR * PBR <= 0) { // Outside Blue to Red
      var NormDot = (VBP.x * VBR.x + VBP.y * VBR.y) / (VBR.x * VBR.x + VBR.y * VBR.y);
      if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
        return {x: PBlue.x + NormDot * VBR.x, y: PBlue.y + NormDot * VBR.y};
      else if (NormDot < 0.0) // Outside Edge, Pick Vertice
        return {x: PBlue.x, y: PBlue.y}; // Start
      else
        return {x: PRed.x, y: PRed.y}; // End
    }
    else if (BRG * PRG <= 0) { // Outside Red to Green
      var NormDot = (VRP.x * VRG.x + VRP.y * VRG.y) / (VRG.x * VRG.x + VRG.y * VRG.y);
      if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
        return {x: PRed.x + NormDot * VRG.x, y: PRed.y + NormDot * VRG.y};
      else if (NormDot < 0.0) // Outside Edge, Pick Vertice
        return {x: PRed.x, y: PRed.y}; // Start
      else
        return {x: PGreen.x, y: PGreen.y}; // End
    }
    else if (RGB * PGB <= 0) { // Outside Green to Blue
      var NormDot = (VGP.x * VGB.x + VGP.y * VGB.y) / (VGB.x * VGB.x + VGB.y * VGB.y);
      if ((NormDot >= 0.0) && (NormDot <= 1.0)) // Within Edge
        return {x: PGreen.x + NormDot * VGB.x, y: PGreen.y + NormDot * VGB.y};
      else if (NormDot < 0.0) // Outside Edge, Pick Vertice
        return {x: PGreen.x, y: PGreen.y}; // Start
      else
        return {x: PBlue.x, y: PBlue.y}; // End
    }
  };

  /*
   * Lightstate
   *
   */
  Lightstate = function()
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
    this.SetHSB = function(Hue, Saturation, Brightness) { // Range 65535, 255, 255
      this.hue = Hue;
      this.sat = Saturation;
      this.bri = Brightness;
      return this;
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
      var HueAngSatBri = HelperRGBtoHueAngSatBri(Red / 255, Green / 255, Blue / 255);
      return this.SetHueAngSatBri(HueAngSatBri.Ang, HueAngSatBri.Sat, HueAngSatBri.Bri);
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

  /*
   * Light
   *
   */
  this.LightGet = function()
  { // GET /api/username/lights
    var That = this;
    var url = "http://" + this.BridgeIP + "/api/" + this.Username + "/lights";
    return $.get(url, function(data) {
      if (data) {
        That.Lights = data;
      }
    });
  };

  this.LightsSearchForNew = function()
  { // POST /api/username/lights
    return $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/lights"
    });
  };
  
  this.LightsGetNew = function()
  { // GET /api/username/lights/new
    var url = "http://" + this.BridgeIP + "/api/" + this.Username + "/lights/new";
    return $.get(url);
  };
  
  this.LightSetName = function(LightNr, Name) // Name = String[32]
  { // PUT /api/username/lights
    return $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/light/" + LightNr,
      data: '{"name" : "' + Name + '"}'
    });
  };
  
  this.LightSetState = function(LightNr, State)
  { // PUT /api/username/lights/[LightNr]/state
    return $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/lights/" + LightNr + "/state",
      data: State.Get()
    });
  };

  this.LightOn = function(LightNr, Transitiontime)
  {
    var State = new Lightstate();
    State.On();
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightOff = function(LightNr, Transitiontime)
  {
    var State = new Lightstate();
    State.Off();
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightSetHSB = function(LightNr, Hue, Saturation, Brightness, Transitiontime)
  {
    var Ang = Hue * 360 / 65535;
    var Sat = Saturation / 255;
    var Bri = Brightness / 255;

    var Color = HelperHueAngSatBritoRGB(Ang, Sat, Bri);
    var Point = HelperRGBtoXY(Color.Red, Color.Green, Color.Blue);
    return $.when(
    this.LightSetBrightness(LightNr, Brightness, Transitiontime),
    this.LightSetXY(LightNr, Point.x, Point.y, Transitiontime)
    );
  };

  this.LightSetHue = function(LightNr, Hue, Transitiontime)
  {
    var State = new Lightstate();
    State.SetHue(Hue);
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightSetSaturation = function(LightNr, Saturation, Transitiontime)
  {
    var State = new Lightstate();
    State.SetSaturation(Saturation);
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightSetBrightness = function(LightNr, Brightness, Transitiontime)
  {
    var State = new Lightstate();
    State.SetBrightness(Brightness);
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightSetHueAngSatBri = function(LightNr, Ang, Sat, Bri, Transitiontime)
  { // In: Hue in Deg, Saturation, Brightness 0.0-1.0 Transform To Philips Hue Range...
    if (Ang < 0)
      Ang = Ang + 360;
    Ang = Ang % 360;
    return this.LightSetHSB(LightNr, Math.round(Ang / 360 * 65535), Sat * 255, Bri * 255, Transitiontime);
  };

  this.LightSetRGB = function(LightNr, Red, Green, Blue, Transitiontime) // 0-255;FF
  {
    var Point = HelperRGBtoXY(Red / 255, Green / 255, Blue / 255);
    var HueAngSatBri = HelperRGBtoHueAngSatBri(Red / 255, Green / 255, Blue / 255);
    return $.when(
    this.LightSetBrightness(Math.round(HueAngSatBri.Bri * 255)),
    this.LightSetXY(LightNr, Point.x, Point.y, Transitiontime)
    );
  };

  this.LightSetCT = function(LightNr, CT, Transitiontime)
  {
    var State = new Lightstate();
    State.SetCT(CT);
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightSetColortemperature = function(LightNr, Colortemperature, Transitiontime)
  {
    var State = new Lightstate();
    State.SetColortemperature(Colortemperature);
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightSetXY = function(LightNr, X, Y, Transitiontime)
  {
    var Model = this.Lights[LightNr].modelid;
    var Gamuted = HelperGamutXYforModel(X, Y, Model);
    var State = new Lightstate();
    State.SetXY(Gamuted.x, Gamuted.y);
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightAlertSelect = function(LightNr, Transitiontime)
  {
    var State = new Lightstate();
    State.AlertSelect();
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightAlertLSelect = function(LightNr, Transitiontime)
  {
    var State = new Lightstate();
    State.AlertLSelect();
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightAlertNone = function(LightNr, Transitiontime)
  {
    var State = new Lightstate();
    State.AlertNone();
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightEffectColorloop = function(LightNr, Transitiontime)
  {
    var State = new Lightstate();
    State.EffectColorloop();
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  this.LightEffectNone = function(LightNr, Transitiontime)
  {
    var State = new Lightstate();
    State.EffectNone();
    State.SetTransitiontime(Transitiontime);
    return this.LightSetState(LightNr, State);
  };

  /*
   * Group
   *
   */
  this.GroupGet = function()
  { // GET /api/username/lights
    var That = this;
    var url = "http://" + this.BridgeIP + "/api/" + this.Username + "/groups";
    return $.get(url, function(data) {
      if (data) {
        That.Groups = data;
      }
    });
  };

  function HelperToStringArray(Items) {
    if (typeof Items === "number") {
      return '"'+Items.toString()+'"';
    } else if (Object.prototype.toString.call( Items ) === "[object Array]") {
       var Result="[";
       for (var ItemNr = 0; ItemNr<Items.length; ItemNr++) {
         Result += HelperToStringArray(Items[ItemNr]) 
         if (ItemNr<Items.length-1) Result += ",";
       };
       Result = Result + "]";
       return Result;
    } else if (typeof Items === "string") {
      return '"'+Items+'"';
    }
  }
  this.GroupCreate = function(Name, Lights) // Bridge doesn't accept lights in a group that are unreachable!
  { // POST /api/username/groups
    return $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/groups/",
      data: '{"name":"' + Name + '" , "lights":' + HelperToStringArray(Lights) + '}'
    });
  };
  
  this.GroupSetName = function(GroupNr, Name)
  { // PUT /api/username/groups/[GroupNr]
    return $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/groups/" + GroupNr,
      data: '{"name":"' + Name + '"}'
    });
  };
  
  this.GroupSetLights = function(GroupNr, Lights)
  { // PUT /api/username/groups/[GroupNr]
    return $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/groups/" + GroupNr,
      data: '{"lights":' + HelperToStringArray(Lights) + '}'
    });
  };
  
  this.GroupSetAttributes = function(GroupNr, Name, LightsArray)
  { // PUT /api/username/groups/[GroupNr]
    return $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/groups/" + GroupNr,
      data: '{"name":"' + Name + '", "lights":' + HelperToStringArray(LightsArray) + '}'
    });
  };
  
  this.GroupDelete = function(GroupNr)
  { // DELETE /api/username/groups/[GroupNr]
    return $.ajax({
      type: "DELETE",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/groups/" + GroupNr
    });
  };
  
  this.GroupSetState = function(GroupNr, State)
  { // PUT /api/username/groups/[GroupNr]/action
    return $.ajax({
      type: "PUT",
      dataType: "json",
      contentType: "application/json",
      url: "http://" + this.BridgeIP + "/api/" + this.Username + "/groups/" + GroupNr + "/action",
      data: State.Get()
    });
  };

  this.GroupOn = function(GroupNr, Transitiontime)
  {
    var State = new Lightstate();
    State.On();
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupOff = function(GroupNr, Transitiontime)
  {
    var State = new Lightstate();
    State.Off();
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupSetHSB = function(GroupNr, Hue, Saturation, Brightness, Transitiontime)
  {
    var Ang = Hue * 360 / 65535;
    var Sat = Saturation / 255;
    var Bri = Brightness / 255;

    var Color = HelperHueAngSatBritoRGB(Ang, Sat, Bri);
    var Point = HelperRGBtoXY(Color.Red, Color.Green, Color.Blue);

    return $.when(// return Deferred when of both Brightness and XY
    this.GroupSetBrightness(GroupNr, Brightness, Transitiontime),
    this.GroupSetXY(GroupNr, Point.x, Point.y, Transitiontime)
    );
  };

  this.GroupSetHue = function(GroupNr, Hue, Transitiontime)
  {
    var State = new Lightstate();
    State.SetHue(Hue);
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupSetSaturation = function(GroupNr, Saturation, Transitiontime)
  {
    var State = new Lightstate();
    State.SetSaturation(Saturation);
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupSetBrightness = function(GroupNr, Brightness, Transitiontime)
  {
    var State = new Lightstate();
    State.SetBrightness(Brightness);
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupSetHueAngSatBri = function(GroupNr, Ang, Sat, Bri, Transitiontime)
  {
    if (Ang < 0)
      Ang = Ang + 360;
    Ang = Ang % 360;
    return this.GroupSetHSB(GroupNr, Math.round(Ang / 360 * 65535), Sat * 255, Bri * 255, Transitiontime);
  };

  this.GroupSetRGB = function(GroupNr, Red, Green, Blue, Transitiontime) // 0-255;FF
  {
    var HueAngSatBri = HelperRGBtoHueAngSatBri(Red / 255, Green / 255, Blue / 255);
    return this.GroupSetHueAngSatBri(GroupNr, HueAngSatBri.Ang, HueAngSatBri.Sat, HueAngSatBri.Bri, Transitiontime);
  };

  this.GroupSetCT = function(GroupNr, CT, Transitiontime)
  {
    var State = new Lightstate();
    State.SetCT(CT);
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupSetColortemperature = function(GroupNr, Colortemperature, Transitiontime)
  {
    var State = new Lightstate();
    State.SetColortemperature(Colortemperature);
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupSetXY = function(GroupNr, X, Y, Transitiontime)
  {
    var Lights = [];
    var LightNr = 0;

    if (GroupNr === 0) { // All Lights
      while (this.Lights[LightNr + 1]) // Build Group
        Lights[LightNr] = ++LightNr;
    } else
      var Lights = this.Groups[GroupNr].lights;

    if (Lights.length !== 0) {
      var deferreds = [];
      for (var LightNr = 0; LightNr < Lights.length; LightNr++) // For Each Light
        deferreds.push(this.LightSetXY(Lights[LightNr], X, Y, Transitiontime));
      return $.when.apply($, deferreds); // return Deferred when with array of deferreds
    }
    // No Lights in Group GroupNr, Set State of Group to let Bridge create the API Error and return it.
    var State = new Lightstate();
    State.SetXY(X, Y);
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupAlertSelect = function(GroupNr, Transitiontime)
  {
    var State = new Lightstate();
    State.AlertSelect();
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupAlertLSelect = function(GroupNr, Transitiontime)
  {
    var State = new Lightstate();
    State.AlertLSelect();
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupAlertNone = function(GroupNr, Transitiontime)
  {
    var State = new Lightstate();
    State.AlertNone();
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupEffectColorloop = function(GroupNr, Transitiontime)
  {
    var State = new Lightstate();
    State.EffectColorloop();
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

  this.GroupEffectNone = function(GroupNr, Transitiontime)
  {
    var State = new Lightstate();
    State.EffectNone();
    State.SetTransitiontime(Transitiontime);
    return this.GroupSetState(GroupNr, State);
  };

}; // HUEPI End

///
//
// Changes:
//
// 0.1
// Initial Public Release
//
// 0.2
// Renamed class Light.State -> Lightstate
// Renamed function Bridge.GetConfig -> Bridge.Get
// Renamed functions Config.* -> Bridge.*
// Added Gamut Color Correction in Lightstate.SetHSB RGB+HSB Settings Will be Color Corrected to HUE Lamp -> xy
//
// 0.21
// Rewrote Gamut Color Correction in Lightstate.SetHSB
//
// 0.3
// HUEPI is now an Object
// Renamed deeper namespaces to top namespace so HUEPI becomes one Object
//   e.g. Group.SetOn() -> GroupSetOn()
//
// 0.4
// Added Helper functions (refactured from 0.3)
// HueAngSatBri HSB RGB for lights and groups are set via SetXY and SetBrightness
// GroupSetXY splits group into Light and calls LightSetXY per Light
// LightSetXY looks up lamp Model and applies Gamut Correction for Model
// Note: Using Lightstate objects are not Gamut Corrected
//
// 0.5
// Implemented Promisses by returning JQuery Promisses (Deffereds)
// Declared local variables where applicable, cleaning up global namespace polution
// Added LightsSearchForNew and LightsGetNew and LightSetName
// Added GroupCreate GroupSetName GroupSetLights GroupSetAttributes GroupDelete 
//   These need more testing ;-)
// 
// 
// 
