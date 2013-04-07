/*
*
* Copyright 2012,
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://www.opensource.org/licenses/mit-license.php
* http://www.opensource.org/licenses/gpl-2.0.php
*
* Date:
* Depends on library: jQuery
*
*/

/* track(options) by default track all
 * Use html data-tracking as data source :
 * like GA data-tracking = "category/action/label/value/non-interaction"
 *
 *
 */
 (function($, window, undefined) {
    "use strict";

    var globalDefaults = {
        logging:         true,
        autostart:       true,
        googleAnalytics: true
    };

    function log() {
        log.history = log.history || [];   // store logs to an array for reference
        log.history.push(arguments);
        if(window.console && globalDefaults.logging){
            console.log( Array.prototype.slice.call(arguments) );
        }
    }

    function getTrackingInfo($el) {
        var tracking = $el.data('tracking');
        if (typeof tracking !== "string") return;
        //
        var trackingArray = tracking.split("/");
        return {
            "gaEvent"         : trackingArray,
            "category"        : trackingArray[0] ,
            "action"          : trackingArray[1] ,
            "label"           : trackingArray[2] ,
            "value"           : trackingArray[3] ,
            "non-interaction" : trackingArray[4]
        };
    }

    function defaultHandler (event) {
        var $event   = $(event.target);
        log(event);
        var tracking = getTrackingInfo($event);
        // Do nothing if there is no specific tracking info in the element
        if (!$.isPlainObject(tracking)) return;
        log(tracking);
        // Use Google Analytics to track the event
        if (globalDefaults.googleAnalytics && _gaq) {
            _gaq.push(tracking.gaEvent);
        }
    }

    var defaults = {
        events : ["click"], // events to track
        handler: defaultHandler
    };

    $.JA = (function(defaults) {

        // Start the tracking
        function track(options) {
            var settings = $.extend({}, defaults, options);
            $.each(settings.events, function (k, eventType) {
                // Use event delegation to document to listen to each event
                // Add custom namespace to events for easy unbinding and
                // categorization
                $(document).on(eventType + '.jAnalytics', settings.selector, settings.handler);
            });
        }

        // Stop all tracking
        function stopTracking(options) {
            var settings = $.extend({}, defaults, options);
            $(document).off('.jAnalytics', settings.selector);
        }

        function init() {
        }

        return {
            track : track,
            history : track,
            stopTracking : stopTracking
        };
    }(defaults));

}(jQuery, window));
