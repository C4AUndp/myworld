/*
 * Main JQuery code for MyWord2015 Partners Portal
 * Manages essentially interaction with the navigation bar
 *
 */



$(document).ready(function(){
   
		  // Gray-out navbar links on mouse hover

		  $("#see-results-item").hover(function(){
			    $("#see-results-item").toggleClass("hover-state");
			  });
		  
		  $("#about-btn").hover(function(){
			    $("#about-btn").toggleClass("hover-state");
			  });

		  $("#about-item").hover(function(){
			    $("#about-item").toggleClass("hover-state");
			  });
		  
		  $("#who-we-are-item").hover(function(){
			    $("#who-we-are-item").toggleClass("hover-state");
			  });

		  $("#how-it-works-item").hover(function(){
			    $("#how-it-works-item").toggleClass("hover-state");
			  });
		  $("#faq-item").hover(function(){
			    $("#faq-item").toggleClass("hover-state");
			  });
		  $("#contact-item").hover(function(){
			    $("#contact-item").toggleClass("hover-state");
			  });
		  $("#methodology-item").hover(function(){
			    $("#methodology-item").toggleClass("hover-state");
			  });
		  
		  $("#blog-item").hover(function(){
			    $("#blog-item").toggleClass("hover-state");
			  });
		  
		  $("#get-involved-btn").hover(function(){
			    $("#get-involved-btn").toggleClass("hover-state");
			  });
		  $("#resources-item").hover(function(){
			    $("#resources-item").toggleClass("hover-state");
			  });
		  
		  $("#campus-item").hover(function(){
			    $("#campus-item").toggleClass("hover-state");
			  });

		  $("#existing-partners-item").hover(function(){
			    $("#existing-partners-item").toggleClass("hover-state");
			  });
		  $("#register-item").hover(function(){
			    $("#register-item").toggleClass("hover-state");
			  });

		  $("#ballot-widget-item").hover(function(){
			    $("#ballot-widget-item").toggleClass("hover-state");
			  });
		  $("#partnerID-tooltip").hover(function(){
			    $("#partnerID-tooltip").toggleClass("hover-state");
			  });
		  $("#widget-height-tooltip").hover(function(){
			    $("#widget-height-tooltip").toggleClass("hover-state");
			  });
		  






         //Expand or Retract drop down menu on mouse click

		  $("#about-btn").click(function(){
			    $("#about-list").slideToggle("400");
			  });

		  $("#nav-btn").click(function(){
			    $("#nav-list").slideToggle("400");
			  });
		  
		  $("#get-involved-btn").click(function(){
			    $("#get-involved-list").slideToggle("400");
			  });


		  //Retract already open drop down menu when another element on the page is clicked

          $("#about-btn").bind( "clickoutside", function(event){
			  $("#about-list").slideUp();
			});

           $("#get-involved-btn").bind( "clickoutside", function(event){
			  $("#get-involved-list").slideUp();
			});

           $("#nav-btn").bind( "clickoutside", function(event){
			  $("#nav-list").slideUp();
			});


         //select a language
           
       
       $("select#langs-wrap").change(function(){
           
           var value=$("select option:selected").val();
            location.search=value;
       });
       
       
       $("select#langs-wrap-mob").change(function(){
           
           var value=$("select#langs-wrap-mob option:selected").val();
            location.search=value;
            
       });
		  
       

});