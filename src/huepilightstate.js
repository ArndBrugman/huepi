// //////////////////////////////////////////////////////////////////////////////
//
// HuepiLightstate Object
//
//

var Huepi = require('./huepi.js');

/**
 * HuepiLightstate Object.
 * Internal object to recieve all settings that are about to be send to the Bridge as a string.
 *
 * @class
 */

module.exports =
module.exports.default =
class HuepiLightstate {
  constructor() { };
  // /** */
  // //SetOn(On) {
  //  on = On;
  // };
  /** */
  On() {
    this.on = true;
    return this;
  };
  /** */
  Off() {
    this.on = false;
    return this;
  };
  /*
   * @param {number} Hue Range [0..65535]
   * @param {float} Saturation Range [0..255]
   * @param {float} Brightness Range [0..255]
   */
  SetHSB(Hue, Saturation, Brightness) { // Range 65535, 255, 255
    this.hue = Math.round(Hue);
    this.sat = Math.round(Saturation);
    this.bri = Math.round(Brightness);
    return this;
  };
  /**
   * @param {number} Hue Range [0..65535]
   */
  SetHue(Hue) {
    this.hue = Math.round(Hue);
    return this;
  };
  /**
   * @param {float} Saturation Range [0..255]
   */
  SetSaturation(Saturation) {
    this.sat = Math.round(Saturation);
    return this;
  };
  /**
   * @param {float} Brightness Range [0..255]
   */
  SetBrightness(Brightness) {
    this.bri = Math.round(Brightness);
    return this;
  };
  /**
   * @param {float} Ang Range [0..360]
   * @param {float} Sat Range [0..1]
   * @param {float} Bri Range [0..1]
   */
  SetHueAngSatBri(Ang, Sat, Bri) {
    // In: Hue in Deg, Saturation, Brightness 0.0-1.0 Transform To Philips Hue Range...
    while (Ang < 0) {
      Ang = Ang + 360;
    }
    Ang = Ang % 360;
    return this.SetHSB(Math.round(Ang / 360 * 65535), Math.round(Sat * 255), Math.round(Bri * 255));
  };
  /**
   * @param {number} Red Range [0..1]
   * @param {number} Green Range [0..1]
   * @param {number} Blue Range [0..1]
   */
  SetRGB(Red, Green, Blue) {
    var HueAngSatBri;

    HueAngSatBri = Huepi.HelperRGBtoHueAngSatBri(Red, Green, Blue);
    return this.SetHueAngSatBri(HueAngSatBri.Ang, HueAngSatBri.Sat, HueAngSatBri.Bri);
  };
  /**
   * @param {number} Ct Micro Reciprocal Degree of Colortemperature (Ct = 10^6 / Colortemperature)
   */
  SetCT(Ct) {
    this.ct = Math.round(Ct);
    return this;
  };
  /**
   * @param {number} Colortemperature Range [2200..6500] for the 2012 lights
   */
  SetColortemperature(Colortemperature) {
    return this.SetCT(Huepi.HelperColortemperaturetoCT(Colortemperature));
  };
  /**
   * @param {float} X
   * @param {float} Y
   */
  SetXY(X, Y) {
    this.xy = [X, Y];
    return this;
  };
  // /** */
  // SetAlert(Alert) {
  //   alert = Alert;
  // };
  /** */
  AlertSelect() {
    this.alert = 'select';
    return this;
  };
  /** */
  AlertLSelect() {
    this.alert = 'lselect';
    return this;
  };
  /** */
  AlertNone() {
    this.alert = 'none';
    return this;
  };
  // /** */
  // SetEffect(Effect) {
  //   effect = Effect;
  // };
  /** */
  EffectColorloop() {
    this.effect = 'colorloop';
    return this;
  };
  /** */
  EffectNone() {
    this.effect = 'none';
    return this;
  };
  /**
   * @param {number} Transitiontime Optional Transitiontime in multiple of 100ms
   *  defaults to 4 (on bridge, meaning 400 ms)
   */
  SetTransitiontime(Transitiontime) {
    if (typeof Transitiontime !== 'undefined') { // Optional Parameter
      this.transitiontime = Transitiontime;
    }
    return this;
  };
  /**
   * @returns {string} Stringified version of the content of LightState ready to be sent to the Bridge.
   */
  Get() {
    return JSON.stringify(this);
  };

};
