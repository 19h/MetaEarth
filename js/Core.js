var SqazLocation = {};

(function (Init) { // Extend the CoreClass (above).
        SqazLocation.Storage = {
                InitCache: []
        };

        SqazLocation.Functions = {
                /*
                 *      Calculate distance between METRICAL coordinates on a simplified grid of the earth.
                 *      The average value taken is the radius of the equator in a simplified manner.
                 *      This is not representive - it is rather to predict the existence of similar "clients" in a radius r
                 *      with the parameters l1, l2, whereas l1 is the client_A and l2 is the client_B.
                 *
                 *      This can be used as BACKEND (NodeJS, see implementation - "math on request", a standalone server is recommended)
                 *      or 
                 *
                 */
                getDistance: function (l1, l2) {
                        var a = Math.sin((lat2 - lat1).toRad() / 2) * Math.sin((lat2 - lat1).toRad() / 2) + Math.sin((lon2 - lon1).toRad() / 2) * Math.sin((lon2 - lon1).toRad() / 2) * Math.cos(lat1.toRad()) * Math.cos(lat2.toRad());
                        return 6378.1370 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); //getDistance.
                }
        }

        SqazLocation.Init = function (f) {
                if (typeof f !== "function") return function () {
                        for (i = 0, v = SqazLocation.Storage.InitCache.push(function(){}); i <= v - 2; ++i)
                                console.log(SqazLocation.Storage.InitCache[i]());
                };
                else return SqazLocation.Storage.InitCache.push(f);
        }

        Init();
})(function () {
        SqazLocation.Init((function () {
                if (!window.google || !google.gears) {
                        var a = null;
                        if (typeof GearsFactory != "undefined") a = new GearsFactory;
                        else try {
                                a = new ActiveXObject("Gears.Factory"), a.getBuildInfo().indexOf("ie_mobile") != -1 && a.privateSetGlobalObject(this)
                        } catch (b) {
                                if (typeof navigator.mimeTypes != "undefined" && navigator.mimeTypes["application/x-googlegears"]) a = document.createElement("object"), a.style.display = "none", a.width = 0, a.height = 0, a.type = "application/x-googlegears", document.documentElement.appendChild(a), a && typeof a.create == "undefined" && (a = null)
                        }
                        if (a && (window.google || (google = {}), !google.gears)) google.gears = {
                                factory: a
                        }
                }
        }));
        SqazLocation.Init(function () {
                window.bb_success, window.bb_error, window.bb_blackberryTimeout_id = -1;

                window.handleBlackBerryLocationTimeout = function () {
                        bb_blackberryTimeout_id != -1 && bb_error({
                                message: "Timeout error",
                                code: 3
                        })
                }

                window.handleBlackBerryLocation = function () {
                        clearTimeout(bb_blackberryTimeout_id);
                        bb_blackberryTimeout_id = -1;
                        if (bb_success && bb_error) {
                                if (blackberry.location.latitude == 0 && blackberry.location.longitude == 0) bb_error({
                                        message: "Position unavailable",
                                        code: 2
                                });
                                else {
                                        var a = null;
                                        blackberry.location.timestamp && (a = new Date(blackberry.location.timestamp));
                                        bb_success({
                                                timestamp: a,
                                                coords: {
                                                        latitude: blackberry.location.latitude,
                                                        longitude: blackberry.location.longitude
                                                }
                                        })
                                }
                                bb_error = bb_success = null
                        }
                }
                window.geo_position_js = function () {
                        var a = {},
                                c = null;
                        a.showMap = function (a, f) {
                                typeof blackberry != "undefined" ? blackberry.launch.newMap({
                                        latitude: a * 1E5,
                                        longitude: -f * 1E5
                                }) : window.location = "http://maps.google.com/maps?q=loc:" + a + "," + f
                        };
                        a.getCurrentPosition = function (a, f, e) {
                                c.getCurrentPosition(a, f, e)
                        };
                        a.init = function () {
                                try {
                                        if (typeof geo_position_js_simulator != "undefined") c = geo_position_js_simulator;
                                        else if (typeof bondi != "undefined" && typeof bondi.geolocation != "undefined") c = bondi.geolocation;
                                        else if (typeof navigator.geolocation != "undefined") c = navigator.geolocation, a.getCurrentPosition = function (a, e, d) {
                                                c.getCurrentPosition(function (b) {
                                                        typeof b.latitude != "undefined" ? a({
                                                                timestamp: b.timestamp,
                                                                coords: {
                                                                        latitude: b.latitude,
                                                                        longitude: b.longitude
                                                                }
                                                        }) : a(b)
                                                }, e, d)
                                        };
                                        else if (typeof window.blackberry != "undefined" && blackberry.location.GPSSupported) {
                                                if (typeof blackberry.location.setAidMode == "undefined") return !1;
                                                blackberry.location.setAidMode(2);
                                                a.getCurrentPosition = function (a, e, d) {
                                                        bb_success = a;
                                                        bb_error = e;
                                                        bb_blackberryTimeout_id = d.timeout ? setTimeout("handleBlackBerryLocationTimeout()", d.timeout) : setTimeout("handleBlackBerryLocationTimeout()", 6E4);
                                                        blackberry.location.onLocationUpdate("handleBlackBerryLocation()");
                                                        blackberry.location.refreshLocation()
                                                };
                                                c = blackberry.location
                                        } else if (typeof window.google != "undefined" && typeof google.gears != "undefined") c = google.gears.factory.create("beta.geolocation"), a.getCurrentPosition = function (a, e, d) {
                                                c.getCurrentPosition(function (b) {
                                                        typeof b.latitude != "undefined" ? a({
                                                                timestamp: b.timestamp,
                                                                coords: {
                                                                        latitude: b.latitude,
                                                                        longitude: b.longitude
                                                                }
                                                        }) : a(b)
                                                }, e, d)
                                        };
                                        else if (typeof Mojo != "undefined" && typeof Mojo.Service.Request != "Mojo.Service.Request") c = !0, a.getCurrentPosition = function (a, e, d) {
                                                parameters = {};
                                                if (d) {
                                                        if (d.enableHighAccuracy && d.enableHighAccuracy == !0) parameters.accuracy = 1;
                                                        if (d.maximumAge) parameters.maximumAge = d.maximumAge;
                                                        if (d.responseTime) d.responseTime < 5 ? parameters.responseTime = 1 : d.responseTime < 20 ? parameters.responseTime = 2 : parameters.timeout = 3
                                                }
                                                r = new Mojo.Service.Request("palm://com.palm.location", {
                                                        method: "getCurrentPosition",
                                                        parameters: parameters,
                                                        onSuccess: function (b) {
                                                                a({
                                                                        timestamp: b.timestamp,
                                                                        coords: {
                                                                                latitude: b.latitude,
                                                                                longitude: b.longitude,
                                                                                heading: b.heading
                                                                        }
                                                                })
                                                        },
                                                        onFailure: function (a) {
                                                                a.errorCode == 1 ? e({
                                                                        code: 3,
                                                                        message: "Timeout"
                                                                }) : a.errorCode == 2 ? e({
                                                                        code: 2,
                                                                        message: "Position unavailable"
                                                                }) : e({
                                                                        code: 0,
                                                                        message: "Unknown Error: webOS-code" + errorCode
                                                                })
                                                        }
                                                })
                                        };
                                        else if (typeof device != "undefined" && typeof device.getServiceObject != "undefined") c = device.getServiceObject("Service.Location", "ILocation"), a.getCurrentPosition = function (a, e) {
                                                c.ILocation.GetLocation({
                                                        LocationInformationClass: "BasicLocationInformation"
                                                }, function (d, b, c) {
                                                        b == 4 ? e({
                                                                message: "Position unavailable",
                                                                code: 2
                                                        }) : a({
                                                                timestamp: null,
                                                                coords: {
                                                                        latitude: c.ReturnValue.Latitude,
                                                                        longitude: c.ReturnValue.Longitude,
                                                                        altitude: c.ReturnValue.Altitude,
                                                                        heading: c.ReturnValue.Heading
                                                                }
                                                        })
                                                })
                                        }
                                } catch (g) {
                                        return typeof console != "undefined" && console.log(g), !1
                                }
                                return c != null
                        };
                        return a
                }();
        });

        SqazLocation.Init(function () {
                var map;
                var markers = [];

                function i(p) {
                        window.p = p;
                        window.map = new google.maps.Map(document.getElementById('map_canvas'), {
                                zoom: 19,
                                draggable: false,
                                center: new google.maps.LatLng(p.coords.latitude, p.coords.longitude),
                                mapTypeId: google.maps.MapTypeId.HYBRID
                        });

                        // IMPLEMENTATION ____ TODO ____ STREETVIEW.
                        //panorama = window.map.getStreetView();
                        //panorama.setPosition(new google.maps.LatLng(p.coords.latitude, p.coords.longitude));
                        //
                        //panorama.setPov({
                        //        heading: 265,
                        //        zoom: 1,
                        //        pitch: 0
                        //});
                        //
                        //panorama.setVisible(true);
                }

                google.maps.event.addDomListener(window, 'load', function () {
                        (geo_position_js.init() ? true : alert("Initialization failed.")) && navigator.geolocation.getCurrentPosition(i, function (e) {
                                try {
                                        console.log(e);
                                } catch (e) {
                                        (e.code === 1) && alert("You have denied the usage of location-data.");
                                }
                        })
                        setTimeout(function () {
                                markers.push(new google.maps.Marker({
                                        position: new google.maps.LatLng(window.p.coords.latitude, window.p.coords.longitude),
                                        map: window.map,
                                        draggable: false,
                                        animation: google.maps.Animation.DROP
                                }))
                        }, 1000);
                });
        });
});

(SqazLocation.Init)()();