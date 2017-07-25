(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["huepi"] = factory();
	else
		root["huepi"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// //////////////////////////////////////////////////////////////////////////////
//
// HuepiLightstate Object
//
//

var Huepi = __webpack_require__(1);

/**
 * HuepiLightstate Object.
 * Internal object to recieve all settings that are about to be send to the Bridge as a string.
 *
 * @class
 * @alias HuepiLightstate
 */

var HuepiLightstate = function () {
  function HuepiLightstate() {
    _classCallCheck(this, HuepiLightstate);
  }
  // /** */
  // //SetOn(On) {
  //  on = On;
  // };
  /** */


  _createClass(HuepiLightstate, [{
    key: 'On',
    value: function On() {
      this.on = true;
      return this;
    }
    /** */

  }, {
    key: 'Off',
    value: function Off() {
      this.on = false;
      return this;
    }
    /*
     * @param {number} Hue Range [0..65535]
     * @param {float} Saturation Range [0..255]
     * @param {float} Brightness Range [0..255]
     */

  }, {
    key: 'SetHSB',
    value: function SetHSB(Hue, Saturation, Brightness) {
      // Range 65535, 255, 255
      this.hue = Math.round(Hue);
      this.sat = Math.round(Saturation);
      this.bri = Math.round(Brightness);
      return this;
    }
    /**
     * @param {number} Hue Range [0..65535]
     */

  }, {
    key: 'SetHue',
    value: function SetHue(Hue) {
      this.hue = Math.round(Hue);
      return this;
    }
    /**
     * @param {float} Saturation Range [0..255]
     */

  }, {
    key: 'SetSaturation',
    value: function SetSaturation(Saturation) {
      this.sat = Math.round(Saturation);
      return this;
    }
    /**
     * @param {float} Brightness Range [0..255]
     */

  }, {
    key: 'SetBrightness',
    value: function SetBrightness(Brightness) {
      this.bri = Math.round(Brightness);
      return this;
    }
    /**
     * @param {float} Ang Range [0..360]
     * @param {float} Sat Range [0..1]
     * @param {float} Bri Range [0..1]
     */

  }, {
    key: 'SetHueAngSatBri',
    value: function SetHueAngSatBri(Ang, Sat, Bri) {
      // In: Hue in Deg, Saturation, Brightness 0.0-1.0 Transform To Philips Hue Range...
      while (Ang < 0) {
        Ang = Ang + 360;
      }
      Ang = Ang % 360;
      return this.SetHSB(Math.round(Ang / 360 * 65535), Math.round(Sat * 255), Math.round(Bri * 255));
    }
    /**
     * @param {number} Red Range [0..1]
     * @param {number} Green Range [0..1]
     * @param {number} Blue Range [0..1]
     */

  }, {
    key: 'SetRGB',
    value: function SetRGB(Red, Green, Blue) {
      var HueAngSatBri;

      HueAngSatBri = Huepi.HelperRGBtoHueAngSatBri(Red, Green, Blue);
      return this.SetHueAngSatBri(HueAngSatBri.Ang, HueAngSatBri.Sat, HueAngSatBri.Bri);
    }
    /**
     * @param {number} Ct Micro Reciprocal Degree of Colortemperature (Ct = 10^6 / Colortemperature)
     */

  }, {
    key: 'SetCT',
    value: function SetCT(Ct) {
      this.ct = Math.round(Ct);
      return this;
    }
    /**
     * @param {number} Colortemperature Range [2200..6500] for the 2012 lights
     */

  }, {
    key: 'SetColortemperature',
    value: function SetColortemperature(Colortemperature) {
      return this.SetCT(Huepi.HelperColortemperaturetoCT(Colortemperature));
    }
    /**
     * @param {float} X
     * @param {float} Y
     */

  }, {
    key: 'SetXY',
    value: function SetXY(X, Y) {
      this.xy = [X, Y];
      return this;
    }
    // /** */
    // SetAlert(Alert) {
    //   alert = Alert;
    // };
    /** */

  }, {
    key: 'AlertSelect',
    value: function AlertSelect() {
      this.alert = 'select';
      return this;
    }
    /** */

  }, {
    key: 'AlertLSelect',
    value: function AlertLSelect() {
      this.alert = 'lselect';
      return this;
    }
    /** */

  }, {
    key: 'AlertNone',
    value: function AlertNone() {
      this.alert = 'none';
      return this;
    }
    // /** */
    // SetEffect(Effect) {
    //   effect = Effect;
    // };
    /** */

  }, {
    key: 'EffectColorloop',
    value: function EffectColorloop() {
      this.effect = 'colorloop';
      return this;
    }
    /** */

  }, {
    key: 'EffectNone',
    value: function EffectNone() {
      this.effect = 'none';
      return this;
    }
    /**
     * @param {number} Transitiontime Optional Transitiontime in multiple of 100ms
     *  defaults to 4 (on bridge, meaning 400 ms)
     */

  }, {
    key: 'SetTransitiontime',
    value: function SetTransitiontime(Transitiontime) {
      if (typeof Transitiontime !== 'undefined') {
        // Optional Parameter
        this.transitiontime = Transitiontime;
      }
      return this;
    }
    /**
     * @returns {string} Stringified version of the content of LightState ready to be sent to the Bridge.
     */

  }, {
    key: 'Get',
    value: function Get() {
      return JSON.stringify(this);
    }
  }]);

  return HuepiLightstate;
}();

module.exports = module.exports.default = HuepiLightstate;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// //////////////////////////////////////////////////////////////////////////////
//
// hue (Philips Wireless Lighting) Api interface for JavaScript
//  +-> HUEPI sounds like Joepie which makes me smile during development...
//
// Requires fetch for http calls and uses regular modern Promisses
//
// //////////////////////////////////////////////////////////////////////////////

var HuepiLightstate = __webpack_require__(0);

/**
 * huepi Object, Entry point for all interaction with Lights etc via the Bridge.
 *
 * @class
 * @alias Huepi
 */

var Huepi = function () {
  function Huepi() {
    _classCallCheck(this, Huepi);

    /** @member {string} - version of the huepi interface */
    this.version = '1.5.0';

    /** @member {array} - Array of all Bridges on the local network */
    this.LocalBridges = [];

    /** @member {bool} - get: local network scan in progress / set:proceed with scan */
    this.ScanningNetwork = false;
    /** @member {number} - local network scan progress in % */
    this.ScanProgress = 0;

    /** @member {string} - IP address of the Current(active) Bridge */
    this.BridgeIP = '';
    /** @member {string} - ID (Unique, is MAC address) of the Current(active) Bridge */
    this.BridgeID = '';
    /** @member {string} - Username for Whitelisting, generated by the Bridge */
    this.Username = '';

    /** @member {object} - Cache Hashmap of huepi BridgeID and Whitelisted Username */
    this.BridgeCache = {};
    /** @member {boolean} - Autosave Cache Hasmap of huepi BridgeID and Whitelisted Username */
    this.BridgeCacheAutosave = true;
    this._BridgeCacheLoad(); // Load BridgeCache on creation by Default

    /** @member {object} - Configuration of the Current(active) Bridge */
    this.BridgeConfig = {};
    /** @member {string} - Name of the Current(active) Bridge */
    this.BridgeName = '';

    /** @member {array} - Array of all Lights of the Current(active) Bridge */
    this.Lights = [];
    /** @member {array} - Array of all LightIds of the Current(active) Bridge */
    this.LightIds = [];

    /** @member {array} - Array of all Groups of the Current(active) Bridge */
    this.Groups = [];
    /** @member {array} - Array of all GroupIds of the Current(active) Bridge */
    this.GroupIds = [];

    // To Do: Add Schedules, Scenes, Sensors & Rules manupulation functions, they are read only for now
    /** @member {array} - Array of all Schedules of the Current(active) Bridge,
     * NOTE: There are no Setter functions yet */
    this.Schedules = [];
    /** @member {array} - Array of all Scenes of the Current(active) Bridge,
     * NOTE: There are no Setter functions yet */
    this.Scenes = [];
    /** @member {array} - Array of all Sensors of the Current(active) Bridge,
     * NOTE: There are no Setter functions yet */
    this.Sensors = [];
    /** @member {array} - Array of all Rules of the Current(active) Bridge,
     * NOTE: There are no Setter functions yet */
    this.Rules = [];
  }

  // //////////////////////////////////////////////////////////////////////////////
  //
  // Private _BridgeCache Functions, Internal Used
  //
  //

  /**
   * Loads the BridgeCache, typically on startup
   */


  _createClass(Huepi, [{
    key: '_BridgeCacheLoad',
    value: function _BridgeCacheLoad() {
      this.BridgeCache = {};
      try {
        if (typeof window !== 'undefined') {
          var huepiBridgeCache = localStorage.huepiBridgeCache || '{}';

          this.BridgeCache = JSON.parse(huepiBridgeCache); // Load
        } else if (typeof module !== 'undefined' && module.exports) {
          var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));
          var buffer = fs.readFileSync('huepiBridgeCache.json');

          this.BridgeCache = JSON.parse(buffer.toString());
        }
        // console.log('_BridgeCacheLoad()-ed : \n '+ JSON.stringify(this.BridgeCache));
      } catch (error) {
        console.log('Unable to _BridgeCacheLoad() ' + error);
      }
    }
  }, {
    key: '_BridgeCacheAddCurrent',
    value: function _BridgeCacheAddCurrent() {
      console.log('_BridgeCacheAddCurrent ' + this.BridgeID + ' ' + this.Username);
      this.BridgeCache[this.BridgeID] = this.Username;
      if (this.BridgeCacheAutosave) {
        this._BridgeCacheSave();
      }
    }
  }, {
    key: '_BridgeCacheRemoveCurrent',
    value: function _BridgeCacheRemoveCurrent() {
      if (this.BridgeCache[this.BridgeID] === this.Username) {
        console.log('_BridgeCacheRemoveCurrent ' + this.BridgeID + ' ' + this.Username);
        delete this.BridgeCache[this.BridgeID];
        if (this.BridgeCacheAutosave) {
          this._BridgeCacheSave();
        }
      }
    }

    /**
     * Selects the first Bridge from LocalBridges found in BridgeCache and stores in BridgeIP
     *  defaults to 1st Bridge in LocalBridges if no bridge from LocalBridges is found in BridgeCache
     *
     * Internally called in PortalDiscoverLocalBridges and NetworkDiscoverLocalBridges
     */

  }, {
    key: '_BridgeCacheSelectFromLocalBridges',
    value: function _BridgeCacheSelectFromLocalBridges() {
      if (this.LocalBridges.length > 0) {
        // Local Bridges are found
        this.BridgeIP = this.LocalBridges[0].internalipaddress || ''; // Default to 1st Bridge Found
        this.BridgeID = this.LocalBridges[0].id.toLowerCase() || '';
        if (!this.BridgeCache[this.BridgeID]) {
          // if this.BridgeID not found in BridgeCache
          for (var BridgeNr = 1; BridgeNr < this.LocalBridges.length; BridgeNr++) {
            // Search and store Found
            this.BridgeID = this.LocalBridges[BridgeNr].id.toLowerCase();
            if (this.BridgeCache[this.BridgeID]) {
              this.BridgeIP = this.LocalBridges[BridgeNr].internalipaddress;
              break;
            } else {
              this.BridgeID = '';
            }
          }
        }
      }
      this.Username = this.BridgeCache[this.BridgeID] || '';
    }

    /**
     * Saves the BridgeCache, typically on Whitelist new Device or Device no longer whitelisted
     *   as is the case with with @BridgeCacheAutosave on @_BridgeCacheAddCurrent and @_BridgeCacheRemoveCurrent
     * NOTE: Saving this cache might be considered a security issue
     * To counter this security issue, arrange your own load/save code with proper encryption
     */

  }, {
    key: '_BridgeCacheSave',
    value: function _BridgeCacheSave() {
      try {
        if (typeof window !== 'undefined') {
          localStorage.huepiBridgeCache = JSON.stringify(this.BridgeCache); // Save
        } else if (typeof module !== 'undefined' && module.exports) {
          var fs = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"fs\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));

          fs.writeFileSync('huepiBridgeCache.json', JSON.stringify(this.BridgeCache));
        }
        // console.log('_BridgeCacheSave()-ed  : \n '+ JSON.stringify(this.BridgeCache));
      } catch (error) {
        console.log('Unable to _BridgeCacheSave() ' + error);
      }
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    // Network Functions
    //
    //

    /**
     *
     */

  }, {
    key: '_NetworkDiscoverLocalIPs',
    value: function _NetworkDiscoverLocalIPs() {
      // resolves LocalIPs[]
      var LocalIPs = [];
      var RTCPeerConnection = window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection;
      var PeerConnection = new RTCPeerConnection({ iceServers: [] });

      PeerConnection.createDataChannel('');

      return new Promise(function (resolve, reject) {
        PeerConnection.onicecandidate = function (e) {
          if (!e.candidate) {
            PeerConnection.close();
            return resolve(LocalIPs);
          }
          var LocalIP = /^candidate:.+ (\S+) \d+ typ/.exec(e.candidate.candidate)[1];

          if (LocalIPs.indexOf(LocalIP) === -1) {
            LocalIPs.push(LocalIP);
          }
          return LocalIPs;
        };
        PeerConnection.createOffer(function (sdp) {
          PeerConnection.setLocalDescription(sdp);
        }, function (Error) {});
      });
    }

    /**
     *
     */

  }, {
    key: '_NetworkCheckIP',
    value: function _NetworkCheckIP(IPAddress) {
      var _this = this;

      var Parallel = 16;

      this.BridgeGetConfig(IPAddress, 3000).then(function (data) {
        _this.LocalBridges.push({ 'internalipaddress': IPAddress, 'id': data.bridgeid.toLowerCase() });
      }).then(function () {}).catch(function () {}) // next .then is .always called
      .then(function () {
        var Segment = IPAddress.slice(0, IPAddress.lastIndexOf('.') + 1);
        var Nr = parseInt(IPAddress.slice(IPAddress.lastIndexOf('.') + 1, IPAddress.length), 10);

        _this.ScanProgress = Math.floor(100 * Nr / 255);
        // console.log('huepi scanning ',this.ScanProgress,'% done');
        if (_this.ScanningNetwork === false) {
          Nr = 256; // Stop scanning if (this.ScanningNetwork = false)
        }
        if (Nr + Parallel < 256) {
          _this._NetworkCheckIP(Segment + (Nr + Parallel));
        } else {
          _this.ScanningNetwork = false;
        }
      });
    }

    /**
     *
     */

  }, {
    key: '_NetworkDiscoverLocalBridges',
    value: function _NetworkDiscoverLocalBridges(LocalIPs) {
      var _this2 = this;

      var Parallel = 16;

      this.ScanProgress = 0;
      return new Promise(function (resolve, reject) {
        for (var IPs = 0; IPs < LocalIPs.length; IPs++) {
          var InitialIP = LocalIPs[IPs].slice(0, LocalIPs[IPs].lastIndexOf('.') + 1);

          for (var P = 1; P <= Parallel; P++) {
            _this2._NetworkCheckIP(InitialIP + P);
          }
          resolve();
        }
      });
    }

    /**
     * Creates the list of hue-Bridges on the local network
     */

  }, {
    key: 'NetworkDiscoverLocalBridges',
    value: function NetworkDiscoverLocalBridges() {
      var _this3 = this;

      this.ScanningNetwork = true;
      this.BridgeIP = this.BridgeID = this.BridgeName = this.Username = '';
      this.LocalBridges = [];

      return new Promise(function (resolve, reject) {
        _this3._NetworkDiscoverLocalIPs().then(function (LocalIPs) {
          _this3._NetworkDiscoverLocalBridges(LocalIPs).then(function () {
            if (_this3.LocalBridges.length > 0) {
              _this3._BridgeCacheSelectFromLocalBridges();
              resolve();
            } else {
              reject();
            }
          });
        });
      });
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    // Portal Functions
    //
    //

    /**
     * Retreives the list of hue-Bridges on the local network from the hue Portal
     */

  }, {
    key: 'PortalDiscoverLocalBridges',
    value: function PortalDiscoverLocalBridges() {
      var _this4 = this;

      this.BridgeIP = this.BridgeID = this.BridgeName = this.Username = '';
      this.LocalBridges = [];
      return new Promise(function (resolve, reject) {
        fetch('https://www.meethue.com/api/nupnp').then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.length > 0) {
            if (data[0].internalipaddress) {
              // Bridge(s) Discovered
              _this4.LocalBridges = data;
              _this4._BridgeCacheSelectFromLocalBridges();
              resolve(data);
            } else {
              reject('No Bridges found via Portal');
            }
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    //  Bridge Functions
    //
    //

    /**
     * Function to retreive BridgeConfig before Checking Whitelisting.
     * ONCE call BridgeGetConfig Before BridgeGetData to validate we are talking to a hue Bridge
     * available members (as of 'apiversion': '1.11.0'):
     *   name, apiversion, swversion, mac, bridgeid, replacesbridgeid, factorynew, modelid
     *
     * @param {string} ConfigBridgeIP - Optional BridgeIP to GetConfig from, otherwise uses BridgeIP (this).
     * @param {string} ConfigTimeOut - Optional TimeOut for network request, otherwise uses 60 seconds.
     */

  }, {
    key: 'BridgeGetConfig',
    value: function BridgeGetConfig(ConfigBridgeIP, ConfigTimeOut) {
      var _this5 = this;

      // GET /api/config -> data.config.whitelist.username
      ConfigBridgeIP = ConfigBridgeIP || this.BridgeIP;
      ConfigTimeOut = ConfigTimeOut || 60000;

      return new Promise(function (resolve, reject) {
        fetch('http://' + ConfigBridgeIP + '/api/config/', { timeout: ConfigTimeOut }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.bridgeid) {
            if (_this5.BridgeIP === ConfigBridgeIP) {
              _this5.BridgeConfig = data;
              if (_this5.BridgeConfig.bridgeid) {
                // SteveyO/Hue-Emulator doesn't supply bridgeid as of yet.
                _this5.BridgeID = _this5.BridgeConfig.bridgeid.toLowerCase();
              } else {
                _this5.BridgeID = '';
              }
              _this5.BridgeName = _this5.BridgeConfig.name;
              _this5.Username = _this5.BridgeCache[_this5.BridgeID];
              if (typeof _this5.Username === 'undefined') {
                _this5.Username = '';
              }
            }
            resolve(data);
          } else {
            // this BridgeIP is not a hue Bridge
            reject('this BridgeIP is not a hue Bridge');
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    /**
     * Function to retreive BridgeDescription before Checking Whitelisting.
     * ONCE call BridgeGetDescription Before BridgeGetData to validate we are talking to a hue Bridge
     *
     * REMARK: Needs a fix of the hue bridge to allow CORS on xml endpoint too,
     *  just like on json endpoints already is implemented.
     *
     * @param {string} ConfigBridgeIP - Optional BridgeIP to GetConfig from, otherwise uses BridgeIP (this).
     * @param {string} ConfigTimeOut - Optional TimeOut for network request, otherwise uses 60 seconds.
     */

  }, {
    key: 'BridgeGetDescription',
    value: function BridgeGetDescription(ConfigBridgeIP, ConfigTimeOut) {
      var _this6 = this;

      // GET /description.xml -> /device/serialNumber
      ConfigBridgeIP = ConfigBridgeIP || this.BridgeIP;
      ConfigTimeOut = ConfigTimeOut || 60000;

      return new Promise(function (resolve, reject) {
        fetch('http://' + ConfigBridgeIP + '/description.xml', { timeout: ConfigTimeOut }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data.indexOf('hue_logo_0.png') > 0) {
            if (data.indexOf('<serialNumber>') > 0) {
              _this6.BridgeID = data.substr(14 + data.indexOf('<serialNumber>'), data.indexOf('</serialNumber>') - data.indexOf('<serialNumber>') - 14).toLowerCase();
            }
            if (data.indexOf('<friendlyName>') > 0) {
              _this6.BridgeName = data.substr(14 + data.indexOf('<friendlyName>'), data.indexOf('</friendlyName>') - data.indexOf('<friendlyName>') - 14);
            }
            _this6.Username = _this6.BridgeCache[_this6.BridgeID];
            if (typeof _this6.Username === 'undefined') {
              // Correct 001788[....]200xxx -> 001788FFFE200XXX short and long serialnumer difference
              _this6.BridgeID = _this6.BridgeID.slice(0, 6) + 'fffe' + _this6.BridgeID.slice(6, 12);
              _this6.Username = _this6.BridgeCache[_this6.BridgeID];
              if (typeof _this6.Username === 'undefined') {
                _this6.Username = '';
              }
            }
            resolve(data);
          } else {
            // this BridgeIP is not a hue Bridge
            reject('this BridgeIP is not a hue Bridge');
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    /**
     * Update function to retreive Bridge data and store it in this object.
     * Consider this the main 'Get' function.
     * Typically used for Heartbeat or manual updates of local data.
     */

  }, {
    key: 'BridgeGetData',
    value: function BridgeGetData() {
      var _this7 = this;

      // GET /api/username -> data.config.whitelist.username
      return new Promise(function (resolve, reject) {
        if (_this7.Username === '') {
          reject('Username must be set before calling BridgeGetData');
        } else {
          fetch('http://' + _this7.BridgeIP + '/api/' + _this7.Username).then(function (response) {
            return response.json();
          }).then(function (data) {
            if (typeof data.config !== 'undefined') {
              // if able to read Config, Username must be Whitelisted
              _this7.BridgeConfig = data.config;
              if (_this7.BridgeConfig.bridgeid) {
                // SteveyO/Hue-Emulator doesn't supply bridgeid as of yet.
                _this7.BridgeID = _this7.BridgeConfig.bridgeid.toLowerCase();
              } else {
                _this7.BridgeID = '';
              }
              _this7.BridgeName = _this7.BridgeConfig.name;
              _this7.Lights = data.lights;
              _this7.LightIds = [];
              for (var key in _this7.Lights) {
                _this7.LightIds.push(key);
              }
              _this7.Groups = data.groups;
              _this7.GroupIds = [];
              for (var _key in _this7.Groups) {
                _this7.GroupIds.push(_key);
              }
              _this7.Schedules = data.schedules;
              _this7.Scenes = data.scenes;
              _this7.Sensors = data.sensors;
              _this7.Rules = data.rules;
              _this7.BridgeName = _this7.BridgeConfig.name;
              resolve(data);
            } else {
              // Username is no longer whitelisted
              if (_this7.Username !== '') {
                _this7._BridgeCacheRemoveCurrent();
              }
              _this7.Username = '';
              reject('Username is no longer whitelisted');
            }
          }).catch(function (message) {
            // fetch failed
            reject(message);
          });
        }
      });
    }

    /**
     * Whitelists the Username stored in this object.
     * Note: a buttonpress on the bridge is requered max 30 sec before this to succeed.
     * please only use this once per device, Username is stored in cache.
     *
     * @param {string} DeviceName - Optional device name to Whitelist.
     */

  }, {
    key: 'BridgeCreateUser',
    value: function BridgeCreateUser(DeviceName) {
      var _this8 = this;

      // POST /api {'devicetype': 'AppName#DeviceName' }
      DeviceName = DeviceName || 'WebInterface';

      return new Promise(function (resolve, reject) {
        fetch('http://' + _this8.BridgeIP + '/api', '{"devicetype": "huepi#' + DeviceName + '"}', { method: 'POST' }).then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data[0] && data[0].success) {
            _this8.Username = data[0].success.username;
            _this8._BridgeCacheAddCurrent();
            resolve(data);
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    /**
     * @param {string} UsernameToDelete - Username that will be revoked from the Whitelist.
     * Note: Username stored in this object need to be Whitelisted to succeed.
     */

  }, {
    key: 'BridgeDeleteUser',
    value: function BridgeDeleteUser(UsernameToDelete) {
      // DELETE /api/username/config/whitelist/username {'devicetype': 'iPhone', 'username': '1234567890'}
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/config/whitelist/' + UsernameToDelete, { method: 'DELETE' });
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    //  Huepi.Helper Functions
    //
    //

    /**
     * @param {string} Model
     * @returns {boolean} Model is capable of CT
     */

  }, {
    key: 'LightGetId',


    // //////////////////////////////////////////////////////////////////////////////
    //
    // Light Functions
    //
    //

    /**
     * @param {number} LightNr - LightNr
     * @returns {string} LightId
     */
    value: function LightGetId(LightNr) {
      if (typeof LightNr === 'number') {
        if (LightNr <= this.LightIds.length) {
          return this.LightIds[LightNr - 1];
        }
      }
      return LightNr;
    }

    /**
     * @param {string} LightId - LightId
     * @returns {number} LightNr
     */

  }, {
    key: 'LightGetNr',
    value: function LightGetNr(LightId) {
      if (typeof LightId === 'string') {
        return this.LightIds.indexOf(LightId) + 1;
      }
      return LightId;
    }

    /**
     */

  }, {
    key: 'LightsGetData',
    value: function LightsGetData() {
      var _this9 = this;

      // GET /api/username/lights
      return new Promise(function (resolve, reject) {
        fetch('http://' + _this9.BridgeIP + '/api/' + _this9.Username + '/lights').then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data) {
            _this9.Lights = data;
            _this9.LightIds = [];
            for (var key in _this9.Lights) {
              _this9.LightIds.push(key);
            }
            resolve(data);
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    /**
     */

  }, {
    key: 'LightsSearchForNew',
    value: function LightsSearchForNew() {
      // POST /api/username/lights
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/lights', { method: 'POST' });
    }

    /**
     */

  }, {
    key: 'LightsGetNew',
    value: function LightsGetNew() {
      // GET /api/username/lights/new
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/lights/new');
    }

    /**
     * @param {number} LightNr
     * @param {string} Name New name of the light Range [1..32]
     */

  }, {
    key: 'LightSetName',
    value: function LightSetName(LightNr, Name) {
      // PUT /api/username/lights
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/lights/' + this.LightGetId(LightNr), { method: 'PUT', body: '{"name" : "' + Name + '"}' });
    }

    /**
     * @param {number} LightNr
     * @param {HuepiLightstate} State
     */

  }, {
    key: 'LightSetState',
    value: function LightSetState(LightNr, State) {
      // PUT /api/username/lights/[LightNr]/state
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/lights/' + this.LightGetId(LightNr) + '/state', { method: 'PUT', body: State.Get() });
    }

    /**
     * @param {number} LightNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightOn',
    value: function LightOn(LightNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.On();
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * @param {number} LightNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightOff',
    value: function LightOff(LightNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.Off();
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * Sets Gamut Corrected values for HSB
     * @param {number} LightNr
     * @param {number} Hue Range [0..65535]
     * @param {number} Saturation Range [0..255]
     * @param {number} Brightness Range [0..255]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetHSB',
    value: function LightSetHSB(LightNr, Hue, Saturation, Brightness, Transitiontime) {
      var HueAng = Hue * 360 / 65535;
      var Sat = Saturation / 255;
      var Bri = Brightness / 255;

      var Color = Huepi.HelperHueAngSatBritoRGB(HueAng, Sat, Bri);
      var Point = Huepi.HelperRGBtoXY(Color.Red, Color.Green, Color.Blue);

      return Promise.all([this.LightSetBrightness(LightNr, Brightness, Transitiontime), this.LightSetXY(LightNr, Point.x, Point.y, Transitiontime)]);
    }

    /**
     * @param {number} LightNr
     * @param {number} Hue Range [0..65535]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetHue',
    value: function LightSetHue(LightNr, Hue, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.SetHue(Hue);
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * @param {number} LightNr
     * @param Saturation Range [0..255]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetSaturation',
    value: function LightSetSaturation(LightNr, Saturation, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.SetSaturation(Saturation);
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * @param {number} LightNr
     * @param Brightness Range [0..255]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetBrightness',
    value: function LightSetBrightness(LightNr, Brightness, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.SetBrightness(Brightness);
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * @param {number} LightNr
     * @param Ang Range [0..360]
     * @param Sat Range [0..1]
     * @param Bri Range [0..1]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetHueAngSatBri',
    value: function LightSetHueAngSatBri(LightNr, Ang, Sat, Bri, Transitiontime) {
      // In: Hue in Deg, Saturation, Brightness 0.0-1.0 Transform To Philips Hue Range...
      while (Ang < 0) {
        Ang = Ang + 360;
      }
      Ang = Ang % 360;
      return this.LightSetHSB(LightNr, Ang / 360 * 65535, Sat * 255, Bri * 255, Transitiontime);
    }

    /**
     * @param {number} LightNr
     * @param Red Range [0..1]
     * @param Green Range [0..1]
     * @param Blue Range [0..1]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetRGB',
    value: function LightSetRGB(LightNr, Red, Green, Blue, Transitiontime) {
      var Point = Huepi.HelperRGBtoXY(Red, Green, Blue);
      var HueAngSatBri = Huepi.HelperRGBtoHueAngSatBri(Red, Green, Blue);

      return Promise.all([this.LightSetBrightness(LightNr, HueAngSatBri.Bri * 255), this.LightSetXY(LightNr, Point.x, Point.y, Transitiontime)]);
    }

    /**
     * @param {number} LightNr
     * @param {number} CT micro reciprocal degree
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetCT',
    value: function LightSetCT(LightNr, CT, Transitiontime) {
      var Model = this.Lights[this.LightGetId(LightNr)].modelid;

      if (Huepi.HelperModelCapableCT(Model)) {
        var State = void 0;

        State = new HuepiLightstate();
        State.SetCT(CT);
        State.SetTransitiontime(Transitiontime);
        return this.LightSetState(LightNr, State);
      } // else if (Huepi.HelperModelCapableXY(Model)) {
      // hue CT Incapable Lights: CT->RGB->XY to ignore Brightness in RGB}
      var Color = Huepi.HelperColortemperaturetoRGB(Huepi.HelperCTtoColortemperature(CT));
      var Point = Huepi.HelperRGBtoXY(Color.Red, Color.Green, Color.Blue);

      return this.LightSetXY(LightNr, Point.x, Point.y, Transitiontime);
    }

    /**
     * @param {number} LightNr
     * @param {number} Colortemperature Range [2200..6500] for the 2012 model
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetColortemperature',
    value: function LightSetColortemperature(LightNr, Colortemperature, Transitiontime) {
      return this.LightSetCT(LightNr, Huepi.HelperColortemperaturetoCT(Colortemperature), Transitiontime);
    }

    /**
     * @param {number} LightNr
     * @param {float} X
     * @param {float} Y
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightSetXY',
    value: function LightSetXY(LightNr, X, Y, Transitiontime) {
      var Model = this.Lights[this.LightGetId(LightNr)].modelid;

      if (Huepi.HelperModelCapableXY(Model)) {
        var State = void 0;

        State = new HuepiLightstate();
        var Gamuted = Huepi.HelperGamutXYforModel(X, Y, Model);

        State.SetXY(Gamuted.x, Gamuted.y);
        State.SetTransitiontime(Transitiontime);
        return this.LightSetState(LightNr, State);
      } // else if (Huepi.HelperModelCapableCT(Model)) {
      // hue XY Incapable Lights: XY->RGB->CT to ignore Brightness in RGB
      var Color = Huepi.HelperXYtoRGB(X, Y);
      var Colortemperature = Huepi.HelperRGBtoColortemperature(Color.Red, Color.Green, Color.Blue);

      return this.LightSetColortemperature(LightNr, Colortemperature, Transitiontime);
    }

    /**
     * @param {number} LightNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightAlertSelect',
    value: function LightAlertSelect(LightNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.AlertSelect();
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * @param {number} LightNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightAlertLSelect',
    value: function LightAlertLSelect(LightNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.AlertLSelect();
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * @param {number} LightNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightAlertNone',
    value: function LightAlertNone(LightNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.AlertNone();
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * @param {number} LightNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightEffectColorloop',
    value: function LightEffectColorloop(LightNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.EffectColorloop();
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    /**
     * @param {number} LightNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'LightEffectNone',
    value: function LightEffectNone(LightNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.EffectNone();
      State.SetTransitiontime(Transitiontime);
      return this.LightSetState(LightNr, State);
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    // Group Functions
    //
    //

    /**
     * @param {number} GroupNr - GroupNr
     * @returns {string} GroupId
     */

  }, {
    key: 'GroupGetId',
    value: function GroupGetId(GroupNr) {
      if (typeof GroupNr === 'number') {
        if (GroupNr === 0) {
          return '0';
        } else if (GroupNr > 0) {
          if (GroupNr <= this.GroupIds.length) {
            return this.GroupIds[GroupNr - 1];
          }
        }
      }
      return GroupNr;
    }

    /**
     * @param {string} GroupId - GroupId
     * @returns {number} GroupNr
     */

  }, {
    key: 'GroupGetNr',
    value: function GroupGetNr(GroupId) {
      if (typeof GroupId === 'string') {
        return this.GroupIds.indexOf(GroupId) + 1;
      }
      return GroupId;
    }

    /**
     */

  }, {
    key: 'GroupsGetData',
    value: function GroupsGetData() {
      var _this10 = this;

      // GET /api/username/groups
      return new Promise(function (resolve, reject) {
        fetch('http://' + _this10.BridgeIP + '/api/' + _this10.Username + '/groups').then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data) {
            _this10.Groups = data;
            _this10.GroupIds = [];
            for (var key in _this10.Groups) {
              _this10.GroupIds.push(key);
            }
            resolve(data);
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    /**
     */

  }, {
    key: 'GroupsGetZero',
    value: function GroupsGetZero() {
      var _this11 = this;

      // GET /api/username/groups/0
      return new Promise(function (resolve, reject) {
        fetch('http://' + _this11.BridgeIP + '/api/' + _this11.Username + '/groups/0').then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data) {
            _this11.Groups['0'] = data;
            resolve(data);
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    /**
     * Note: Bridge doesn't accept lights in a Group that are unreachable at moment of creation
     * @param {string} Name New name of the light Range [1..32]
     * @param {multiple} Lights LightNr or Array of Lights to Group
     */

  }, {
    key: 'GroupCreate',
    value: function GroupCreate(Name, Lights) {
      // POST /api/username/groups
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/groups/', { method: 'POST', body: '{"name": "' + Name + '" , "lights":' + Huepi.HelperToStringArray(Lights) + '}' });
    }

    /**
     * @param {number} GroupNr
     * @param {string} Name New name of the light Range [1..32]
     */

  }, {
    key: 'GroupSetName',
    value: function GroupSetName(GroupNr, Name) {
      // PUT /api/username/groups/[GroupNr]
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/groups/' + this.GroupGetId(GroupNr), { method: 'PUT', body: '{"name": "' + Name + '"}' });
    }

    /**
     * Note: Bridge doesn't accept lights in a Group that are unreachable at moment of creation
     * @param {number} GroupNr
     * @param {multiple} Lights LightNr or Array of Lights to Group
     */

  }, {
    key: 'GroupSetLights',
    value: function GroupSetLights(GroupNr, Lights) {
      // PUT /api/username/groups/[GroupNr]
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/groups/' + this.GroupGetId(GroupNr), { method: 'PUT', body: '{"lights":' + Huepi.HelperToStringArray(Lights) + '}' });
    }

    /**
     * Note: Bridge doesn't accept lights in a Group that are unreachable at moment of creation
     * @param {number} GroupNr
     * @param {string} Name New name of the light Range [1..32]
     * @param {multiple} Lights LightNr or Array of Lights to Group
     */

  }, {
    key: 'GroupSetAttributes',
    value: function GroupSetAttributes(GroupNr, Name, Lights) {
      // PUT /api/username/groups/[GroupNr]
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/groups/' + this.GroupGetId(GroupNr), { method: 'PUT', body: '{"name": "' + Name + '", "lights":' + Huepi.HelperToStringArray(Lights) + '}' });
    }

    /**
     * @param {number} GroupNr
     */

  }, {
    key: 'GroupDelete',
    value: function GroupDelete(GroupNr) {
      // DELETE /api/username/groups/[GroupNr]
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/groups/' + this.GroupGetId(GroupNr), { method: 'DELETE' });
    }

    /**
     * @param {number} GroupNr
     * @param {HuepiLightstate} State
     */

  }, {
    key: 'GroupSetState',
    value: function GroupSetState(GroupNr, State) {
      // PUT /api/username/groups/[GroupNr]/action
      return fetch('http://' + this.BridgeIP + '/api/' + this.Username + '/groups/' + this.GroupGetId(GroupNr) + '/action', { method: 'PUT', body: State.Get() });
    }

    /**
     * @param {number} GroupNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupOn',
    value: function GroupOn(GroupNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.On();
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupOff',
    value: function GroupOff(GroupNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.Off();
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * Sets Gamut Corrected values for HSB
     * @param {number} GroupNr
     * @param {number} Hue Range [0..65535]
     * @param {number} Saturation Range [0..255]
     * @param {number} Brightness Range [0..255]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetHSB',
    value: function GroupSetHSB(GroupNr, Hue, Saturation, Brightness, Transitiontime) {
      var Ang = Hue * 360 / 65535;
      var Sat = Saturation / 255;
      var Bri = Brightness / 255;

      var Color = Huepi.HelperHueAngSatBritoRGB(Ang, Sat, Bri);
      var Point = Huepi.HelperRGBtoXY(Color.Red, Color.Green, Color.Blue);

      return Promise.all([this.GroupSetBrightness(GroupNr, Brightness, Transitiontime), this.GroupSetXY(GroupNr, Point.x, Point.y, Transitiontime)]);
    }

    /**
     * @param {number} GroupNr
     * @param {number} Hue Range [0..65535]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetHue',
    value: function GroupSetHue(GroupNr, Hue, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.SetHue(Hue);
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param Saturation Range [0..255]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetSaturation',
    value: function GroupSetSaturation(GroupNr, Saturation, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.SetSaturation(Saturation);
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param Brightness Range [0..255]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetBrightness',
    value: function GroupSetBrightness(GroupNr, Brightness, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.SetBrightness(Brightness);
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param Ang Range [0..360]
     * @param Sat Range [0..1]
     * @param Bri Range [0..1]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetHueAngSatBri',
    value: function GroupSetHueAngSatBri(GroupNr, Ang, Sat, Bri, Transitiontime) {
      while (Ang < 0) {
        Ang = Ang + 360;
      }
      Ang = Ang % 360;
      return this.GroupSetHSB(GroupNr, Ang / 360 * 65535, Sat * 255, Bri * 255, Transitiontime);
    }

    /**
     * @param {number} GroupNr
     * @param Red Range [0..1]
     * @param Green Range [0..1]
     * @param Blue Range [0..1]
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetRGB',
    value: function GroupSetRGB(GroupNr, Red, Green, Blue, Transitiontime) {
      var HueAngSatBri = Huepi.HelperRGBtoHueAngSatBri(Red, Green, Blue);

      return this.GroupSetHueAngSatBri(GroupNr, HueAngSatBri.Ang, HueAngSatBri.Sat, HueAngSatBri.Bri, Transitiontime);
    }

    /**
     * @param {number} GroupNr
     * @param {number} CT micro reciprocal degree
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetCT',
    value: function GroupSetCT(GroupNr, CT, Transitiontime) {
      var Lights = [];

      GroupNr = this.GroupGetId(GroupNr);
      if (GroupNr === '0') {
        // All Lights
        Lights = this.LightIds;
      } else {
        Lights = this.Groups[GroupNr].lights;
      }

      if (Lights.length !== 0) {
        var deferreds = [];

        for (var LightNr = 0; LightNr < Lights.length; LightNr++) {
          deferreds.push(this.LightSetCT(Lights[LightNr], CT, Transitiontime));
        }
        return Promise.all(deferreds); // return Deferred when with array of deferreds
      }
      // No Lights in Group GroupNr, Set State of Group to let Bridge create the API Error and return it.
      var State = void 0;

      State = new HuepiLightstate();
      State.SetCT(CT);
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param {number} Colortemperature Range [2200..6500] for the 2012 model
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetColortemperature',
    value: function GroupSetColortemperature(GroupNr, Colortemperature, Transitiontime) {
      return this.GroupSetCT(GroupNr, Huepi.HelperColortemperaturetoCT(Colortemperature), Transitiontime);
    }

    /**
     * @param {number} GroupNr
     * @param {float} X
     * @param {float} Y
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupSetXY',
    value: function GroupSetXY(GroupNr, X, Y, Transitiontime) {
      var Lights = [];

      GroupNr = this.GroupGetId(GroupNr);
      if (GroupNr === '0') {
        // All Lights
        Lights = this.LightIds;
      } else {
        Lights = this.Groups[GroupNr].lights;
      }

      if (Lights.length !== 0) {
        var deferreds = [];

        for (var LightNr = 0; LightNr < Lights.length; LightNr++) {
          deferreds.push(this.LightSetXY(Lights[LightNr], X, Y, Transitiontime));
        }
        return Promise.all(deferreds); // return Deferred when with array of deferreds
      }
      // No Lights in Group GroupNr, Set State of Group to let Bridge create the API Error and return it.
      var State = void 0;

      State = new HuepiLightstate();
      State.SetXY(X, Y);
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupAlertSelect',
    value: function GroupAlertSelect(GroupNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.AlertSelect();
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupAlertLSelect',
    value: function GroupAlertLSelect(GroupNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.AlertLSelect();
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupAlertNone',
    value: function GroupAlertNone(GroupNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.AlertNone();
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupEffectColorloop',
    value: function GroupEffectColorloop(GroupNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.EffectColorloop();
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    /**
     * @param {number} GroupNr
     * @param {number} Transitiontime optional
     */

  }, {
    key: 'GroupEffectNone',
    value: function GroupEffectNone(GroupNr, Transitiontime) {
      var State = void 0;

      State = new HuepiLightstate();
      State.EffectNone();
      State.SetTransitiontime(Transitiontime);
      return this.GroupSetState(GroupNr, State);
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    // Schedule Functions
    //
    //

    /**
     */

  }, {
    key: 'SchedulesGetData',
    value: function SchedulesGetData() {
      var _this12 = this;

      // GET /api/username/schedules
      return new Promise(function (resolve, reject) {
        fetch('http://' + _this12.BridgeIP + '/api/' + _this12.Username + '/schedules').then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data) {
            _this12.Schedules = data;
            resolve(data);
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    // Scenes Functions
    //
    //

    /**
     */

  }, {
    key: 'ScenesGetData',
    value: function ScenesGetData() {
      var _this13 = this;

      // GET /api/username/scenes
      return new Promise(function (resolve, reject) {
        fetch('http://' + _this13.BridgeIP + '/api/' + _this13.Username + '/scenes').then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data) {
            _this13.Scenes = data;
            resolve(data);
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    // Sensors Functions
    //
    //

    /**
     */

  }, {
    key: 'SensorsGetData',
    value: function SensorsGetData() {
      var _this14 = this;

      // GET /api/username/sensors
      return new Promise(function (resolve, reject) {
        fetch('http://' + _this14.BridgeIP + '/api/' + _this14.Username + '/sensors').then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data) {
            _this14.Sensors = data;
            resolve(data);
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }

    // //////////////////////////////////////////////////////////////////////////////
    //
    // Rules Functions
    //
    //

    /**
     */

  }, {
    key: 'RulesGetData',
    value: function RulesGetData() {
      var _this15 = this;

      // GET /api/username/rules
      return new Promise(function (resolve, reject) {
        fetch('http://' + _this15.BridgeIP + '/api/' + _this15.Username + '/rules').then(function (response) {
          return response.json();
        }).then(function (data) {
          if (data) {
            _this15.Rules = data;
            resolve(data);
          } else {
            reject(data);
          }
        }).catch(function (message) {
          // fetch failed
          reject(message);
        });
      });
    }
  }], [{
    key: 'HelperModelCapableCT',
    value: function HelperModelCapableCT(Model) {
      // CT Capable	LCT* LLM* LTW* LLC020 LST002
      var ModelType = Model.slice(0, 3);

      return ModelType === 'LCT' || ModelType === 'LLM' || ModelType === 'LTW' || Model === 'LLC020' || Model === 'LST002';
    }

    /**
    * @param {string} Model
    * @returns {boolean} Model is capable of XY
    */

  }, {
    key: 'HelperModelCapableXY',
    value: function HelperModelCapableXY(Model) {
      // XY Capable	LCT* LLC* LST* LLM001 LLC020 LST002
      var ModelType = Model.slice(0, 3);

      return ModelType === 'LCT' || ModelType === 'LLC' || ModelType === 'LST' || Model === 'LLM001' || Model === 'LLC020' || Model === 'LST002';
    }

    /**
     * @param {float} Red - Range [0..1]
     * @param {float} Green - Range [0..1]
     * @param {float} Blue - Range [0..1]
     * @returns {object} [Ang, Sat, Bri] - Ranges [0..360] [0..1] [0..1]
     */

  }, {
    key: 'HelperRGBtoHueAngSatBri',
    value: function HelperRGBtoHueAngSatBri(Red, Green, Blue) {
      var Ang = void 0,
          Sat = void 0,
          Bri = void 0;
      var Min = Math.min(Red, Green, Blue);
      var Max = Math.max(Red, Green, Blue);

      if (Min !== Max) {
        if (Red === Max) {
          Ang = (0 + (Green - Blue) / (Max - Min)) * 60;
        } else if (Green === Max) {
          Ang = (2 + (Blue - Red) / (Max - Min)) * 60;
        } else {
          Ang = (4 + (Red - Green) / (Max - Min)) * 60;
        }
        Sat = (Max - Min) / Max;
        Bri = Max;
      } else {
        // Max === Min
        Ang = 0;
        Sat = 0;
        Bri = Max;
      }
      return { Ang: Ang, Sat: Sat, Bri: Bri };
    }

    /**
     * @param {float} Ang - Range [0..360]
     * @param {float} Sat - Range [0..1]
     * @param {float} Bri - Range [0..1]
     * @returns {object} [Red, Green, Blue] - Ranges [0..1] [0..1] [0..1]
     */

  }, {
    key: 'HelperHueAngSatBritoRGB',
    value: function HelperHueAngSatBritoRGB(Ang, Sat, Bri) {
      // Range 360, 1, 1, return .Red, .Green, .Blue
      var Red = void 0,
          Green = void 0,
          Blue = void 0;

      if (Sat === 0) {
        Red = Bri;
        Green = Bri;
        Blue = Bri;
      } else {
        var Sector = Math.floor(Ang / 60) % 6;
        var Fraction = Ang / 60 - Sector;
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
          default:
            // case 5:
            Red = Bri;
            Green = p;
            Blue = q;
            break;
        }
      }
      return { Red: Red, Green: Green, Blue: Blue };
    }

    /**
     * @param {float} Red - Range [0..1]
     * @param {float} Green - Range [0..1]
     * @param {float} Blue - Range [0..1]
     * @returns {number} Temperature ranges [2200..6500]
     */

  }, {
    key: 'HelperRGBtoColortemperature',
    value: function HelperRGBtoColortemperature(Red, Green, Blue) {
      // Approximation from https://github.com/neilbartlett/color-temperature/blob/master/index.js
      var Temperature = void 0;
      var TestRGB = void 0;
      var Epsilon = 0.4;
      var MinTemperature = 2200;
      var MaxTemperature = 6500;

      while (MaxTemperature - MinTemperature > Epsilon) {
        Temperature = (MaxTemperature + MinTemperature) / 2;
        TestRGB = Huepi.HelperColortemperaturetoRGB(Temperature);
        if (TestRGB.Blue / TestRGB.Red >= Blue / Red) {
          MaxTemperature = Temperature;
        } else {
          MinTemperature = Temperature;
        }
      }
      return Math.round(Temperature);
    }

    /**
     * @param {number} Temperature ranges [1000..6600]
     * @returns {object} [Red, Green, Blue] ranges [0..1] [0..1] [0..1]
     */

  }, {
    key: 'HelperColortemperaturetoRGB',
    value: function HelperColortemperaturetoRGB(Temperature) {
      // http://www.tannerhelland.com/4435/convert-temperature-rgb-algorithm-code/
      // Update Available: https://github.com/neilbartlett/color-temperature/blob/master/index.js
      var Red = void 0,
          Green = void 0,
          Blue = void 0;

      Temperature = Temperature / 100;
      if (Temperature <= 66) {
        Red = /* 255; */165 + 90 * (Temperature / 66);
      } else {
        Red = Temperature - 60;
        Red = 329.698727466 * Math.pow(Red, -0.1332047592);
        if (Red < 0) {
          Red = 0;
        }
        if (Red > 255) {
          Red = 255;
        }
      }
      if (Temperature <= 66) {
        Green = Temperature;
        Green = 99.4708025861 * Math.log(Green) - 161.1195681661;
        if (Green < 0) {
          Green = 0;
        }
        if (Green > 255) {
          Green = 255;
        }
      } else {
        Green = Temperature - 60;
        Green = 288.1221695283 * Math.pow(Green, -0.0755148492);
        if (Green < 0) {
          Green = 0;
        }
        if (Green > 255) {
          Green = 255;
        }
      }
      if (Temperature >= 66) {
        Blue = 255;
      } else {
        if (Temperature <= 19) {
          Blue = 0;
        } else {
          Blue = Temperature - 10;
          Blue = 138.5177312231 * Math.log(Blue) - 305.0447927307;
          if (Blue < 0) {
            Blue = 0;
          }
          if (Blue > 255) {
            Blue = 255;
          }
        }
      }
      return { Red: Red / 255, Green: Green / 255, Blue: Blue / 255 };
    }

    /**
     * @param {float} Red - Range [0..1]
     * @param {float} Green - Range [0..1]
     * @param {float} Blue - Range [0..1]
     * @returns {object} [x, y] - Ranges [0..1] [0..1]
     */

  }, {
    key: 'HelperRGBtoXY',
    value: function HelperRGBtoXY(Red, Green, Blue) {
      // Source: https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/blob/master/
      // ApplicationDesignNotes/RGB%20to%20xy%20Color%20conversion.md
      // Apply gamma correction
      if (Red > 0.04045) {
        Red = Math.pow((Red + 0.055) / 1.055, 2.4);
      } else {
        Red = Red / 12.92;
      }
      if (Green > 0.04045) {
        Green = Math.pow((Green + 0.055) / 1.055, 2.4);
      } else {
        Green = Green / 12.92;
      }
      if (Blue > 0.04045) {
        Blue = Math.pow((Blue + 0.055) / 1.055, 2.4);
      } else {
        Blue = Blue / 12.92;
      }
      // RGB to XYZ [M] for Wide RGB D65, http://www.developers.meethue.com/documentation/color-conversions-rgb-xy
      var X = Red * 0.664511 + Green * 0.154324 + Blue * 0.162028;
      var Y = Red * 0.283881 + Green * 0.668433 + Blue * 0.047685;
      var Z = Red * 0.000088 + Green * 0.072310 + Blue * 0.986039;

      // But we don't want Capital X,Y,Z you want lowercase [x,y] (called the color point) as per:
      if (X + Y + Z === 0) {
        return { x: 0, y: 0 };
      }
      return { x: X / (X + Y + Z), y: Y / (X + Y + Z) };
    }

    /**
     * @param {float} x
     * @param {float} y
     * @param {float} Brightness Optional
     * @returns {object} [Red, Green, Blue] - Ranges [0..1] [0..1] [0..1]
     */

  }, {
    key: 'HelperXYtoRGB',
    value: function HelperXYtoRGB(x, y, Brightness) {
      // Source: https://github.com/PhilipsHue/PhilipsHueSDK-iOS-OSX/blob/master/
      // ApplicationDesignNotes/RGB%20to%20xy%20Color%20conversion.md
      Brightness = Brightness || 1.0; // Default full brightness
      var z = 1.0 - x - y;
      var Y = Brightness;
      var X = Y / y * x;
      var Z = Y / y * z;
      // XYZ to RGB [M]-1 for Wide RGB D65, http://www.developers.meethue.com/documentation/color-conversions-rgb-xy
      var Red = X * 1.656492 - Y * 0.354851 - Z * 0.255038;
      var Green = -X * 0.707196 + Y * 1.655397 + Z * 0.036152;
      var Blue = X * 0.051713 - Y * 0.121364 + Z * 1.011530;

      // Limit RGB on [0..1]
      if (Red > Blue && Red > Green && Red > 1.0) {
        // Red is too big
        Green = Green / Red;
        Blue = Blue / Red;
        Red = 1.0;
      }
      if (Red < 0) {
        Red = 0;
      }
      if (Green > Blue && Green > Red && Green > 1.0) {
        // Green is too big
        Red = Red / Green;
        Blue = Blue / Green;
        Green = 1.0;
      }
      if (Green < 0) {
        Green = 0;
      }
      if (Blue > Red && Blue > Green && Blue > 1.0) {
        // Blue is too big
        Red = Red / Blue;
        Green = Green / Blue;
        Blue = 1.0;
      }
      if (Blue < 0) {
        Blue = 0;
      }
      // Apply reverse gamma correction
      if (Red <= 0.0031308) {
        Red = Red * 12.92;
      } else {
        Red = 1.055 * Math.pow(Red, 1.0 / 2.4) - 0.055;
      }
      if (Green <= 0.0031308) {
        Green = Green * 12.92;
      } else {
        Green = 1.055 * Math.pow(Green, 1.0 / 2.4) - 0.055;
      }
      if (Blue <= 0.0031308) {
        Blue = Blue * 12.92;
      } else {
        Blue = 1.055 * Math.pow(Blue, 1.0 / 2.4) - 0.055;
      }
      // Limit RGB on [0..1]
      if (Red > Blue && Red > Green && Red > 1.0) {
        // Red is too big
        Green = Green / Red;
        Blue = Blue / Red;
        Red = 1.0;
      }
      if (Red < 0) {
        Red = 0;
      }
      if (Green > Blue && Green > Red && Green > 1.0) {
        // Green is too big
        Red = Red / Green;
        Blue = Blue / Green;
        Green = 1.0;
      }
      if (Green < 0) {
        Green = 0;
      }
      if (Blue > Red && Blue > Green && Blue > 1.0) {
        // Blue is too big
        Red = Red / Blue;
        Green = Green / Blue;
        Blue = 1.0;
      }
      if (Blue < 0) {
        Blue = 0;
      }
      return { Red: Red, Green: Green, Blue: Blue };
    }

    /**
     * @param {float} x
     * @param {float} y
     * @param {float} Brightness Optional
     * @param {string} Model - Modelname of the Light
     * @returns {object} [Red, Green, Blue] - Ranges [0..1] [0..1] [0..1]
     */

  }, {
    key: 'HelperXYtoRGBforModel',
    value: function HelperXYtoRGBforModel(x, y, Brightness, Model) {
      var GamutCorrected = Huepi.HelperGamutXYforModel(x, y, Model);

      return Huepi.HelperXYtoRGB(GamutCorrected.x, GamutCorrected.y, Brightness);
    }

    /**
     * Tests if the Px,Py resides within the Gamut for the model.
     * Otherwise it will calculated the closesed point on the Gamut.
     * @param {float} Px - Range [0..1]
     * @param {float} Py - Range [0..1]
     * @param {string} Model - Modelname of the Light to Gamutcorrect Px, Py for
     * @returns {object} [x, y] - Ranges [0..1] [0..1]
     */

  }, {
    key: 'HelperGamutXYforModel',
    value: function HelperGamutXYforModel(Px, Py, Model) {
      // https://developers.meethue.com/documentation/supported-lights
      Model = Model || 'LCT001'; // default hue Bulb 2012
      var ModelType = Model.slice(0, 3);
      var PRed = void 0,
          PGreen = void 0,
          PBlue = void 0;
      var NormDot = void 0;

      if ((ModelType === 'LST' || ModelType === 'LLC') && Model !== 'LLC020' && Model !== 'LLC002' && Model !== 'LST002') {
        // For LivingColors Bloom, Aura and Iris etc the triangle corners are:
        PRed = { x: 0.704, y: 0.296 }; // Gamut A
        PGreen = { x: 0.2151, y: 0.7106 };
        PBlue = { x: 0.138, y: 0.080 };
      } else if ((ModelType === 'LCT' || ModelType === 'LLM') && Model !== 'LCT010' && Model !== 'LCT014' && Model !== 'LCT011' && Model !== 'LCT012') {
        // For the hue bulb and beyond led modules etc the corners of the triangle are:
        PRed = { x: 0.675, y: 0.322 }; // Gamut B
        PGreen = { x: 0.409, y: 0.518 };
        PBlue = { x: 0.167, y: 0.040 };
      } else {
        // Exceptions and Unknown default to
        PRed = { x: 0.692, y: 0.308 }; // Gamut C
        PGreen = { x: 0.17, y: 0.7 };
        PBlue = { x: 0.153, y: 0.048 };
      }

      var VBR = { x: PRed.x - PBlue.x, y: PRed.y - PBlue.y }; // Blue to Red
      var VRG = { x: PGreen.x - PRed.x, y: PGreen.y - PRed.y }; // Red to Green
      var VGB = { x: PBlue.x - PGreen.x, y: PBlue.y - PGreen.y }; // Green to Blue

      var GBR = (PGreen.x - PBlue.x) * VBR.y - (PGreen.y - PBlue.y) * VBR.x; // Sign Green on Blue to Red
      var BRG = (PBlue.x - PRed.x) * VRG.y - (PBlue.y - PRed.y) * VRG.x; // Sign Blue on Red to Green
      var RGB = (PRed.x - PGreen.x) * VGB.y - (PRed.y - PGreen.y) * VGB.x; // Sign Red on Green to Blue

      var VBP = { x: Px - PBlue.x, y: Py - PBlue.y }; // Blue to Point
      var VRP = { x: Px - PRed.x, y: Py - PRed.y }; // Red to Point
      var VGP = { x: Px - PGreen.x, y: Py - PGreen.y }; // Green to Point

      var PBR = VBP.x * VBR.y - VBP.y * VBR.x; // Sign Point on Blue to Red
      var PRG = VRP.x * VRG.y - VRP.y * VRG.x; // Sign Point on Red to Green
      var PGB = VGP.x * VGB.y - VGP.y * VGB.x; // Sign Point on Green to Blue

      if (GBR * PBR >= 0 && BRG * PRG >= 0 && RGB * PGB >= 0) {
        // All Signs Match so Px,Py must be in triangle
        return { x: Px, y: Py };
        //  Outside Triangle, Find Closesed point on Edge or Pick Vertice...
      } else if (GBR * PBR <= 0) {
        // Outside Blue to Red
        NormDot = (VBP.x * VBR.x + VBP.y * VBR.y) / (VBR.x * VBR.x + VBR.y * VBR.y);
        if (NormDot >= 0.0 && NormDot <= 1.0) {
          // Within Edge
          return { x: PBlue.x + NormDot * VBR.x, y: PBlue.y + NormDot * VBR.y };
        } else if (NormDot < 0.0) {
          // Outside Edge, Pick Vertice
          return { x: PBlue.x, y: PBlue.y }; // Start
        }
        return { x: PRed.x, y: PRed.y }; // End
      } else if (BRG * PRG <= 0) {
        // Outside Red to Green
        NormDot = (VRP.x * VRG.x + VRP.y * VRG.y) / (VRG.x * VRG.x + VRG.y * VRG.y);
        if (NormDot >= 0.0 && NormDot <= 1.0) {
          // Within Edge
          return { x: PRed.x + NormDot * VRG.x, y: PRed.y + NormDot * VRG.y };
        } else if (NormDot < 0.0) {
          // Outside Edge, Pick Vertice
          return { x: PRed.x, y: PRed.y }; // Start
        }
        return { x: PGreen.x, y: PGreen.y }; // End
      } else if (RGB * PGB <= 0) {
        // Outside Green to Blue
        NormDot = (VGP.x * VGB.x + VGP.y * VGB.y) / (VGB.x * VGB.x + VGB.y * VGB.y);
        if (NormDot >= 0.0 && NormDot <= 1.0) {
          // Within Edge
          return { x: PGreen.x + NormDot * VGB.x, y: PGreen.y + NormDot * VGB.y };
        } else if (NormDot < 0.0) {
          // Outside Edge, Pick Vertice
          return { x: PGreen.x, y: PGreen.y }; // Start
        }
        return { x: PBlue.x, y: PBlue.y }; // End
      }
      return { x: 0.5, y: 0.5 }; // Silence return warning
    }

    /**
     * @param {float} Ang - Range [0..360]
     * @param {float} Sat - Range [0..1]
     * @param {float} Bri - Range [0..1]
     * @returns {number} Temperature ranges [2200..6500]
     */

  }, {
    key: 'HelperHueAngSatBritoColortemperature',
    value: function HelperHueAngSatBritoColortemperature(Ang, Sat, Bri) {
      var RGB = void 0;

      RGB = Huepi.HelperHueAngSatBritoRGB(Ang, Sat, Bri);
      return Huepi.HelperRGBtoColortemperature(RGB.Red, RGB.Green, RGB.Blue);
    }

    /**
     * @param {number} Temperature ranges [1000..6600]
     * @returns {object} [Ang, Sat, Bri] - Ranges [0..360] [0..1] [0..1]
     */

  }, {
    key: 'HelperColortemperaturetoHueAngSatBri',
    value: function HelperColortemperaturetoHueAngSatBri(Temperature) {
      var RGB = void 0;

      RGB = Huepi.HelperColortemperaturetoRGB(Temperature);
      return Huepi.HelperRGBtoHueAngSatBri(RGB.Red, RGB.Green, RGB.Blue);
    }

    /**
     * @param {float} x
     * @param {float} y
     * @param {float} Brightness Optional
     * @returns {number} Temperature ranges [1000..6600]
     */

  }, {
    key: 'HelperXYtoColortemperature',
    value: function HelperXYtoColortemperature(x, y, Brightness) {
      var RGB = void 0;

      RGB = Huepi.HelperXYtoRGB(x, y, Brightness);
      return Huepi.HelperRGBtoColortemperature(RGB.Red, RGB.Green, RGB.Blue);
    }

    /**
     * @param {number} Temperature ranges [1000..6600]
     * @returns {object} [x, y] - Ranges [0..1] [0..1]
     */

  }, {
    key: 'HelperColortemperaturetoXY',
    value: function HelperColortemperaturetoXY(Temperature) {
      var RGB = void 0;

      RGB = Huepi.HelperColortemperaturetoRGB(Temperature);
      return Huepi.HelperRGBtoXY(RGB.Red, RGB.Green, RGB.Blue);
    }

    /**
     * @param {number} CT in Mired (micro reciprocal degree)
     * @returns {number} ColorTemperature
     */

  }, {
    key: 'HelperCTtoColortemperature',
    value: function HelperCTtoColortemperature(CT) {
      return Math.round(1000000 / CT);
    }

    /**
     * @param {number} ColorTemperature
     * @returns {number} CT in Mired (micro reciprocal degree)
     */

  }, {
    key: 'HelperColortemperaturetoCT',
    value: function HelperColortemperaturetoCT(Temperature) {
      return Math.round(1000000 / Temperature);
    }

    /**
     * @param {multiple} Items - Items to convert to StringArray
     * @returns {string} String array containing Items
     */

  }, {
    key: 'HelperToStringArray',
    value: function HelperToStringArray(Items) {
      if (typeof Items === 'number') {
        return '"' + Items.toString() + '"';
      } else if (Object.prototype.toString.call(Items) === '[object Array]') {
        var Result = '[';

        for (var ItemNr = 0; ItemNr < Items.length; ItemNr++) {
          Result += Huepi.HelperToStringArray(Items[ItemNr]);
          if (ItemNr < Items.length - 1) {
            Result += ',';
          }
        }
        Result = Result + ']';
        return Result;
      } // else if (typeof Items === 'string') {
      return '"' + Items + '"';
    }
  }]);

  return Huepi;
}();

module.exports = module.exports.default = Huepi;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HuepiLightState = exports.Huepi = undefined;

var _huepilightstate = __webpack_require__(0);

var _huepilightstate2 = _interopRequireDefault(_huepilightstate);

var _huepi = __webpack_require__(1);

var _huepi2 = _interopRequireDefault(_huepi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Huepi = _huepi2.default;
exports.HuepiLightState = _huepilightstate2.default;

/***/ })
/******/ ]);
});
//# sourceMappingURL=huepi.js.map