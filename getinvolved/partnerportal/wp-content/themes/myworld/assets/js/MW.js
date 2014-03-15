/*My World API*/

var MW = window.MW || {};

MW.api = (function() {

    /*Private Properties*/

    var host_url = "";
    var api_url = "http://api.myworld2015.org/easyxdm/cors/";
    var api_method_matrix = {
        "submitVote": "/api/create",
        "updateVote": "/api/update",
        "sendContactForm": "/sendContactForm"
    };

    var active_record_id = '';

    /*Private Methods*/

    function makeCall(method, method_type, parameters, successFn) {
        var xhr = new easyXDM.Rpc({
            remote: api_url
        }, {
            remote: {
                request: {}
            }
        });

        xhr.request({
            url: api_method_matrix[method],
            method: method_type,
            data: parameters
        }, successFn);
    }

    return {

        /*Public Properties*/

        /*Public Methods*/

        getHostURL: function() {
            return host_url;
        },

        setActiveRecordId: function(record_id) {
            active_record_id = record_id;
        },

        getActiveRecordId: function() {
            return active_record_id;
        },

        submitVote: function(choices_array, gender, age, country, language, priority, timezoneOffset, education, partner, url_parameters , referralBallotId, successFn) {
            var parameters = {
                choices: choices_array,
                gender: gender,
                age: age,
                country: country,
                language: language,
                suggested_priority: priority,
                timezoneOffset: timezoneOffset,
                sourceMethod:'website',
                education: education,
                partner: partner,
                url_parameters: url_parameters,
                referralBallotId: referralBallotId
            };
            makeCall('submitVote', "POST", parameters, successFn);
        },

        updateVote: function(vote_id, vote_reason, full_name, email, successFn) {
            var parameters = {
                vote_id: vote_id,
                vote_reason: vote_reason,
                full_name: full_name,
                email: email
            };
            makeCall('updateVote', "POST", parameters, successFn);
        },

        sendContactForm: function(name, email, organization, message, challenge, user_response, successFn) {
            var parameters = {
                name: name,
                email: email,
                organization: organization,
                message: message,
                challenge: challenge,
                user_response: user_response
            };
            makeCall('sendContactForm', "POST", parameters, successFn);
        }
    };

})();