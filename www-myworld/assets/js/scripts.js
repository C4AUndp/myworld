var jsonData = [
];
var current_lang = get_url_parameter('lang');
var host = '';
var my_image_src = '';
var selectedSocialNetwork = 'Facebook';

if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
    $('head').append('<link rel="stylesheet" href="assets/css/layout.css">');
}

var current_lang_url = get_url_parameter('lang');
if(current_lang_url == 'fr') {
    $("html").addClass('fr');
} else if(current_lang_url == 'ar') {
    $("html").addClass('ar');
} else if(current_lang_url == 'es') {
    $("html").addClass('es');
} else if(current_lang_url == 'ch') {
    $("html").addClass('ch');
} else if(current_lang_url == 'ru') {
    $("html").addClass('ru');
} else if(current_lang_url == 'kr') {
    $("html").addClass('kr');
} else if(current_lang_url == 'pr') {
    $("html").addClass('pr');
} else if(current_lang_url == 'th') {
    $("html").addClass('th');
} else if(current_lang_url == 'bi') {
    $("html").addClass('bi');
}else if(current_lang_url=='vt'){
    $("html").addClass('vt');
    $('head').append("<link href='http://fonts.googleapis.com/css?family=Open+Sans:400,300,700&subset=latin,vietnamese' rel='stylesheet' type='text/css'>");
}else if(current_lang_url=='bl'){
    $("html").addClass('bl');
}else if(current_lang_url=='al'){
    $("html").addClass('al');
}else if(current_lang_url=='bs'){
    $("html").addClass('bs');
}else if(current_lang_url=='ct'){
    $("html").addClass('ct');
	
}else if(current_lang_url=='ja'){
    $("html").addClass('ja');
	
}


// Append Partner Mode
var partners_mode = get_url_parameter('partner');
if(partners_mode != 'undefined') {
    $('.langs-list li a, .mobile-langs-list li a').each(function () {
        var _href = $(this).attr("href");
        $(this).attr("href", _href + '&partner=' + partners_mode);
    });

    $('a.logo-img-urls').each(function () {
        var _href = $(this).attr("href");
        $(this).attr("href", _href + '?partner=' + partners_mode);
    });
}


// Append type of Mode in language links and in logos
var current_mode = get_url_parameter('mode');
if(current_mode != 'undefined') {
    $('.langs-list li a, .mobile-langs-list li a').each(function () {
        var _href = $(this).attr("href");
        $(this).attr("href", _href + '&mode=' + current_mode);
    });

    if(partners_mode != 'undefined') {
        $('a.logo-img-urls').each(function () {
            var _href = $(this).attr("href");
            $(this).attr("href", _href + '&mode=' + current_mode);
        });
    }else{
        $('a.logo-img-urls').each(function () {
            var _href = $(this).attr("href");
            $(this).attr("href", _href + '?mode=' + current_mode);
        });
    }
}

// Append Ballot ID in language links anf in Logos
var ballot_refID = get_url_parameter('ballot');
if(ballot_refID != 'undefined') {
    $('.langs-list li a, .mobile-langs-list li a').each(function () {
        var _href = $(this).attr("href");
        $(this).attr("href", _href + '&ballot=' + ballot_refID);
    });

    if(partners_mode != 'undefined' || current_mode != 'undefined') {
        $('a.logo-img-urls').each(function () {
            var _href = $(this).attr("href");
            $(this).attr("href", _href + '&ballot=' + ballot_refID);
        });
    }else{
        $('a.logo-img-urls').each(function () {
            var _href = $(this).attr("href");
            $(this).attr("href", _href + '?ballot=' + ballot_refID);
        });
    }

}


if(/iPad/i.test(navigator.userAgent)) {
    $('html').addClass('ipad');

    if($(window).width() <= 768) {
        $('head').append('<link rel="stylesheet" href="assets/css/layout.css">');
    }
}

$(window).bind('orientationchange', orientation_change);

function orientation_change(){
    if(/iPad/i.test(navigator.userAgent)) {
        if($(window).width() <= 768) {
            $('head').append('<link rel="stylesheet" href="assets/css/layout.css">');
        }

        window.location.reload();
    }
}

if(current_lang == 'undefined') {
    current_lang = 'default';
}

$.getJSON(host + 'assets/langs/' + current_lang + '.json', function (data) {
    var items = data.accordion_items;
    var numbers = [
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16
    ];
    var random_numbers = shuffle(numbers);
    var output = '';

    var i = 0;

    for(i = 0; i<random_numbers.length; i++){
        var accordion_item = items[random_numbers[i]];

        output += '<h3 class="clearfix"> <span class="color-box" style="background-color: '+accordion_item['item-color']+'"> <img class="hover-icon hidden-mobile" src="assets/img/accordion-arrow.png" alt=""> <img class="check-img-mobile" src="assets/icons/check-off-mobile.png" alt=""> </span> <a id="'+accordion_item['prefix']+'-item-title" href="#">'+accordion_item['item-title']+'</a> <span class="check-wrap"> <img class="check-img" src="assets/icons/check-off.png" alt=""> <input type="checkbox" class="check-value" name="check-values[]" value="'+random_numbers[i]+'"> </span> </h3> <article> <p>'+accordion_item['item-content']+'</p> </article>';
    }

    $('.accordion').prepend(output);

    jsonData = data;

    docready();

});

