var jsonData = [];

var host = $('#base_directory_site').text();

function get_url_params(param){ 
    var t = location.search.substring(1).split('&');
    var f = [];
    for (var i=0; i<t.length; i++){
        var x = t[ i ].split('=');
        f[x[0]]=x[1];
    }
    i

    return f[param];

}

var current_lang = get_url_params('lang');

if(typeof current_lang === 'undefined'){
 current_lang='en';
};

if(current_lang=='ar'){
    $('#ballot-title,ul#about-list,ul#get-involved-list,header#page-about-my-world-title,article#page-about-my-world-content,section#sec1,section#sec2,label#langs-wrap-label,select#langs-wrap,.plan-b #teaser-content-b,plan-b #timeline-content').addClass('arabic');
    $('div.accordion h3 a').addClass('f_right');
    $('ul li h2 span,header span#resources,article ul li').addClass('indented_20');
    $('header span#resources').addClass('indented_40');
}

$.getJSON(host+'/assets/js/langs/' + current_lang + '.json', function (data) {
    
  //--------------JSON:HEADER-----------------------------------
    $("#see-results-item,#see-results-item-mob").append(data.html_values['see-results-item']);
    $("#about-btn,#about-btn-mob").append(data.html_values['about-btn']);
    $("#about-item,#about-item-mob").append(data.html_values['about-item']);
    $("#who-we-are-item,#who-we-are-item-mob").append(data.html_values['who-we-are-item']);
    $("#how-it-works-item,#how-it-works-item-mob").append(data.html_values['how-it-works-item']);
    $("#faq-item,#faq-item-mob").append(data.html_values['faq-item']);
    $("#contact-item,#contact-item-mob").append(data.html_values['contact-item']);
    $("#methodology-item,#methodology-item-mob").append(data.html_values['methodology-item']);
    $("#blog-item,#blog-item-mob").append(data.html_values['blog-item']);
    $("#get-involved-btn,#get-involved-btn-mob").append(data.header_html['get-involved-btn']);
    $("#resources-item,#resources-item-mob").append(data.header_html['resources-item']);
    $("#campus-item,#campus-item-mob").append(data.header_html['campus-item']);
    $("#existing-partners-item,#existing-partners-item-mob").append(data.header_html['existing-partners-item']);
    $("#ballot-widget-item,#ballot-widget-item-mob").append(data.header_html['ballot-widget-item']);
    $("#data-set-item,#data-set-item-mob").append(data.header_html['data-set-item']);
    $("#register-item,#register-item-mob").append(data.header_html['register-item']);
    $("#teaser-content-b").append(data.html_values['teaser-content-b']);
    $("#timeline-content").append(data.html_values['timeline-content']);
  //--------------JSON:PAGE TITLE-------------------------------
    $("#campus-program").append(data.page_title['campus-program']);
    $("#resources").append(data.page_title['resources']);
    $("#partners").append(data.page_title['partners']);
    $("#widget-creator").append(data.page_title['widget-creator']);
    
  //-------------JSON:FOOTER--------------------------------------   
    $("#about-title").append(data.html_values['about-title']);
    $("#about-content").append(data.html_values['about-content']);
    $("#about-content-middle").append(data.html_values['about-content-middle']);
    $("#partners-title").append(data.html_values['partners-title']);
    $("#first-logo-label").append(data.html_values['first-logo-label']);
    $("#second-logo-label").append(data.html_values['second-logo-label']);
    $("#third-logo-label").append(data.html_values['third-logo-label']);
    $("#fourth-logo-label").append(data.html_values['fourth-logo-label']);
    $("#more-btn").append(data.html_values['more-btn']);
    
    $("#methodology-title").append(data.pages['methodology-title']);
    $("#policy-title").append(data.pages['policy-title']);
    $("#copyright-title").append(data.pages['copyright-title']);
    $("#contact-title").append(data.pages['contact-title']);
    
    
    //---------JSON:CAMPUS PROGRAM PAGE---------------------------
    $("#thanks-for-support").append(data.campus_program['thanks-for-support']);
    $("#what-we-want").append(data.campus_program['what-we-want']);
    $("#profile").append(data.campus_program['profile']);
    $("#vital-support").append(data.campus_program['vital-support']);
    $("#watch-this-space").append(data.campus_program['watch-this-space']);
    $("#resource-part1").append(data.campus_program['resource-part1']);
    $("#resource-word").append(data.campus_program['resource-word']);
    $("#resource-part2").append(data.campus_program['resource-part2']);
    
    //--------JSON:PARTNERS PAGE---------------------------------
    $("#partner-intro").append(data.partners['partner-intro']);
    $("#un-agencies").append(data.partners['un-agencies']);
    $("#civil-society").append(data.partners['civil-society']);
    $("#private-sector").append(data.partners['private-sector']);
    
    //-------JSON:RESOURCE PAGE----------------------------------
    $("#thanks-for-interest").append(data.resources['thanks-for-interest']);
    $("#we-want-people").append(data.resources['we-want-people']);
    $("#find-resources").append(data.resources['find-resources']);
    $("#support").append(data.resources['support']);
    $('#organizations').append(data.resources['organizations']);
    $("#how-get-involved").append(data.resources['how-get-involved']);
    $("#toolkit").append(data.resources['toolkit']);
    $("#partnerid").append(data.resources['partnerid']);
    $("#spread").append(data.resources['spread']);
    $("#embed").append(data.resources['embed']);
    $("#administer").append(data.resources['administer']);
    $("#download").append(data.resources['download']);
    $("#include").append(data.resources['include']);
    $("#reach").append(data.resources['reach']);
    $("#engage").append(data.resources['engage']);
    $("#help").append(data.resources['help']);
    $("#send").append(data.resources['send']);
    $("#students").append(data.resources['students']);
    $("#set-up").append(data.resources['set-up']);
    $("#check-out-part1").append(data.resources['check-out-part1']);
    $("#here-word").append(data.resources['here-word']);
    $("#check-out-part2").append(data.resources['check-out-part2']);
    $("#individuals").append(data.resources['individuals']);
    $("#ten-ways").append(data.resources['ten-ways']);
    $("#organize").append(data.resources['organize']);
    $("#donate").append(data.resources['donate']);
    $("#bring").append(data.resources['bring']);
    $("#watch").append(data.resources['watch']);
    $("#android").append(data.resources['android']);
    $("#friends").append(data.resources['friends']);
    $("#start-part1").append(data.resources['start-part1']);
    $("#campus-word").append(data.resources['campus-word']);
    $("#start-part2").append(data.resources['start-part2']);
    $("#newsletter").append(data.resources['newsletter']);
    $("#communities").append(data.resources['communities']);
    $("#write").append(data.resources['write']);
    
    //---------JSON: WIDGET CREATOR -------------
    $("#embed-ballot").append(data.widget['embed-ballot']);
    $("#what").append(data.widget['what']);
    $("#presentation").append(data.widget['presentation']);
    $("#how").append(data.widget['how']);
    $("#how-to").append(data.widget['how-to']);
    $("#field-widget-height-label").append(data.widget['field-widget-height-label']);
    $("#dropdowns-widget-language-label").append(data.widget['dropdowns-widget-language-label']);
    $("#dropdowns-widget-partnerID-label").append(data.widget['dropdowns-widget-partnerID-label']);
    $("#generate").append(data.widget['generate']);
    $("#px").append(data.widget['px']);
    
    
});




