/**
 * Code for handling accordions from main site
 */


$(function() {
   

    $("div.accordion h3").on('click',function(e){
                e.preventDefault();
		        var spanBox = $(this).children('span.box');
		        if(spanBox.hasClass('active-box')){//user has clicked on an already extended accordion
		            spanBox.toggleClass('arrow-down arrow-up');
		            spanBox.closest('h3').next().slideToggle('slow');
		        } else{//user clicks to open a new accordion
		            $('span.box').removeClass('arrow-up active-box').addClass('arrow-down');//reset all
		            $("accordion-content").css('display','none');
		            $(".accordion-content").hide()//hide all
		            spanBox.removeClass('arrow-down').addClass('arrow-up active-box');//set the arrow up on clicked accordion
		            spanBox.closest('h3').next().slideDown('slow');
		            
		        }
		     });

 

});