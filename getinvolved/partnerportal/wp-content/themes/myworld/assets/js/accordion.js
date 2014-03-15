/**
 * Code for handling accordions
 */


$(function() {
    $( ".accordion" ).accordion({
    header:'h3',
    collapsible: true, active: false,
    heightStyle: "content"
    
    });

    $("div.accordion h3").on('click',function(){
        
        var spanBox = $(this).children('span.box');
        if(spanBox.hasClass('active-box')){//user has clicked on an already extended accordion
            spanBox.toggleClass('arrow-down arrow-up');
        } else{//user clicks to open a new accordion
            $('span.box').removeClass('arrow-up active-box').addClass('arrow-down');//reset all
            spanBox.removeClass('arrow-down').addClass('arrow-up active-box');//set the arrow up on clicked accordion
        }
    });

 

});