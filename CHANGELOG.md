# huepi ChangeLog

## 1.0.1
* replaced dependency to jsdom 8.x.x for Node.js

## 1.0.0
* replaced dependency from domino 1.x.x to jsdom 3.x.x for Node.js
Due to jQuery using window.setTimeout and setTimeout needed a window to provide these functions. jsdom does, domino doesn’t.
* added ChangeLog

## 0.9.9
* Changed Whitlisting on Bridge as required by Philips as of 1-2-2016
* REMOVED this.BridgeUsernameWhitelisted as this is now implicit on BridgeGetData succes
* Added BridgeGetConfig to retreive BridgeID, Name etc without whitlisting
* Added BridgeCache to store and retreive Usernames by BridgeID
 Including BridgeCache Save & Load Functions

## 0.9.8
* Added LightIds & GroupIds
* Default is still index, which is transformed into Ids when talking to lights
  use Ids (string) in stead of Index (number) to access a specific Id
  this way its transparent and works for both Ids & Indices
* reordered parameters to HelperXYtoRGBforModel = function(x, y, Brightness, Model)
* using updated Philips hue Wide RGB D65, http:www.developers.meethue.com/documentation/color-conversions-rgb-xy
* FIX huepi.prototype.LightSetName 

## 0.9.7
* Using Matrices from RGB to XYZ [M] for sRGB D65 from http:www.brucelindbloom.com/index.html?Eqn_RGB_XYZ_Matrix.html
* renamed This. to self.
* added HelperXYtoRGBforModel
* PortalDiscoverLocalBridges now follows redirects

## 0.9.6
* Renamed HelperCTtoRGB to HelperColortemperaturetoRG
* All Red, Green & Blue arguments ranges to [0..1]

## 0.95
* renamed HUEPI to huepi to be more complient with modules and actual hue product name

## 0.9
* Added detection of NodeJS
* Added WORKING JQuery NodeJS if running on NodeJS
* Added Module Exports for NodeJS on NodeJS

## 0.62
* renamed BridgeGet to BridgeGetData
* renamed GroupGet to GroupsGetData
* renamed LightGet to LightsGetData
* renamed UsernameWhitelisted to BridgeUsernameWhitelisted

## 0.61
* LightSetCT = CT->RGB->XY to ignore Brightness in RGB
* changed " string to ' string

## 0.6
* Changed HUEPI object notation from literal to protoype notation
 to make a bigger difference between static helper methods and object interface
* Group- and Light-SetColortemperature are set via SetCT now
* Added huepi.HelperCTtoRGB to Allow ColorLights to be set with CT as RGB
* GroupSetCT splits group into Light and calls LightSetCT per Light
* LightSetCT looks up lamp Model and sets either CT or RGB based on Model
* Note: Using Lightstate objects are not CT to RGB converted
* PortalBridges[] is renamed to LocalBridges[]

## 0.5
* Implemented Promisses by returning JQuery Promisses (Deffereds)
* Declared local variables where applicable, cleaning up global namespace polution
* Added LightsSearchForNew and LightsGetNew and LightSetName
* Added GroupCreate GroupSetName GroupSetLights GroupSetAttributes GroupDelete
  These need more testing ;-)

## 0.4
* Added Helper functions (refactured from ## 0.3)
* HueAngSatBri HSB RGB for lights and groups are set via SetXY and SetBrightness
* GroupSetXY splits group into Light and calls LightSetXY per Light
* LightSetXY looks up lamp Model and applies Gamut Correction for Model
* Note: Using Lightstate objects are not Gamut Corrected

## 0.3
* HUEPI is now an Object
* Renamed deeper namespaces to top namespace so HUEPI becomes one Object
  e.g. Group.SetOn() -> GroupSetOn()

## 0.21
* Rewrote Gamut Color Correction in Lightstate.SetHSB

## 0.2
* Renamed class Light.State -> Lightstate
* Renamed function Bridge.GetConfig -> Bridge.Get
* Renamed functions Config.* -> Bridge.*
* Added Gamut Color Correction in Lightstate.SetHSB RGB+HSB Settings Will be Color Corrected to HUE Lamp -> xy

## 0.1
* Initial Public Release