function docready(){

    $(document).ready(function () {

        if($(window).width() > 1000) {
            show_plan_b();
        }

        if(get_url_parameter('page') == 'undefined' && !get_cookie('vote_data')) {
            $('.counters, #teaser-content-b, #timeline-content').fadeIn(500);
        }

        if(get_cookie('my_globe_img') && !get_cookie('vote_data')) {
            $.removeCookie('my_globe_img', {
                path:'/'
            });
            $.removeCookie('voted');
        }


        if(get_cookie('vote_data')) {
            display_ballot_box(JSON.parse($.cookie('vote_data')));

            // GA event tracked
            _gaq.push(['_trackEvent', 'Post-vote Events', 'Page loaded with cookie']);
            
        }

        $('.about-wrap').fadeIn(500);

        Recaptcha.create("6LdeCtoSAAAAANPOp-m2zPqJ0p2Nj2kWc4s0CNji", 'recaptcha_div', {
            theme   :"red",
            callback:Recaptcha.focus_response_field
        });

        var count = 0;
        var language_matrix = {
            'en':'English',
            'es':'Spanish',
            'fr':'French',
            'ru':'Russian',
            'ar':'Arabic',
            'ch':'Chinese',
            'kr':'Korean',
            'pr':'Portuguese',
            'th':'Thai',
            'bi':'Indonesian',
            'vt':'Vietnamese',
            'bl':'Belarus',
            'al':'Albania',
            'bs':'Bisaya',
            'ct':'Catalan',
			'ja':'Japanese'
        };

        var current_lang = get_url_parameter('lang');
        var current_page = get_url_parameter('page');
        var host = MW.api.getHostURL();
        var ballot = get_url_parameter('ballot');
        var vote_data = {};

        if(current_lang == 'ar') {
            align_arabic();
        }

        if(current_lang == 'kr') {
            dropdown_korean_reorder();
        }

        if(current_lang=='en'||current_lang=='undefined'){
            $(".mad-logo").show();
        }

        set_my_globe_img();
        lang_change_social_values();


        //Set Language Selected:
        if(current_lang == 'undefined') {
            $(".langs-list li a[href*='lang=en'], .mobile-langs-list li a[href*='lang=en'] ").addClass('language-selected');
        }else{
            $(".langs-list li a[href*='lang=" + current_lang + "'], .mobile-langs-list li a[href*='lang=" + current_lang + "'] ").addClass('language-selected');
        }

        if(current_page == 'undefined') {
            $('.info-wrap, .vote-wrap, .methodology-wrap, .copyright-wrap, .thank-you-wrap, .policy-wrap, .celebrities-wrap').css('display', 'none');
            $('.vote-wrap, #worldmap, .info-wrap, .celebrity-map').fadeIn(500);

            if(get_cookie('my_globe_img')) {
                //              if (ballot == 'undefined' ) {
                $('.vote-wrap').hide();
                $('#celebrity-modern, .info-wrap').hide();

                // Logic to display Celebrity
                $('.celebrity-map').css('display', 'none');
                //$('.celebrity-only' ).css('display', 'block' );
                //$('.celebrity-only' ).fadeIn(500 );
                // End of Logic to display Celebrity
                $('#worldmap').fadeIn(500);
                $('.thank-you-wrap').fadeIn(500, function (e) {
                    $('html, body').animate({
                        scrollTop: $('.thank-you-wrap').position().top
                    });


                    var my_globe = $.cookie('my_globe_img');

                    //Change FB Custom Image
                    var fb_url = $('#button-5 a').attr('href');
                    var new_fb_url = fb_url.replace('image_path', 'assets/img/globes/' + my_globe);
                    $('#button-5 a').attr('href', new_fb_url);

                    //Change WEIBO custom Image
                    var weibo_url = $('#button-1 a').attr('href');
                    var new_weibo_url = weibo_url.replace('image_path', 'assets/img/globes/' + my_globe);
                    $('#button-1 a').attr('href', new_weibo_url);

                    //Change Orkut custom Image
                    var orkut_url = $('#button-2 a').attr('href');
                    var new_orkut_url = orkut_url.replace('image_path', 'assets/img/globes/' + my_globe);
                    $('#button-2 a').attr('href', new_orkut_url);


                    $('head').append('<meta property="og:image" content="http://www.myworld2015.org/assets/img/globes/' + my_globe + '" />');
                });
                //              } else {
                /*$( '#celebrity-modern' ).hide();
                 $('.ballot-page-vote-wrap' ).show();
                 $('.celebrity-only' ).hide();*/
                //              }
            }else{
                /*if ( ballot == 'undefined' ) {
                 $('#celebrity-modern' ).show();
                 $('.ballot-page-vote-wrap' ).hide();
                 } else {
                 $('#celebrity-modern' ).hide();
                 $('.ballot-page-vote-wrap' ).show();
                 }*/

                // Logic to display which celebrity section to display for Starting page
                var ie8_exist = $(".ie8").length;
                var ie7_exist = $(".ie7").length;

                if(ie8_exist > 0 || ie7_exist > 0) {
                    $('.celebrity-map').css('display', 'none');
                    $('.celebrity-only').css('display', 'block');
                    $('.celebrity-only').fadeIn(500);
                }else{
                    $('.celebrity-map').css('display', 'block');
                    $('.celebrity-only').css('display', 'none');
                    $('.celebrity-map').fadeIn(500);
                }
                // End of Logic to display which celebrity section to display
            }

            if(get_cookie('voted')) {
                $('.thank-you-why').hide();
                $('.thank-you-vote').show();
            }


            //In the case of Ipad in portrait and in mobiles, load the single line version of who else voted:
            if(/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
                $('.celebrity-only').css('display', 'block');
            }

            if(/iPad/i.test(navigator.userAgent)) {
                if($(window).width() <= 768) {
                    $('.celebrity-only').css('display', 'block');
                }
            }


        }else{
            $('.info-wrap, .vote-wrap, .methodology-wrap, .copyright-wrap, .thank-you-wrap, .policy-wrap, .celebrities-wrap, .results-wrap').css('display','none');
            $('.' + current_page + '-wrap').fadeIn(500, function (e) {
                // $('html, body').animate({
                // scrollTop: '150px'
                // });
            });

        }

        add_vote_btn_to_results();
        display_iframe();
        lang_change_html_values();
        lang_create_gender_values();
        lang_create_countries_values();
        lang_create_age_values();
        lang_create_education_values();
        lang_change_various_values();
        lang_create_links_values();
        lang_create_pages_content();
        //build_celebrities_tiles();
        set_viz_image();

        // Manage logo click handler
		$('.index-btn').click(function(e){
			var params = {};
			// e.preventDefault();

			var partner = get_url_parameter("partner");
			params['partner'] = (partner!=='undefined')?partner:'';

			var lang = get_url_parameter("lang");
			params['lang'] = (lang!=='undefined')?lang:'';

			var iframe = get_url_parameter("iframe");
			params['iframe'] = (iframe!=='undefined')?iframe:'';

			var min = get_url_parameter("min");
			params['min'] = (min!=='undefined')?min:'';

			var mode = get_url_parameter("mode");
			params['mode'] = (mode!=='undefined')?mode:'';

			var url_params_string = '';
			var count = 0;
			$.each(params,function(key,value){
				if(value!==''){
					if(count===0){
						url_params_string = url_params_string+'?'+key+'='+value;
					}else{
						url_params_string = url_params_string+'&'+key+'='+value;
					}
					count = count+1;
				}
			});


			// var _href = $(this).attr("href");
			var _href = "index.html";
			$(this).attr("href",_href+url_params_string);
		});


        if($(window).width()<=768){
            mobile_langs_change();

            $('.mobile-toggle-pages-btn').click(function(){
                $('.mobile-pages-dropdown').slideToggle(300,function(){
                    if($(this).is(':hidden')){
                        $('.mobile-toggle-pages-btn').fadeTo(300,1);
                    }else{
                        $('.mobile-toggle-pages-btn').fadeTo(300,0.5);
                    }
                });

                return false;
            });
        }

        set_submit_img();
        validate();

        set_hover_states();

        function is_mobile(){
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        }

        function add_vote_btn_to_results(){
            if(get_url_parameter('page')=='results'){
                $('<section class="results-vote-wrap"><a class="results-vote" id="results-vote" href="index.html"></a></section>').insertBefore('#teaser-content-b');
            }
        }

        function display_iframe(){
            if(get_url_parameter('iframe')=='600'){

                url = 'assets/css/iframe-600.css';
                if (document.createStyleSheet)
                {
                    document.createStyleSheet(url);
                }
                else
                {
                    $('<link rel="stylesheet" type="text/css" href="' + url + '" />').appendTo('head');
                }


				var back_to_voting = '<a id="back-to-voting" href="http://www.myworld2015.org/"></a> ';
				$(back_to_voting).insertBefore('.mobile-langs-wrap');

  //              $('head').append('<link rel="stylesheet" href="assets/css/iframe-600.css">');
                $('<a class="iframe-link" id="iframe-link" href="http://www.myworld2015.org/" target="_blank"></a>').insertBefore('.counters');

                if(get_cookie('vote_data')){
                    $('.vote-wrap').css({display:"none"});
                }


				// Min version
				var is_min = get_url_parameter('min');
				var is_page = get_url_parameter('page');

				if(is_min == 'true') {
					if(is_page == 'undefined') {
						jQuery('#back-to-voting, .top-wrap').css({display:'none'});
						jQuery('.index-btn').css({
							paddingTop:'10px',
							display:'block'
						});
					} else {
						jQuery('#back-to-voting').css({display:'inline-block'});
					}

					jQuery('.mobile-langs-wrap, #methodology-title, #iframe-link, .langs-wrap-select, .langs-wrap').css({
						display:'none'
					});
				} else {
                    if(is_page == 'undefined') {
                        jQuery('#back-to-voting').css({display:'none'});
                    } else {
                        jQuery('#back-to-voting').css({display:'inline-block'});
                    }


					jQuery('.mobile-langs-wrap, #methodology-title, #iframe-link, .langs-wrap-select, .langs-wrap').css({
						display:'inline-block'
					});
				}

                //Iframe link follows URL parameters
                $('#iframe-link, #back-to-voting').bind('click',function(e){
                    var params = {};
                   // e.preventDefault();
					var current_target = e.currentTarget.id;

                    var partner = get_url_parameter("partner");
                    params['partner'] = (partner!=='undefined')?partner:'';

                    var lang = get_url_parameter("lang");
                    params['lang'] = (lang!=='undefined')?lang:'';

					if(current_target == 'back-to-voting') {
						var iframe = get_url_parameter("iframe");
						params['iframe'] = (iframe!=='undefined')?iframe:'';

						var min = get_url_parameter("min");
						params['min'] = (min!=='undefined')?min:'';
					}

					var mode = get_url_parameter("mode");
					params['mode'] = (mode!=='undefined')?mode:'';

                    var url_params_string = '';
                    var count = 0;
                    $.each(params,function(key,value){
                        if(value!==''){
                            if(count===0){
                                url_params_string = url_params_string+'?'+key+'='+value;
                            }else{
                                url_params_string = url_params_string+'&'+key+'='+value;
                            }
                            count = count+1;
                        }
                    });


                    // var _href = $(this).attr("href");
                    var _href = "index.html";
                    $(this).attr("href",_href+ url_params_string);

                });

            }
        }

        function mobile_langs_change(){
            var lang_drop_down = $('.langs-wrap-select');
            lang_drop_down.val(get_url_parameter('lang'));

            set_plan_b_logo();

            // Change lang on selection change
            lang_drop_down.change(function(){

                var partners_mode = get_url_parameter('partner');
                if(partners_mode!='undefined'){
                    page_redirect('partners',partners_mode);
                }

                var current_mode = get_url_parameter('mode');
                if(current_mode!='undefined'){
                    page_redirect('mode',current_mode);
                }

                var ballot_refID = get_url_parameter('ballot');
                if(ballot_refID!='undefined'){
                    page_redirect('ballot',current_mode);
                }

                page_redirect('lang',this.value);
            });
        }

        function set_viz_image(){
            var ie9_exist = $(".ie9").length;
            var ie8_exist = $(".ie8").length;
            var ie7_exist = $(".ie7").length;
            var is_mobile = $(window).width();
            var lang = (current_lang!=='undefined')?current_lang:'en';
            var segments = '';
            var map = '';
            var segments_wrap = $('.segment-wrapper');
            var map_wrap = $('.map-wrapper');

            if(current_page=='results'){
                if(ie9_exist||ie8_exist||ie7_exist||is_mobile<=768){
                    $('.viz-wrapper-results').hide();

                    if(get_cookie('vote_data')){
                        var vote_data = JSON.parse($.cookie('vote_data'));
                        var choices = vote_data['choices'].join();

                        segments = 'http://ec2-23-22-13-62.compute-1.amazonaws.com/render/segments/?country='+vote_data['country']+'&age='+vote_data['age']+'&gender='+vote_data['gender']+'&votes='+choices+'&lang='+lang;
                        map = 'http://ec2-23-22-13-62.compute-1.amazonaws.com/render/map/?country='+vote_data['country']+'&age='+vote_data['age']+'&gender='+vote_data['gender']+'&votes='+choices+'&lang='+lang;

                        //console.log(vote_data['choices']);
                    }else{
                        segments = 'http://ec2-23-22-13-62.compute-1.amazonaws.com/render/segments/?lang='+lang;
                        map = 'http://ec2-23-22-13-62.compute-1.amazonaws.com/render/map/?lang='+lang;

                    }

                    segments_wrap.html('<a id="segments-btn" href="#"><img src="'+segments+'"></a>');
                    map_wrap.html('<a id="map-btn" href="#"><img src="'+map+'"></a>');

                    $('#segments-btn').click(function(){
                        open().document.write('<img src="'+segments+'"/>');
                        return false;
                    });

                    $('#map-btn').click(function(){
                        open().document.write('<img src="'+map+'"/>');
                        return false;
                    });
                }
            }
        }


        //Scroll_to functionality for Vote now
        $("#vote-now-timeline").click(function () {
            $('html, body').animate({
                scrollTop: $(".vote-wrap").offset().top
            }, 1000);
        });

        // get current year
        $('#section-two-date').html((new Date()).getFullYear());
        $('#validation-message').css('display', 'none');

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            if($(window).width() < 520) {
                $('.thank-you-why h3').height(76);
            }
        }else{
            add_hover_states();
        }

        $('.accordion-side-wrap').containedStickyScroll({
            unstick:true,
            queue  :false
        });

        $('#accordion').accordion({
            header     :'h3',
            animated   :'easeInOutQuad',
            clearStyle :true,
            autoHeight :false,
            collapsible:true,
            active     :false
        });

        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
            $('.color-box').click(function (e) {
                $("#accordion").accordion('disable');
            });
        }else{
            $('.color-box').click(function (e) {
                $("#accordion").accordion('enable');
            });
        }

        $('#accordion a, #accordion').click(function (e) {
            $("#accordion").accordion('enable');
        });

        $('.check-wrap').click(function (e) {
            $("#accordion").accordion('disable');
        });

        $('.accordion h3 .check-img').click(function (e) {
            if($(this).closest('h3').find('.check-value').is(':checked')) {
                $(this).closest('h3').find('.check-value').attr('checked', false);
                $(this).attr('src', 'assets/icons/check-off.png');
                count--;
            }else{
                if(count == 6) {
                    return;
                }

                $(this).closest('h3').find('.check-value').attr('checked', true);
                $(this).attr('src', 'assets/icons/check-on.png');
                count++;
            }

            $('#side-count').html(count + '/6');

            $('#side-count-more').html(jsonData.html_values["side-count-more"]);
            // $('#side-count-more').html('Select ' + (6 - count) + ' more');
            $('#side-count-more-id').html(6 - count);

            if(count == 6) {
                $('#side-count-more').fadeOut(500);
            }else{
                $('#side-count-more').fadeIn(500);
            }

            get_checked_values();
        });

        $('.accordion h3 .check-img-mobile').click(function (e) {
            if($(this).closest('h3').find('.check-value').is(':checked')) {
                $(this).closest('h3').find('.check-value').attr('checked', false);
                $(this).attr('src', 'assets/icons/check-off-mobile.png');
                count--;
            }else{
                if(count == 6) {
                    return;
                }

                $(this).closest('h3').find('.check-value').attr('checked', true);
                $(this).attr('src', 'assets/icons/check-on-mobile.png');
                count++;
            }

            get_checked_values();
        });

        $('#countries-dropdown, #age-dropdown, #gender-dropdown, #education-dropdown').change(function () {
            validate();
        });

        // About drop down
        jQuery('#about-btn').click(function(){
            jQuery('#about-list').slideToggle(300);
            return false;
        });

        jQuery('#about-list li a').click(function(){
            jQuery('#about-list').slideUp(300);
            return false;
        });

        jQuery('html, body').click(function(){
            jQuery('#about-list').slideUp(300);
        });

        $('#see-results-item').click(function(e){
            $('.info-wrap, .vote-wrap, .policy-wrap, .copyright-wrap, .thank-you-wrap, .methodology-wrap, .who-we-are-wrap, .faq-wrap, .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, .about-my-world-wrap').fadeOut(500);
            $('.results-wrap').delay(550).fadeIn(500);
            page_redirect('page','results');

            return false;
        });

        $('#about-item').click(function (e) {
            $('.info-wrap, .vote-wrap, .policy-wrap, .copyright-wrap, .thank-you-wrap, .methodology-wrap, .who-we-are-wrap, .faq-wrap, .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.about-my-world-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'about-my-world');

            return false;
        });

        $('#who-we-are-item').click(function (e) {
            $('.info-wrap, .vote-wrap, .policy-wrap, .copyright-wrap, .thank-you-wrap, .methodology-wrap, .who-we-are-wrap, .faq-wrap, .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .about-my-world-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.who-we-are-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'who-we-are');

            return false;
        });

        $('#how-it-works-item').click(function (e) {
            $('.info-wrap, .vote-wrap, .policy-wrap, .copyright-wrap, .thank-you-wrap, .methodology-wrap, .who-we-are-wrap, .faq-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.how-it-works-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'how-it-works');

            return false;
        });

        $('#faq-item').click(function (e) {
            $('.info-wrap, .vote-wrap, .policy-wrap, .copyright-wrap, .thank-you-wrap, .methodology-wrap, .who-we-are-wrap, .about-my-world-wrap, .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.faq-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'faq');

            return false;
        });

        $('#methodology-title, #methodology-item').click(function(e){
            $('.info-wrap, .vote-wrap, .policy-wrap, .copyright-wrap, .thank-you-wrap, .who-we-are-wrap, .about-my-world-wrap, .faq-wrap .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.methodology-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'methodology');

            return false;
        });

        $('#how-it-works-item').click(function (e) {
            $('.info-wrap, .vote-wrap, .policy-wrap, .copyright-wrap, .faq-wrap, .thank-you-wrap, .methodology-wrap, .who-we-are-wrap, .faq-wrap .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.how-it-works-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'how-it-works');

            return false;
        });

        $('#policy-title').click(function (e) {
            $('.info-wrap, .vote-wrap, .methodology-wrap, .copyright-wrap, .thank-you-wrap, .who-we-are-wrap, .about-my-world-wrap, .faq-wrap, .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.policy-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'policy');

            return false;
        });

        $('#copyright-title').click(function (e) {
            $('.info-wrap, .vote-wrap, .methodology-wrap, .policy-wrap, .thank-you-wrap, .who-we-are-wrap, .about-my-world-wrap, .faq-wrap, .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.copyright-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'copyright');

            return false;
        });

        $('#contact-title, #contact-item').click(function(e){
            $('.info-wrap, .vote-wrap, .methodology-wrap, .policy-wrap, .thank-you-wrap, .who-we-are-wrap, .about-my-world-wrap, .faq-wrap, .how-it-works-wrap, .celebrities-wrap, .partners-wrap, .contact-thankyou-wrap, .ballot-page-vote-wrap, results-wrap').fadeOut(500);
            $('.contact-us-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'contact-us');

            return false;
        });

        $('#partners-item, #more-btn, #faq-see-more-partners, #more-partners-link').click(function(e){
            $('.info-wrap, .vote-wrap, .policy-wrap, .copyright-wrap, .faq-wrap, .thank-you-wrap, .methodology-wrap, .who-we-are-wrap, .about-my-world-wrap .how-it-works-wrap, .contact-us-wrap, .celebrities-wrap, .contact-thankyou-wrap, .results-wrap, .how-it-works-wrap, .about-my-world-wrap').fadeOut(500);
            $('.partners-wrap').delay(550).fadeIn(500);
            page_redirect('page', 'partners');

            return false;
        });

        $('#thank-you-why').click(function (e) {
            if($(window).width() < 480) {
                if($('.thank-you-why h3').height() == 76) {
                    $('#tell-us-why-form').show();
                    $('.thank-you-why h3').animate({
                        'height':280
                    });
                }else{
                    $('#tell-us-why-form').hide();
                    $('.thank-you-why h3').animate({
                        'height':100
                    });
                }
            }else{
                if($('.thank-you-why h3').height() == 40) {
                    $('#tell-us-why-form').show();
                    $('.thank-you-why h3').animate({
                        'height':240
                    });
                }else{
                    $('#tell-us-why-form').hide();
                    $('.thank-you-why h3').animate({
                        'height':64
                    });
                }
            }

            return false;
        });


        // *************************************************** Tooltip animation *************************************************
        $('#submit-btn').click(function (e) {

            if(validate() == 1) {
                $('#validation-message').css('color', 'red');
                $('#validation-message').fadeIn(400);
                return false;
            }

            // collect data
            set_img_cookie();
            $('head').append('<meta property="og:image" content="http://www.myworld2015.org/assets/img/globes/' + $.cookie('my_globe_img') + '" />');

            var choices_array = [
            ];
            $('.check-value[checked=checked]').each(function (index, element) {
                choices_array[index] = $(element).val();
            });

            //check if the user added a suggested priority
            var gender = $('#gender-dropdown :selected').val();
            var age = $('#age-dropdown :selected').val();
            var country = $('#countries-dropdown :selected').val();
            var education = $('#education-dropdown :selected').val();
            var priority = $('#priority-item-content').val();
            var language = (current_lang !== undefined && current_lang !== 'undefined' && current_lang !== null && current_lang !== '') ? language_matrix[current_lang] : "English";

            var date = new Date();
            var timezoneOffset = date.getTimezoneOffset();
            var partner = get_url_parameter("partner");
            partner = (partner !== 'undefined') ? partner : '';
            var url_parameters = location.href.split('?')[1];
            url_parameters = (url_parameters !== undefined) ? url_parameters.replace('#', '') : '';
            var referralBallotId = get_url_parameter("ballot");
            referralBallotId = (referralBallotId !== 'undefined') ? referralBallotId : '';

            //check if the user added a suggested priority
            if(priority !== undefined && priority !== null && priority !== '') {
                choices_array.push(0);
            }

            // disable vote button
            $('#submit-btn').attr('disabled', 'disabled');

            // Submit Vote
            MW.api.submitVote(choices_array, gender, age, country, language, priority, timezoneOffset, education, partner, url_parameters, referralBallotId, function (response) {
                response.data = JSON.parse(response.data);

                if(response.data.error === true) {
                    alert(response.data.message);
                }else{
                    MW.api.setActiveRecordId(response.data._id);

                    $.cookie('vote_data', JSON.stringify(response.data), {
                        expires:7,
                        path   :'/'
                    });

                    display_ballot_box(response.data);


                    // Execute getUserData only if not IE
                    var ie9_exist = $(".ie9").length;
                    var ie8_exist = $(".ie8").length;
                    var ie7_exist = $(".ie7").length;

                    if(ie9_exist>0 || ie8_exist>0||ie7_exist>0){
                    } else {
                        getUserData();
                    }



                    $('#celebrity-modern, .info-wrap, .celebrity-only').hide();
                    $('.ballot-page-vote-wrap').show({
                        complete:function(){

                            // enable vote button
                            $('#submit-btn').removeAttr('disabled');

                            // fix share this button
                            var st_url = "http://www.myworld2015.org/?ballot="+response.data._id;
                            var st_summary = jsonData.social_media.og_description+" "+st_url;
                            var st_image = 'http://www.myworld2015.org/assets/img/globes/' + $.cookie('my_globe_img');

                            $('#button-6 > a').html('<span style="height: 32px; width: 32px" class="st_sharethis_custom st_sharethis_custom_thankyou" st_url="' + st_url + '" st_title="' + jsonData.social_media.og_title + '" st_summary="' + st_summary + '" st_image="' + st_image + '">&nbsp;</span>');
                            stButtons.locateElements();
                        }
                    });
                }

                // To accomodate Kiosk mode
                //set_my_globe_img();
                $('#thank-you-img').attr('src', host + 'assets/img/globes/' + $.cookie('my_globe_img'));

                $('.vote-wrap').fadeOut(500);

                $('.counters, #teaser-content-b, #timeline-content').hide();

                $('.thank-you-wrap').fadeIn(500, function (e) {
                    $('.celebrity-map').css('display', 'none');
                    //$('.celebrity-only' ).css('display', 'block' );
                    //$('.celebrity-only' ).fadeIn(500 );
                    $('html, body').animate({
                        scrollTop: $('.thank-you-wrap').position().top
                    });

                    var my_globe = $.cookie('my_globe_img');

                    //Change FB custom Image
                    var fb_url = $('#button-5 a').attr('href');
                    var new_fb_url = fb_url.replace('image_path', 'assets/img/globes/' + my_globe);
                    $('#button-5 a').attr('href', new_fb_url);
                    $('#share-btn').attr('href', new_fb_url.replace('ballot=-1', 'ballot=' + response.data._id));

                    //Change WEIBO custom Image
                    var weibo_url = $('#button-1 a').attr('href');
                    var new_weibo_url = weibo_url.replace('image_path', 'assets/img/globes/' + my_globe);
                    $('#button-1 a').attr('href', new_weibo_url);
                    //$('#share-btn').attr('href', new_weibo_url.replace('ballot=-1', 'ballot=' + vote_data._id));
                    //Change Orkut custom Image
                    var orkut_url = $('#button-2 a').attr('href');
                    var new_orkut_url = orkut_url.replace('image_path', 'assets/img/globes/' + my_globe);
                    $('#button-2 a').attr('href', new_orkut_url);
                    // $('#share-btn').attr('href', new_orkut_url.replace('ballot=-1', 'ballot=' + vote_data._id));
                    //display_ballot_box(response.data );
                });

                //Add Google Analytics to track successful Vote:
                //google analytics track-view call
                if(url_parameters === '') {
                    _gaq.push(['_trackPageview', '/voted/']);
                      
                }else{
                    _gaq.push(['_trackPageview', '/voted/?' + url_parameters]);
                   
                }


                //window.location.reload();
                return false;
            });
        });

        function show_plan_b(){
            // Remove design accordin to tracking
            $('.plan-a').remove();
            $('.plan-b').css({
                'display':'block'
            });

            set_plan_b_logo();

            var lang_drop_down = $('.langs-wrap-select');
            lang_drop_down.val(get_url_parameter('lang'));

            // Change lang on selection change
            lang_drop_down.change(function () {

                var partners_mode = get_url_parameter('partner');
                if(partners_mode != 'undefined') {
                    page_redirect('partners', partners_mode);
                }

                var current_mode = get_url_parameter('mode');
                if(current_mode != 'undefined') {
                    page_redirect('mode', current_mode);
                }

                var ballot_refID = get_url_parameter('ballot');
                if(ballot_refID != 'undefined') {
                    page_redirect('ballot', current_mode);
                }

                page_redirect('lang', this.value);
            });

        }

        function show_plan_a(){
            $('.plan-b').remove();
            $('.plan-a').css({
                'display':'block'
            });
        }

        function updateVote(){
            var vote_data = JSON.parse($.cookie('vote_data'));
            var vote_id = vote_data._id;
            var vote_reason = $('#thank-you-why-content').val();
            var full_name = $('#vote-name').val();
            var email = $('#your-email-address').val();
            //update vote
            MW.api.updateVote(vote_id, vote_reason, full_name, email, function (response) {
                //save data to cookie
                $.cookie('vote_data', response.data, {
                    expires:7,
                    path   :'/'
                });
            });
        }

        $('#sign-me-up').bind('click', function () {
            var email = $('#your-email-address').val();
            if(email !== '') {
                updateVote();

                // GA event track
                _gaq.push(['_trackEvent', 'Post-vote Events', 'Email entered']);

            }

            jQuery('#sign-me-up, #your-email-address').hide();
            jQuery('#email-sent').fadeIn(500);
        });

        $('#vote-name').bind('focusout', function () {
            var vote_data = JSON.parse($.cookie('vote_data'));
            var fname = $('#vote-name').val();
            if(fname !== '' && fname !== vote_data.full_name) {
                updateVote();

                // GA event track
                _gaq.push(['_trackEvent', 'Post-vote Events', 'Name entered']);

            }

            $(this).css({
                borderStyle:'dotted',
                fontStyle  :'italic'
            });
        });

        $('#vote-name').bind('focusin', function () {
            var vote_data = JSON.parse($.cookie('vote_data'));
            var fname = $('#vote-name').val();
            if(fname !== '' && fname !== vote_data.full_name) {
                updateVote();

                // GA event track
                _gaq.push(['_trackEvent', 'Post-vote Events', 'Name entered']);
            }

            $(this).css({
                borderStyle:'solid',
                fontStyle  :'normal'
            });
        });

        $('#tell-us-why-send').bind('click', function () {
            updateVote();
            set_vote_cookie();
            $('.thank-you-why').hide();
            $('.thank-you-vote').fadeIn(400);
        });
        $('#vote-again-link').bind('click', function (e) {
            var params = {};
            e.preventDefault();
            $.removeCookie('vote_data', {
                path:'/'
            });
            $.removeCookie('my_globe_img', {
                path:'/'
            });
            $.removeCookie('voted');
            var partner = get_url_parameter("partner");
            params['partner'] = (partner !== 'undefined') ? partner : '';
            // var referralBallotId = get_url_parameter("ballot");
            // referralBallotId = (referralBallotId !== 'undefined') ? referralBallotId : '';
            var lang = get_url_parameter("lang");
            params['lang'] = (lang !== 'undefined') ? lang : '';

            var iframe = get_url_parameter("iframe");
            params['iframe'] = (iframe!=='undefined')?iframe:'';

            var mode = get_url_parameter("mode");
            params['mode'] = (mode!=='undefined')?mode:'';

			var min = get_url_parameter("min");
			params['min'] = (min!=='undefined')?min:'';


            var url_params_string = '';
            var count = 0;
            $.each(params, function (key, value) {
                if(value !== '') {
                    if(count === 0) {
                        url_params_string = url_params_string+'?'+key+'='+value;
                    }else{
                        url_params_string = url_params_string+'&'+key+'='+value;
                    }
                    count = count+1;
                }
            });

            // GA event track
            _gaq.push(['_trackEvent', 'Post-vote Events', 'Vote Again']);


            location.href = 'index.html'+url_params_string;

            return false;
        });

        $('.celebrities-list .item a').click(function (e) {
            $(this).find('.support-list').slideToggle(500);
            var current_id = $(this).closest('li').attr('id');

            $('.celebrities-list .item a').each(function (index, elem) {
                var item_id = $(elem).closest('li').attr('id');
                if(item_id != current_id) {
                    $(elem).find('.support-list').slideUp(500);
                }
            });

            return false;
        });

        function get_country_name_by_id(id) {
            var dropdown_values = jsonData.fields_values;
            var countries = dropdown_values.countries;
            for(i = 1; i<countries.length; i++){
                if(countries[i]['id'] == id) {
                    return countries[i]['name'];
                }
            }

            return '';
        }

        function display_ballot_box(vote_data) {
            var ballot = get_url_parameter('ballot');
            var vote_id = vote_data._id;
            //console.log(vote_data);
            //if (get_cookie('vote_data') === false) {
            //return;
            //}
            $('.tooltip-text').html(jsonData.various_values['facebook-text'].replace('ballot=-1', 'ballot=' + vote_id));
            $('.share-btn').html(jsonData.various_values['facebook-btn'].replace('ballot=-1', 'ballot=' + vote_id));

            var suggest = $('.priority-suggest-text');
            var suggest_btn = $('.priority-suggest-btn');
            var suggest_text = suggest.html();
            var more_text = suggest_text.substr(0, 50);
            var less_text = suggest_text.substr(50, 1000);
            var choices = vote_data['choices'];
            var data = jsonData.accordion_items;
            var dropdown_values = jsonData.fields_values;
            var output = '';
            var gender = dropdown_values.gender[vote_data['gender']]['ballot_gender'];
            var country = get_country_name_by_id(vote_data['country']);
            var suggested_priority = vote_data['suggested_priority'];
            var texts = jsonData.various_values;
            var vote_for = '';
            var your_turn = jsonData.various_values['ballot-your-turn'];
            var full_name = vote_data['full_name'];
            var email = vote_data['email'];

            if(ballot === 'undefined') {
                $('.vote-name').attr('placeholder', jsonData.various_values['ballot-name']);
                vote_for = jsonData.various_values['ballot-vote-for'];
            }else{
                // vote_for = 'Emiliohi ' + jsonData.various_values['ballot-vote-for'];
                vote_for = jsonData.various_values['ballot-vote-for'];
            }

            if(email !== '') {
                jQuery('#sign-me-up, #your-email-address').hide();
                jQuery('#email-sent').fadeIn(500);
            }

            if(full_name !== '') {
                $('#vote-name').attr('readonly', 'readonly');
                $('#vote-name').val(full_name);
                $('#vote-name').css({
                    borderStyle:'solid',
                    fontStyle  :'normal'
                });

                $('.ballot-page-vote-wrap .vote-text').html(jsonData.various_values['ballot-vote-for']);
            }else{
                $('.ballot-page-vote-wrap .vote-text').html(vote_for);
            }

            //suggest.html(less_text);
            //suggest_btn.html(more_text + '...');
            var info = gender+', '+vote_data['age']+' '+texts['ballot-in']+' '+country;

            for(i = 0; i<choices.length; i++){
                if(typeof data[choices[i]] == 'object') {
                    var color = data[choices[i]]['item-color'];
                    var title = data[choices[i]]['item-title'];

                    /*if ( title.length > 50 ) {
                     title = title.substr(0, 50 ) + '...';
                     }*/

                    output += '<li class="priority-'+choices[i]+' clearfix"> <span style="background-color: '+color+'" class="priority-color"></span> <img class="priority-img" src="assets/icons/ballot/check.png" alt=""> <span class="priority-text">'+title+'</span> </li>';
                }
            }

            $('.ballot-page-vote-wrap .priorites').html(output);
            $('.ballot-page-vote-wrap .info').html(info);
            $('.ballot-page-vote-wrap .vote-num').html(vote_id);
            $('.ballot-page-vote-wrap .your-turn-text').html(your_turn);
            $('.ballot-page-vote-wrap .priority-suggest-btn').html(suggested_priority);
            $('.ballot-page-vote-wrap .priority-suggest-text').html(suggested_priority);
            $('.ballot-page-vote-wrap .priority-globe').attr('src', 'http://www.myworld2015.org/assets/img/globes/' + $.cookie('my_globe_img').replace('my_', ''));
            $('#thank-you-title').html(jsonData.various_values['ballot-title']);
            $('#thank-you-share-title').html(jsonData.various_values['social-title']);
            $('#social-title-one').html(jsonData.various_values['social-title-one']);
            $('#social-title-two').html(jsonData.various_values['social-title-two']);
            $('#share-your-vote').html(jsonData.various_values['social-share']);
            $('#vote-again').html(jsonData.various_values['vote-again']);
            $('#vote-again-link').html(jsonData.various_values['vote-again-link']);
            $('#stay-in-touch').html(jsonData.various_values['stay-in-touch']);
            $('#sign-me-up').html(jsonData.various_values['sign-me-up']);
            $('#your-email-address').attr('placeholder', jsonData.various_values['your-email-address']);
            $('#email-sent').html(jsonData.various_values['email-sent']);


            // jQuery('.thank-you-ballot .inner').css({
            //     'box-shadow' : '0px 0px 7px #CCC'
            // });


            /*suggest_btn.click( function( e ) {
             e.preventDefault();

             if ($('.ballot-page-vote-wrap .priority-suggest-btn' ).length > 50 ) {
             suggest.slideToggle(500 );

             if (suggest.height() > 50 ) {
             suggest_btn.html(more_text + '...' );
             } else {
             suggest_btn.html(more_text );
             }
             }

             return false;
             } );*/

            $('#button-5 a').attr('href', $('#button-5 a').attr('href').replace('ballot=-1', 'ballot=' + vote_id));
            $('#share-btn').attr('href', jsonData.social_media['facebook_thankyou'].replace('ballot=-1', 'ballot=' + vote_id));

            $('.social-list a').hover(function () {
                $(this).attr("href", function (index, old) {
                    return old.replace("ballot=-1", 'ballot=' + vote_id);
                });

                $('.share-btn').attr('href', $(this).attr('href'));
            });

            // var social_values = jsonData.social_media;
            // var tmp_url = $(".st_sharethis_custom_thankyou").attr('st_url').toString();
            // //console.log(tmp_url);
            // //console.log(vote_id);
            // //$('.st_sharethis_custom_thankyou').attr('st_url', tmp_url.replace('ballot=-1', 'ballot=' + vote_id));
            // $(".st_sharethis_custom_thankyou").attr('st_summary', social_values['og_description'] + tmp_url.replace('ballot=-1', 'ballot=' + vote_id));
            // //console.log(tmp_url.replace('ballot=-1', 'ballot=' + vote_id));
            if(/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
                var margin_offset = 38;

                // If mobile ***************************************
                $('#button-5').click(function () {
                    $('.arrow').animate({
                        left:0
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['facebook-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['facebook-btn'].replace('ballot=-1', 'ballot=' + vote_id));
                    // set selected social network
                    selectedSocialNetwork = 'Facebook';
                    return false;
                });

                $('#button-4').click(function () {
                    $('.arrow').animate({
                        left:margin_offset
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['twitter-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['twitter-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Twitter';
                    return false;
                });

                $('#button-1').click(function () {
                    $('.arrow').animate({
                        left:margin_offset*2
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['sina-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['sina-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Sina';
                    return false;
                });

                $('#button-2').click(function () {
                    $('.arrow').animate({
                        left:margin_offset*3
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['orkut-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['orkut-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Orkut';
                    return false;
                });

                $('#button-3').click(function () {
                    $('.arrow').animate({
                        left:margin_offset*4
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['googleplus-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['googleplus-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Google+';
                    return false;
                });

                $('#button-6').click(function () {
                    $('.arrow').animate({
                        left:margin_offset*5
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['sharethis-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['sharethis-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Share This';
                    return false;
                });
            }else{
                // If desktop ***************************************
                $('#button-5').mouseenter(function () {
                    $('.arrow').animate({
                        left:0
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['facebook-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['facebook-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Facebook';
                });

                $('#button-4').mouseenter(function () {
                    $('.arrow').animate({
                        left:38
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['twitter-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['twitter-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Twitter';
                });

                $('#button-1').mouseenter(function () {
                    $('.arrow').animate({
                        left:76
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['sina-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['sina-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Sina';
                });

                $('#button-2').mouseenter(function () {
                    $('.arrow').animate({
                        left:114
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['orkut-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['orkut-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Orkut';
                });

                $('#button-3').mouseenter(function () {
                    $('.arrow').animate({
                        left:152
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['googleplus-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['googleplus-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Google+';
                });

                $('#button-6').mouseenter(function () {
                    $('.arrow').animate({
                        left:190
                    }, 200);

                    $('.tooltip-text').html(jsonData.various_values['sharethis-text'].replace('ballot=-1', 'ballot=' + vote_id));
                    $('.share-btn').html(jsonData.various_values['sharethis-btn']);
                    // set selected social network
                    selectedSocialNetwork = 'Share This';
                });

                // GA events trackers for share buttons in desktop mode
                $('#button-5').bind('click', function () {
                    _gaq.push(['_trackEvent', 'Shared', 'Facebook']);
                });
                $('#button-4').bind('click', function () {
                    _gaq.push(['_trackEvent', 'Shared', 'Twitter']);
                });
                $('#button-1').bind('click', function () {
                    _gaq.push(['_trackEvent', 'Shared', 'Sina']);
                });
                $('#button-2').bind('click', function () {
                    _gaq.push(['_trackEvent', 'Shared', 'Orkut']);
                });
                $('#button-3').bind('click', function () {
                    _gaq.push(['_trackEvent', 'Shared', 'Google+']);
                });
            }

            // GA share button event
            $('#share-btn').bind('click', function () {
                _gaq.push(['_trackEvent', 'Shared', selectedSocialNetwork]);
            });

            // *************************************************** End of Tooltip animation *************************************************
        }


        function add_hover_states(){
            $('.celebrities-list .item').hover(function (e) {
                $(this).animate({
                    backgroundColor:'#f2f2f2'
                }, 400);
            }, function (e) {
                $(this).animate({
                    backgroundColor:'#ffffff'
                }, 400);
            });

            $('.accordion h3').hover(function (e) {
                $(this).animate({
                    backgroundColor:'#f2f2f2',
                    borderColor    :'#cacaca'
                }, 400);

                $(this).find('.hover-icon').fadeIn(400);
            }, function (e) {
                $(this).animate({
                    backgroundColor:'#ffffff',
                    borderColor    :'#e3e3e3'
                }, 400);

                $(this).find('.hover-icon').fadeOut(400);
            });

            $('.thank-you-join a').hover(function (e) {
                $(this).animate({
                    backgroundColor:'#cccccc'
                }, 400);
            }, function (e) {
                $(this).css({
                    backgroundColor:'transparent'
                });
            });

            $('#submit-btn').hover(function (e) {
                $(this).animate({
                    backgroundPosition:'0 -70px'
                }, 0);
            }, function (e) {
                $(this).animate({
                    backgroundPosition:'0 0'
                }, 0);
            });

            $('#tell-us-why-send').hover(function (e) {
                $(this).animate({
                    backgroundPosition:'0 -57px'
                }, 0);
            }, function (e) {
                $(this).animate({
                    backgroundPosition:'0 0'
                }, 0);
            });

            $('#contact-us-submit').hover(function (e) {
                $(this).animate({
                    backgroundPosition:'0 -57px'
                }, 0);
            }, function (e) {
                $(this).animate({
                    backgroundPosition:'0 0'
                }, 0);
            });

            $('#share-btn').hover(function (e) {
                $(this).animate({
                    backgroundColor:'#336CAD'
                }, 400);
            }, function (e) {
                $(this).animate({
                    backgroundColor:'#418ADD'
                }, 400);
            });
        }
    });
}

function align_arabic(){
    var items = [
        '.vote-info-wrap article p','.vote-form article p','.vote-info-wrap .date','.vote-info-wrap .title','.accordion h3 a','.dropdowns-wrap-inner p','.page-wrap article','#thank-you-why-content','#priority-item-content','#timeline-content','.page-contact-form label','.page-contact-form input[type="text"]','.page-contact-form textarea','#about-title','.about-list','#partners-title','.partners-list','#more-btn','.ar .dropdowns-wrap label','#countries-dropdown','#gender-dropdown','#age-dropdown','#education-dropdown','#thank-you-join','#thank-you-why','.priorites','.tooltip-text','#thank-you-share-title','#social-title-two','#social-title-one','#share-your-vote','#vote-name','#your-email-address','#stay-in-touch'
    ];

    var propertiesj = {
        'direction':'rtl',
        'textAlign':'right'
    };

    for(var i in items) {

        $(items[i]).css(propertiesj);
    }

    $('.info-wrap').css('background-image', 'url(' + host + 'assets/img/vote-info-bg-rtl.png' + ')');
    $('.info-wrap').css('background-position', '55px 142px');
    $('.vote-info-wrap p').css('padding', 0);
    $('.vote-info-wrap .columns').css('float', 'right');
    $('#timeline-content').css('paddingRight', '30px');

    $('.partners-list li').css('float', 'right');
    $('.partners-list li').css('margin', '0 0px 30px 30px');
    $('#more-btn').css('float', 'right');
    $('#thank-you-join').css('float', 'right');
    $('#thank-you-why').css('float', 'right');
    $('#thank-you-share-text').css('direction', 'rtl');
    $('#thank-you-title').css('direction', 'rtl');
    $('#worldmap-title-thanku').css('direction', 'rtl');
    $('#worldmap-title').css('direction', 'rtl');


}

function get_url_parameter(name) {
    return decodeURIComponent((location.search.match(RegExp("[?|&]" + name + '=(.+?)(&|$)')) || [
        null
    ] )[1]);
}

function lang_change_html_values(){

    $.each(jsonData.html_values, function (key, value) {
        $('#' + key).html(value);
    });

    $('.accordion h3').each(function (index, elem) {
        if($(elem).height() > 60 && $(window).width() > 480) {
            $(elem).find('.color-box').height($(elem).find('a').height() + 30);
            $(elem).find('.color-box').height($(elem).find('.check-wrap').height() + 30);
        }
    });

}

function lang_change_fields_values(){
    if(current_lang != 'null') {

        $.each(jsonData.fields_values, function (key, value) {
            $('#' + key).val(value);
        });

    }
}

function lang_change_various_values(){
    if(current_lang != 'null') {

        var various_values = jsonData.various_values;
        $('#priority-item-content').attr('placeholder', various_values['priority-item-content']);
        $('#results-vote').html(various_values['submit-label']);
        $('#tell-us-why-send').val(various_values['send-label']);
        $('#contact-us-submit').val(various_values['contact-us-submit']);
        $('.map-title').html(various_values['map-header-text']);
    }
}

function lang_change_social_values(){
    if(current_lang != 'null') {
        var vote_id = '';
        if($.cookie('vote_data')) {
            var vote = JSON.parse($.cookie('vote_data'));
            vote_id = vote._id;

            // Initialize tooltip & share button
            $('.tooltip-text').html(jsonData.various_values['facebook-text'].replace('ballot=-1', 'ballot=' + vote_id));
            $('.share-btn').html(jsonData.various_values['facebook-btn']);
        }

        var social_values = jsonData.social_media;

        $('.fb_media_link_top').attr('href', social_values['facebook']);
        $('.fb_media_link_thankyou').attr('href', social_values['facebook_thankyou']);
        $('.twitter_media_link').attr('href', social_values['twitter']);
        $("meta[property=og\\:title]").attr("content", social_values['og_title']);
        $("meta[property=og\\:description]").attr("content", social_values['og_description']);


        // Share this
        $(".st_sharethis_custom").attr('st_title', social_values['og_title']);
        $(".st_sharethis_custom").attr('st_summary', social_values['og_description']);

        var st_url = "http://www.myworld2015.org/?ballot="+vote_id;
        var st_summary = social_values['og_description']+" "+st_url;
        var st_image = 'http://www.myworld2015.org/assets/img/globes/' + $.cookie('my_globe_img');

        $('#button-6 > a').html('<span style="height: 32px; width: 32px" class="st_sharethis_custom st_sharethis_custom_thankyou" st_url="' + st_url + '" st_title="' + social_values['og_title'] + '" st_summary="' + st_summary + '" st_image="' + st_image + '">&nbsp;</span>');
        stButtons.locateElements();

        //Weibo
        $('.weibo_media_link_top').attr('href', social_values['weibo']);
        $('.weibo_media_link_thankyou').attr('href', social_values['weibo_thankyou']);

        //Orkut
        $('.orkut_media_link_top').attr('href', social_values['orkut']);
        $('.orkut_media_link_thankyou').attr('href', social_values['orkut_thankyou']);
    }
}

function lang_create_gender_values(){

    var options = '';
    $.each(jsonData.fields_values.gender, function (key, value) {
        options += '<option value="'+value.id+'">'+value.name+'</option>';
    });

    $('#gender-dropdown').html(options);

}

function lang_create_education_values(){

    var options = '';
    $.each(jsonData.fields_values.education, function (key, value) {
        options += '<option value="'+value.id+'">'+value.name+'</option>';
    });

    $('#education-dropdown').html(options);

}

function lang_create_countries_values(){

    var options = '';
    $.each(jsonData.fields_values.countries, function (key, value) {
        options += '<option value="'+value.id+'">'+value.name+'</option>';
    });

    $('#countries-dropdown').html(options);

}

function lang_create_links_values(){

    $('#methodology-title').html(jsonData.pages['methodology-title']);
    $('#contact-title').html(jsonData.pages['contact-title']);
    $('#policy-title').html(jsonData.pages['policy-title']);
    $('#copyright-title').html(jsonData.pages['copyright-title']);

}

function lang_create_pages_content(){

    $('#page-methodology-title').html(jsonData.pages['methodology-title']);
    $('#page-methodology-content').html(jsonData.pages['methodology-content']);

    //$('#page-contact-title').html(jsonData.pages['contact-title']);
    //$('#page-contact-content').html(jsonData.pages['contact-content']);
    $('#page-policy-title').html(jsonData.pages['policy-title']);
    $('#page-policy-content').html(jsonData.pages['policy-content']);

    $('#page-copyright-title').html(jsonData.pages['copyright-title']);
    $('#page-copyright-content').html(jsonData.pages['copyright-content']);

    $('#page-who-we-are-title').html(jsonData.pages['who-we-are-title']);
    $('#page-who-we-are-content').html(jsonData.pages['who-we-are-content']);

    $('#page-about-my-world-title').html(jsonData.pages['about-my-world-title']);
    $('#page-about-my-world-content').html(jsonData.pages['about-my-world-content']);

    $('#page-faq-title').html(jsonData.pages['faq-title']);
    $('#page-faq-content').html(jsonData.pages['faq-content']);

    $('#page-how-it-works-title').html(jsonData.pages['how-it-works-title']);
    $('#page-how-it-works-content').html(jsonData.pages['how-it-works-content']);

    $('#page-contact-us-title').html(jsonData.pages['contact-us-title']);
    $('#contact-us-title-small').html(jsonData.pages['contact-us-title-small']);
    $('#contact-us-name').html(jsonData.pages['contact-us-name']);
    $('#contact-us-email').html(jsonData.pages['contact-us-email']);
    $('#contact-us-organization').html(jsonData.pages['contact-us-organization']);
    $('#contact-us-description').html(jsonData.pages['contact-us-description']);

    $('#page-partners-title').html(jsonData.pages['page-partners-title']);
    $('#page-partners-content').html(jsonData.pages['page-partners-content']);

    $('#page-contact-us-thankyou-title').html(jsonData.pages['page-contact-us-thankyou-title']);
    $('#page-contact-us-thankyou-content').html(jsonData.pages['page-contact-us-thankyou-content']);

    $('#page-coming-soon-title').html(jsonData.pages['page-coming-soon-title']);
    $('#page-coming-soon-content').html(jsonData.pages['page-coming-soon-content']);

    $('#page-results-title').html(jsonData.pages['page-results-title']);
    $('#page-results-content').html(jsonData.pages['page-results-content']);

}

function lang_create_age_values(){
    var min = 0;
    var max = 140;
    var count = min;
    var options;
    var age_text = '';


    age_text = jsonData.fields_values.age[0];

    options = '<option value="'+age_text.id+'">'+age_text.name+'</option>';

    for(i = min; i<max; ++i){
        count++;
        options += '<option value="'+count+'">'+count+'</option>';
    }

    $('#age-dropdown').html(options);


}

function build_accordion(){
    if(current_lang != 'null') {

        var items = jsonData.accordion_items;
        var numbers = [
            1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16
        ];
        var random_numbers = shuffle(numbers);
        var output = '';

        for(var i in random_numbers) {
            var accordion_item = items[random_numbers[i]];

            output += '<h3 class="clearfix"> <span class="color-box" style="background-color: '+accordion_item['item-color']+'"> <img class="hover-icon hidden-mobile" src="assets/img/accordion-arrow.png" alt=""> <img class="check-img-mobile" src="assets/icons/check-off-mobile.png" alt=""> </span> <a id="'+accordion_item['prefix']+'-item-title" href="#">'+accordion_item['item-title']+'</a> <span class="check-wrap"> <img class="check-img" src="assets/icons/check-off.png" alt=""> <input type="checkbox" class="check-value" name="check-values[]" value="'+random_numbers[i]+'"> </span> </h3> <article> <p>'+accordion_item['item-content']+'</p> </article>';
        }

        $('.accordion').prepend(output);

    }
}

function build_celebrities_tiles(){
    if(current_lang != 'null') {

        var celebrities = jsonData.celebrities;
        var numbers = [
            1,2,3,4,5,6,7,8
        ];
        var random_numbers = shuffle(numbers);
        var supports = [
        ];
        var items_html = '';

        $('#item-one .content').html(celebrities[random_numbers[0]].content);
        $('#item-one .preview').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[0]].image_src);
        $('#item-one .globe').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[0]].globe_src);

        supports = celebrities[random_numbers[0]].supports;
        for(i = 0; i<supports.length; i++){
            var item = $('#' + supports[i] + '-item-title');
            var color = item.closest('h3').find('.color-box').css('background-color');
            items_html += '<li class="clearfix"><span id="support-color" style="background-color: '+color+'"></span> <span id="support-content">'+item.html()+'</span></li>';
            $('#item-one .support-list').html(items_html);
        }

        $('#item-two .content').html(celebrities[random_numbers[1]].content);
        $('#item-two .preview').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[1]].image_src);
        $('#item-two .globe').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[1]].globe_src);

        supports = celebrities[random_numbers[1]].supports;
        items_html = '';

        for(m = 0; m<supports.length; m++){
            var item1 = $('#' + supports[m] + '-item-title');
            var color1 = item1.closest('h3').find('.color-box').css('background-color');
            items_html += '<li class="clearfix"><span id="support-color" style="background-color: '+color1+'"></span> <span id="support-content">'+item1.html()+'</span></li>';
            $('#item-two .support-list').html(items_html);
        }

        $('#item-three .content').html(celebrities[random_numbers[2]].content);
        $('#item-three .preview').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[2]].image_src);
        $('#item-three .globe').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[2]].globe_src);

        supports = celebrities[random_numbers[2]].supports;
        items_html = '';

        for(j = 0; j<supports.length; j++){
            var item2 = $('#' + supports[j] + '-item-title');
            var color2 = item2.closest('h3').find('.color-box').css('background-color');
            items_html += '<li class="clearfix"><span id="support-color" style="background-color: '+color2+'"></span> <span id="support-content">'+item2.html()+'</span></li>';
            $('#item-three .support-list').html(items_html);
        }

        $('#item-four .content').html(celebrities[random_numbers[3]].content);
        $('#item-four .preview').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[3]].image_src);
        $('#item-four .globe').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[3]].globe_src);

        supports = celebrities[random_numbers[3]].supports;
        items_html = '';

        for(l = 0; l<supports.length; l++){
            var item3 = $('#' + supports[l] + '-item-title');
            var color3 = item3.closest('h3').find('.color-box').css('background-color');
            items_html += '<li class="clearfix"><span id="support-color" style="background-color: '+color3+'"></span> <span id="support-content">'+item3.html()+'</span></li>';
            $('#item-four .support-list').html(items_html);
        }

        $('#item-five .content').html(celebrities[random_numbers[4]].content);
        $('#item-five .preview').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[4]].image_src);
        $('#item-five .globe').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[4]].globe_src);

        supports = celebrities[random_numbers[4]].supports;
        items_html = '';

        for(l = 0; l<supports.length; l++){
            var item4 = $('#' + supports[l] + '-item-title');
            var color4 = item4.closest('h3').find('.color-box').css('background-color');
            items_html += '<li class="clearfix"><span id="support-color" style="background-color: '+color4+'"></span> <span id="support-content">'+item4.html()+'</span></li>';
            $('#item-five .support-list').html(items_html);
        }


        $('#item-six .content').html(celebrities[random_numbers[5]].content);
        $('#item-six .preview').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[5]].image_src);
        $('#item-six .globe').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[5]].globe_src);

        supports = celebrities[random_numbers[5]].supports;
        items_html = '';

        for(l = 0; l<supports.length; l++){
            var item5 = $('#' + supports[l] + '-item-title');
            var color5 = item5.closest('h3').find('.color-box').css('background-color');
            items_html += '<li class="clearfix"><span id="support-color" style="background-color: '+color5+'"></span> <span id="support-content">'+item5.html()+'</span></li>';
            $('#item-six .support-list').html(items_html);
        }


        $('#item-seven .content').html(celebrities[random_numbers[6]].content);
        $('#item-seven .preview').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[6]].image_src);
        $('#item-seven .globe').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[6]].globe_src);

        supports = celebrities[random_numbers[6]].supports;
        items_html = '';

        for(l = 0; l<supports.length; l++){
            var item6 = $('#' + supports[l] + '-item-title');
            var color6 = item6.closest('h3').find('.color-box').css('background-color');
            items_html += '<li class="clearfix"><span id="support-color" style="background-color: '+color6+'"></span> <span id="support-content">'+item6.html()+'</span></li>';
            $('#item-seven .support-list').html(items_html);
        }

        $('#item-eight .content').html(celebrities[random_numbers[7]].content);
        $('#item-eight .preview').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[7]].image_src);
        $('#item-eight .globe').attr('src', host + 'assets/img/celebrities/' + celebrities[random_numbers[7]].globe_src);

        supports = celebrities[random_numbers[7]].supports;
        items_html = '';

        for(l = 0; l<supports.length; l++){
            var item7 = $('#' + supports[l] + '-item-title');
            var color7 = item7.closest('h3').find('.color-box').css('background-color');
            items_html += '<li class="clearfix"><span id="support-color" style="background-color: '+color7+'"></span> <span id="support-content">'+item7.html()+'</span></li>';
            $('#item-eight .support-list').html(items_html);
        }


    }
}

function shuffle(array) {
    for(var i = array.length-1; i>0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function get_checked_values(){
    var values = [
    ];
    var source;
    var gender = $('#gender-dropdown').val();
    var age = $('#age-dropdown').val();
    var country = $('#countries-dropdown').val();

    $('.check-value:checked').each(function () {
        values.push($(this).val());
    });

    sorted_values = values.sort(function (a, b) {
        return a-b;
    });

    if(values.length > 0) {
        source = host + 'assets/img/globes/en_globe_' + sorted_values.join('_') + '.png';
    }else{
        source = host+'assets/img/ball-empty.png';
    }

    $('#side-ball').attr('src', source);

    my_image_src = sorted_values.join('_') + '.png';

    validate();
}

function set_my_globe_img(){
    if(get_cookie('my_globe_img')) {
        $('#thank-you-img').attr('src', host + 'assets/img/globes/' + $.cookie('my_globe_img'));
    }
}

function set_img_cookie(){
    var current_mode = get_url_parameter('mode');
    if(current_mode == 'kiosk') {
        // Do not set Cookie! Kiosk Mode
    } else if(current_mode == 'home') {
        if($.cookie('max_votes')) {
            var my_votes = $.cookie('max_votes');
            set_max_votes_cookie(my_votes);
        }else{
            set_max_votes_cookie(0);
        }
    }

    $.cookie('my_globe_img', 'my_en_globe_' + my_image_src, {
        expires:7,
        path   :'/'
    });

}

function set_max_votes_cookie(votes_so_far) {
    $.cookie('max_votes', parseInt(votes_so_far, 10) + 1, {
        expires:7,
        path   :'/'
    });
}

function set_vote_cookie(){
    $.cookie('voted', 'true', {
        expires:7,
        path   :'/'
    });
}

function get_cookie(name) {
    var current_mode = get_url_parameter('mode');
    if(current_mode == 'kiosk') {
        //Kiosk Mode: Unlimited Voting
        return false;
    } else if(current_mode == 'home') {
        // Home Mode: Allow 8 Votes
        if($.cookie('max_votes')) {
            if($.cookie('max_votes') < 8) {
                return false;
            }else{
                if($.cookie(name)) {
                    return true;
                }
            }
        }else{
            return false;
        }
    }else{
        if($.cookie(name)) {
            return true;
        }

    }
    return false;
}

function page_redirect(param, value) {
    var re = new RegExp("([?|&])" + param + "=.*?(&|$)", "i");
    separator = window.location.href.indexOf('?') !== -1 ? "&" : "?";
    if(window.location.href.match(re)) {
        window.location.href = window.location.href.replace(re, '$1' + param + "=" + value + '$2');
    }else{
        window.location.href = window.location.href+separator+param+"="+value;
    }
}

function validate(){
    var values = [
    ];

    $('.check-value:checked').each(function () {
        values.push($(this).val());
    });

    if(values.length == 6 && $('#countries-dropdown').val() !== '' && $('#age-dropdown').val() !== '' && $('#gender-dropdown').val() !== '' && $('#education-dropdown').val() !== '') {
        //      $('#submit-btn').attr('disabled', false);
        $('#validation-message').fadeOut(400);
        return 0;
    }else{
        //      $('#submit-btn').attr('disabled', true);
        //$('#validation-message').fadeIn(400);
        return 1;
    }
}

function set_submit_img(){
    var submit = $('#submit-btn');
    switch(current_lang) {
        case 'en':
        submit.css('background-image', 'url("assets/img/vote.png")');
            break;
        case 'ar':
        submit.css('background-image', 'url("assets/img/vote-ar.png")');
            break;
        case 'ch':
        submit.css('background-image', 'url("assets/img/vote-ch.png")');
            break;
        case 'es':
        submit.css('background-image', 'url("assets/img/vote-es.png")');
            break;
        case 'fr':
        submit.css('background-image', 'url("assets/img/vote-fr.png")');
            break;
        case 'ru':
        submit.css('background-image', 'url("assets/img/vote-ru.png")');
            break;
        case 'kr':
        submit.css('background-image', 'url("assets/img/vote-kr.png")');
            break;
        case 'pr':
        submit.css('background-image', 'url("assets/img/vote-pr.png")');
            break;
        case 'th':
        submit.css('background-image', 'url("assets/img/vote-th.png")');
            break;
        case 'bi':
        submit.css('background-image', 'url("assets/img/vote-bi.png")');
            break;
        case 'vt':
            submit.css('background-image','url("assets/img/vote-vt.png")');
            break;
        case 'bl':
            submit.css('background-image','url("assets/img/vote-bl.png")');
            break;
        case 'al':
            submit.css('background-image','url("assets/img/vote-al.png")');
            break;
        case 'bs':
            submit.css('background-image','url("assets/img/vote-bs.png")');
            break;
        case 'ct':
            submit.css('background-image','url("assets/img/vote-ct.png")');
            break;
		case 'ja':
            submit.css('background-image','url("assets/img/vote-ja.png")');
            break;
        default:
        submit.css('background-image', 'url("assets/img/vote.png")');
    }
}

function set_plan_b_logo(){
    var logo = $('.plan-b .logo');
    switch(current_lang) {
        case 'en':
        logo.attr('src', "assets/img/plan-b/logo.png");
            break;
        case 'ar':
            logo.attr('src',"assets/img/plan-b/logo-ar.png");
            break;
        case 'ch':
        logo.attr('src', "assets/img/plan-b/logo-ch.png");
            break;
        case 'es':
        logo.attr('src', "assets/img/plan-b/logo-es.png");
            break;
        case 'fr':
        logo.attr('src', "assets/img/plan-b/logo-fr.png");
            break;
        case 'ru':
        logo.attr('src', "assets/img/plan-b/logo-ru.png");
            break;
        case 'kr':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
        case 'pr':
            logo.attr('src',"assets/img/plan-b/logo-pr.png");
            break;
        case 'th':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
        case 'bi':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
        case 'vt':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
        case 'bl':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
        case 'al':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
        case 'bs':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
        case 'ct':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
		case 'ja':
            logo.attr('src',"assets/img/plan-b/logo-no-tagline.png");
            break;
        default:
        logo.attr('src', "assets/img/plan-b/logo.png");
    }
}

function set_hover_states(){

    $('.top-list li a').hover(

        function(){
        $(this).addClass("hover-state");
        },function(){
        $(this).removeClass("hover-state");
    });

    $('.langs-list li a').hover(

        function(){
        $(this).addClass("hover-state");
        },function(){
        $(this).removeClass("hover-state");
    });

    $('.top-social-list li a').hover(

        function(){
        $(this).addClass("hover-state");
        },function(){
        $(this).removeClass("hover-state");
    });

    $('.social-list li a').hover(

        function(){
        $(this).addClass("hover-state");
        },function(){
        $(this).removeClass("hover-state");
    });

    $('.partners-list li a img').hover(

        function(){
        $(this).addClass("hover-state");
        },function(){
        $(this).removeClass("hover-state");
    });

    $('footer section a').hover(

        function(){
        $(this).addClass("hover-state");
        },function(){
        $(this).removeClass("hover-state");
    });

    $('#more-btn').hover(

        function(){
        $(this).addClass("hover-state");
        },function(){
        $(this).removeClass("hover-state");
    });

    $('.about-logo img').hover(

        function(){
        $(this).addClass("hover-state");
        },function(){
        $(this).removeClass("hover-state");
    });

    function validate_contact_form(){
        if($('#contact-us-name-field').val() === '' || $('#contact-us-email-field').val() === '' || $('#contact-us-description-field').val() === '') {
            $('#contact-validation-msg').fadeIn(500);
            return false;
        }else{
            $('#contact-validation-msg').fadeOut(500);
            return true;
        }
    }

    $('#contact-us-submit').click(function () {
        if(validate_contact_form()) {
            //get challenge and response
            var challenge = Recaptcha.get_challenge();
            var user_response = Recaptcha.get_response();

            //reload reCaptcha
            Recaptcha.reload();

            //send request
            var name = $('#contact-us-name-field').val();
            var email = $('#contact-us-email-field').val();
            var organization = $('#contact-us-organization-field').val();
            var message = $('#contact-us-description-field').val();
            MW.api.sendContactForm(name, email, organization, message, challenge, user_response, function (response) {
                response = JSON.parse(response.data);
                if(response.error === true) {
                    $('#captcha-error-msg').fadeIn(500);
                }else{
                    $('.info-wrap, .vote-wrap, .methodology-wrap, .policy-wrap, .thank-you-wrap, .who-we-are-wrap, .about-my-world-wrap, .faq-wrap, .how-it-works-wrap, .celebrities-wrap, .partners-wrap, .contact-us-wrap').fadeOut(500);
                    $('.contact-thankyou-wrap').delay(550).fadeIn(500);
                    page_redirect('page', 'contact-thankyou');

                    return false;
                }
            });
        }
    });

    function display_coming_soon_page(show) {
        if(show) {
            $('.info-wrap, .vote-wrap, .methodology-wrap, .policy-wrap, .thank-you-wrap, .who-we-are-wrap, .about-my-world-wrap, .faq-wrap, .how-it-works-wrap, .celebrities-wrap, .partners-wrap, .contact-us-wrap, #worldmap, .copyright-wrap').fadeOut(500);
            $('.coming-soon-wrap').fadeIn(500);
        }else{
            $('.info-wrap, .vote-wrap, #worldmap, .celebrities-wrap').fadeIn(500);
            $('.coming-soon-wrap').fadeOut(500);
        }

    }

    $('.langs-list li a.not-available, .mobile-langs-list a.not-available').click(function () {
        display_coming_soon_page(true);
    });

    $('.langs-list li a.language-selected a.not-available, .mobile-langs-list li a.language-selected a.not-available').click(function () {
        display_coming_soon_page(false);


        if(get_cookie('my_globe_img')) {
            $('.vote-wrap').hide();
            $('#worldmap, .thank-you-wrap').fadeIn(500);

            //Logic to display Celebrity
            //$('.celebrity-map').css('display','block');
            $('.celebrity-map').css('display', 'none');
            $('.celebrity-only').css('display', 'block');
            $('.celebrity-only').fadeIn(500);
            // End of Logic to display Celebrity
            $('html, body').animate({
                scrollTop: $('.thank-you-wrap').position().top
            });
        }else{

            // Logic to display which celebrity section to display for Starting page
            var ie8_exist = $(".ie8").length;
            var ie7_exist = $(".ie7").length;

            if(ie8_exist > 0 || ie7_exist > 0) {
                $('.celebrity-map').css('display', 'none');
                $('.celebrity-only').css('display', 'block');
                $('.celebrity-only').fadeIn(500);
            }else{
                $('.celebrity-map').css('display', 'block');
                $('.celebrity-only').css('display', 'none');
                $('.celebrity-map').fadeIn(500);
            }
            // End of Logic to display which celebrity section to display
        }


        return false;
    });

    $('.top-list li a, .footer-wrap a').click(function () {
        $('.coming-soon-wrap, #worldmap').fadeOut(500);
    });
}

function dropdown_korean_reorder(){
    var newhtml = '<label class="hidden-mobile" id="dropdowns-age-label" for="gender-dropdown"></label> <select class="age-dropdown" id="age-dropdown" name="gender-dropdown"> </select><label class="hidden-mobile" id="dropdowns-gender-label" for="gender-dropdown"></label> <select class="gender-dropdown" id="gender-dropdown" name="gender-dropdown"> </select><label class="hidden-mobile" id="dropdowns-gender-label2" for="gender-dropdown"></label> <select class="countries-dropdown" id="countries-dropdown" name="countries-dropdown"> </select>  <label class="hidden-mobile" id="dropdowns-country-label" for="countries-dropdown"></label> <label class="hidden-mobile" id="dropdowns-education-label" for="education-dropdown"></label> <select class="education-dropdown" id="education-dropdown" name="education-dropdown"> </select>';
    $('#dropdown-area').html(newhtml);
}