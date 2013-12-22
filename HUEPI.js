//////////
///
/// HUE (Philips Wireless Lighting) API for JavaScript
//  HUEPI sounds like Joepie which makes me smile during Development...
///
/// Requires JQuery for ajax calls for now..

HUEPI = function() {
};

/// Overidable Username must be at 10-40 digits
HUEPI.Username = "1234567890";

// Forward Declarations, by lack of a better word or reason
HUEPI.Portal = function() {
};
HUEPI.Portal.Bridges = {};
HUEPI.Bridge = function() {
};
HUEPI.Bridge.Config = {};
HUEPI.Config = function() {
};
HUEPI.Light = function() {
};
HUEPI.Light.Names = new Array();
HUEPI.Light.State = function() {
};
HUEPI.Group = function() {
};
HUEPI.Group.Names = new Array();

HUEPI.Portal.DiscoverLocalBridges = function()
{
    $.get("https://www.meethue.com/api/nupnp", function(data) {
        if (data[0].internalipaddress) {
            HUEPI.Portal.Bridges = data;
            HUEPI.Bridge.IP = HUEPI.Portal.Bridges[0].internalipaddress; // Default to 1st Bridge internalip
        }
    }, "json");
};

HUEPI.Bridge.IP = "";
HUEPI.Bridge.Name = "";
HUEPI.Bridge.UsernameWhitelisted = false; // Will be checked on Bridge.

HUEPI.Config.CreateUser = function()
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

HUEPI.Config.DeleteUser = function(UsernameToDelete)
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

HUEPI.Config.Get = function()
{ // GET /api/username/config -> whitelist.username
    var url = "http://" + HUEPI.Bridge.IP + "/api/" + HUEPI.Username + "/config";
    $.get(url, function(data) {
        HUEPI.Bridge.Config = data;
        HUEPI.Bridge.Name = HUEPI.Bridge.Config.name;
        if (HUEPI.Bridge.Config.whitelist) { // if able to read Whitelisted users, Username must be Whitelisted already :)
            HUEPI.Bridge.UsernameWhitelisted = true;
        }
    });
};

///HUE LIGHT

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

HUEPI.Light = function() {
};

HUEPI.Light.State = function()
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
        return this.SetHSB(Math.round(Ang / 360 * 65535), Sat*255, Bri*255);
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

        // Adjust to Light XY CIE is Work In Progress using
        // https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/commit/f41091cf671e13fe8c32fcced12604cd31cceaf3
        // for details...
        // 
        // Gamma Correction
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

        X = Red * 0.649926 + Green * 0.103455 + Blue * 0.197109;
        Y = Red * 0.234327 + Green * 0.743075 + Blue * 0.022598;
        Z = Red * 0.000000 + Green * 0.053077 + Blue * 1.035763;

        // But you don't want Capital X,Y,Z you want lowercase [x,y] (called the color point) as per:
        Px = X / (X + Y + Z);
        Py = Y / (X + Y + Z);
        // Check if point is inside Triangle for correct model of light
        // Otherwise Closesed to perpidict edge of Triagle
        // Otherwise Closesed Corner of Triangle
        return this.SetXY(Px, Py);
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
    var State = new HUEPI.Light.State();
    State.On();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.Off = function(LightNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.Off();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetHSB = function(LightNr, Hue, Saturation, Brightness, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetHSB(Hue, Saturation, Brightness);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetHue = function(LightNr, Hue, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetHue(Hue);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetSaturation = function(LightNr, Saturation, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetSaturation(Saturation);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetBrightness = function(LightNr, Brightness, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetBrightness(Brightness);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetHueAngSatBri = function(LightNr, Ang, Sat, Bri, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetHueAngSatBri(Ang, Sat, Bri);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetRGB = function(LightNr, Red, Green, Blue, Transitiontime) // 0-255;FF
{
    var State = new HUEPI.Light.State();
    State.SetRGB(Red, Green, Blue);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetCT = function(LightNr, CT, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetCT(CT);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetColortemperature = function(LightNr, Colortemperature, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetColortemperature(Colortemperature);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.SetXY = function(LightNr, X, Y, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetXY(X, Y);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.AlertSelect = function(LightNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.AlertSelect();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.AlertLSelect = function(LightNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.AlertLSelect();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.AlertNone = function(LightNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.AlertNone();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.EffectColorloop = function(LightNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.EffectColorloop();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};

HUEPI.Light.EffectNone = function(LightNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.EffectNone();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Light.SetState(LightNr, State);
};


/// HUE GROUP
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
    var State = new HUEPI.Light.State();
    State.On();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.Off = function(GroupNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.Off();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetHSB = function(GroupNr, Hue, Saturation, Brightness, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetHSB(Hue, Saturation, Brightness);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetHue = function(GroupNr, Hue, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetHue(Hue);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetSaturation = function(GroupNr, Saturation, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetSaturation(Saturation);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetBrightness = function(GroupNr, Brightness, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetBrightness(Brightness);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetHueAngSatBri = function(GroupNr, Ang, Sat, Bri, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetHueAngSatBri(Ang, Sat, Bri);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetRGB = function(GroupNr, Red, Green, Blue, Transitiontime) // 0-255;FF
{
    var State = new HUEPI.Light.State();
    State.SetRGB(Red, Green, Blue);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetCT = function(GroupNr, CT, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetCT(CT);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetColortemperature = function(GroupNr, Colortemperature, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetColortemperature(Colortemperature);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.SetXY = function(GroupNr, X, Y, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.SetXY(X, Y);
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.AlertSelect = function(GroupNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.AlertSelect();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.AlertLSelect = function(GroupNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.AlertLSelect();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.AlertNone = function(GroupNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.AlertNone();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.EffectColorloop = function(GroupNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.EffectColorloop();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};

HUEPI.Group.EffectNone = function(GroupNr, Transitiontime)
{
    var State = new HUEPI.Light.State();
    State.EffectNone();
    State.SetTransitiontime(Transitiontime);
    HUEPI.Group.SetState(GroupNr, State);
};
