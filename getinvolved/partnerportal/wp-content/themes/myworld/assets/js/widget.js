


var jsonData = [];

var host = $('#base_directory').text();



shuffle = function(o){ 
	for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
	return o;
};



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


var partnerID = get_url_params('partner');

var current_lang = get_url_params('lang');

 if(typeof current_lang === 'undefined'){
  current_lang='en';
 };


 

$.getJSON(host + '/assets/js/langs/' + current_lang + '.json', function (data) {


	//--------------JSON:vote header------------------------------
	$('#vote-header').append(data.html_values['vote-header']);

	//-------------JSON:suggested priority-----------------------

	$('#priority-item-title').append(data.html_values['priority-item-title']);

	$('#priority-item-content').attr('placeholder',data.various_values['priority-item-content']);

	//-----------JSON: Personal Info DropDown----------------------
	$('#dropdowns-title').text(data.html_values['dropdowns-title']);
	$('#dropdowns-content').text(data.html_values['dropdowns-content']);

				//--- GENDER----//
	$('#dropdowns-gender-label').text(data.html_values['dropdowns-gender-label']);
     var gender_dropdowns = data.fields_values['gender'];
     var output_gender ='';
     
     var j=0;
     for(j=0;j<gender_dropdowns.length;j++){
     	
     	output_gender+='<option value="'+gender_dropdowns[j].id +'">'+gender_dropdowns[j].ballot_gender+'</option>'

     }

     $('#gender-dropdown').append(output_gender);
     if(current_lang=='kr' || current_lang=='ar'){
     	$('#gender-dropdown').css('float','none');
     }

     			//--- AGE----//
	$('#dropdowns-age-label').text(data.html_values['dropdowns-age-label']);
     var age_dropdowns = data.fields_values['age'];
     var output_age ='';
     
     var k=0;
     for(k=0;k<=140;k++){
     	
     	if(k==0){
     	output_age+='<option value="'+age_dropdowns[k].id +'">'+age_dropdowns[k].name+'</option>'
	     }else{
	     	output_age+='<option value="'+k+'">'+k+'</option>'
	     }


     }

     $('#age-dropdown').append(output_age);
     if(current_lang=='kr' || current_lang=='ar'){
     	$('#age-dropdown').css('float','none');
     }


     			//--COUNTRY---//
     $('#dropdowns-country-label').text(data.html_values['dropdowns-country-label']);
     var countries_dropdowns = data.fields_values['countries'];
     var output_countries ='';
     
     var l=0;
     for(l=0;l<countries_dropdowns.length;l++){
     	
     	output_countries+='<option value="'+countries_dropdowns[l].id +'">'+countries_dropdowns[l].name+'</option>'

     }

     $('#countries-dropdown').append(output_countries);
     if(current_lang=='kr' || current_lang=='ar'){
     	$('#countries-dropdown').css('float','none');
     }

     			//--EDUCATION---//
      $('#dropdowns-education-label').text(data.html_values['dropdowns-education-label']);
     var education_dropdowns = data.fields_values['education'];
     var output_education ='';
     
     var m=0;
     for(m=0;m<education_dropdowns.length;m++){
     	
     	output_education+='<option value="'+education_dropdowns[m].id +'">'+education_dropdowns[m].name+'</option>'

     }

     $('#education-dropdown').append(output_education);
     if(current_lang=='kr' || current_lang=='ar'){
     	$('#education-dropdown').css('float','none');
     }

     		//---------OATH-------//
     $('#dropdowns-oath').append(data.html_values['dropdowns-oath']);

            //------JSON: VALIDATION MESSAGE------//
      $('#validation-message').append(data.html_values['validation-message']);

           //---JSON: COUNTER -----//
      side_count_more=data.html_values['side-count-more'];
      //alert(side_count_more);
      
          //---JSON: THANK YOU MESSAGE ----//
      $("#thank-you-message").append(data.html_values['thank-you-title']);









   //------- ACCORDION RANDOM GENERATION ---------//
    var items = data.accordion_items;
    var numbers = [
        1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16
    ];
    var random_numbers = shuffle(numbers);
    
    var output = '';
    
    var i = 0;

    for(i = 0; i<random_numbers.length; i++){
        var accordion_item = items[random_numbers[i]];
        
       output += '<h3> <span class="box arrow-down" style="background-color: '+accordion_item['item-color']+'">  </span> <a id="'+accordion_item['prefix']+'-item-title" href="#">'+accordion_item['item-title']+'</a>  <span class="check-wrap checked-off"> <input type="checkbox" class="check-value" name="check-values[]" value="'+random_numbers[i]+'"><span class="promo"></span></span></h3> <article> <ul><li>'+accordion_item['item-content']+'</li></ul></article>';
    


    }
    

     
    $('div.accordion.vote-form').prepend(output);


    //---- LANGUAGE-SPECIFIC ADJUSTEMENTS-----//
    if (current_lang=='ar') {
    	
    	$('div.accordion h3 a,div.accordion ul, div.suggest-priority h4 a,div.suggest-priority article textarea,#dropdowns-content,#dropdowns-title').css({"text-align":"right","direction":"rtl"});
    	$('#dropdowns-title,#dropdowns-content').css('font-size','16px');
        $('#gender-dropdown,#education-dropdown,#countries-dropdown,#age-dropdown').css({'float':'right','margin-right':'20px','margin-left':'auto','text-align':'right','direction':'rtl'});
        $('#dropdowns-oath').css({"text-align":"right","direction":"rtl"});
        $('.submit-btn-wrap').css('text-align','right');
        $('.submit-btn-wrap').children('span').css('display','inline');
        $('#submit-btn').css({"text-align":"right","direction":"rtl"});
        $('#validation-message').css({'text-align':'right','direction':'rtl','font-size':'18px'});
        
    	    	
    	

    }else if(current_lang=='fr'){
         $('#vote-header').children('span').prepend('<br>');   
    }else if(current_lang=='kr'){
        $('.vote-header-wrap').css('font-size','20px');
    }else if(current_lang=='ru'){
        $('.vote-header-wrap').css('font-size','22px');
    }else if(current_lang=='th'){
        $('.vote-header-wrap').css('font-size','20px');
    }else if(current_lang=='vt'){
        $('.vote-header-wrap').css('font-size','21px');
    }

    

    jsonData = data;

     docready();

});









function docready(){
	$(document).ready(function(){

             
		     var count=0;

		    /*------- ACCORDION: switch "arrows up and down" & "plus/minus sign" --------------*/
			$('.accordion').accordion('refresh');

			$( ".accordion" ).accordion({
		    header:'h3',
		    collapsible: true, active: false,
		    heightStyle: "content"
		    
		    });

		     $("div.accordion.vote-form h3").on('click',function(e){
		         e.preventDefault();
		        var spanBox = $(this).children('span.box');
		        if(spanBox.hasClass('active-box')){//user has clicked on an already extended accordion
		            spanBox.toggleClass('arrow-down arrow-up');
		        } else{//user clicks to open a new accordion
		            $('span.box').removeClass('arrow-up active-box').addClass('arrow-down');//reset all
		            spanBox.removeClass('arrow-down').addClass('arrow-up active-box');//set the arrow up on clicked accordion
		        }
		     });

		     $(".suggest-priority h4").on('click',function(e){
		         e.preventDefault();
		     	var priorityBox = $(this).children('span.box');
		     	priorityBox.toggleClass('plus-sign minus-sign');
		     	$("#priority-item-content-wrap").slideToggle();
		     	

		     });




		     /*------ ACCORDION: set as "checked-on" or "checked-off" --------*/
		     $('span.check-wrap').click(function (event) {
                event.stopPropagation();

	            if($(this).hasClass('checked-on')) {
	                $(this).closest('h3').find('.check-value').attr('checked', false);
	                $(this).removeClass('checked-on').addClass('checked-off');
	                count--;
	            }else{
	                if(count == 6) {
	                	//alert('You already have 6 priorities checked!');
	                    return;
	                }

	                $(this).closest('h3').find('.check-value').attr('checked', true);
	                $(this).removeClass('checked-off').addClass('checked-on');
	                count++;
	            }


                $('.promo').empty();
                
	            $('.promo').append('<p id="total" style="font-size:32px;">'+count+'/6</p>');


            });

             /*---- DISPLAY PROPER SUBMIT BUTTON-------*/
            
                $('#submit-btn').addClass('vote-'+current_lang);

            /*-----------Counter messages------------------*/
                $('.check-wrap').on('click',function(){

                $(this).find('.promo').animate({'opacity':'1','top':'-2px'},'3000');
               
                });

               $('.check-wrap').on('mouseleave',function(){
                    $(this).find('.promo').animate({'opacity':'0','top':'0'},'1500');
                });



         //**************************** SUBMIT VOTES ***************************//


         $('#submit-btn').on('click',function(){

            //---validate user inputs-----//
            $('#validation-message').hide('fast');

            if(validate()===0){
                $('#validation-message').show('slow');
            }else{
                //--get priorities---//
                var choices_array = [
                ];
                $('.check-value[checked=checked]').each(function (index, element) {
                    choices_array[index] = parseInt($(element).val());
                });
                
                //---get user info-----//
                var gender = parseInt($('#gender-dropdown :selected').val());
                var age = parseInt($('#age-dropdown :selected').val());
                var country = parseInt($('#countries-dropdown :selected').val());
                var education = parseInt($('#education-dropdown :selected').val());

                
                //--get suggested_priorities---//
                var suggested_priority = $('#priority-item-content').val();
                

                //---- submit vote ----//
                  var api_url = "https://apps.myworld2015.org/vote.php";
                  
                  vote_data = {
                    "key": "n0RyH2fb7ZFII9udAfE8egmv",
                    "partner": partnerID,
                    "country": country,
                    "gender": gender,
                    "suggested_priority": suggested_priority,
                    "education": education,
                    "age": age,
                    "votes": choices_array,
                     
                  };

                $.ajax({
                  type: "POST",
                  url: api_url,
                  data: JSON.stringify(vote_data),
                  success: function(response) {
                    returnedData = JSON.parse(response);
                    console.log(returnedData);
                  },
                  error: function(error) {
                    console.log("There was an error");
                    console.log(error);
                  }
                }); 


                //alert('Thanks for voting');
                $("#widget-content").animate({opacity:0},2000);
                $("#widget-content").hide();
                $("#thank-you-message").show();
                $("#thank-you-message").animate({opacity:1},2000);


                

            }
        });

            

                
      
        function validate(){
            var values = [
            ];

            $('.check-value:checked').each(function () {
                values.push($(this).val());
            });

            if(values.length == 6 && $('#countries-dropdown').val() !== '' && $('#age-dropdown').val() !== '' && $('#gender-dropdown').val() !== '' && $('#education-dropdown').val() !== '') {
                return 1;
            }else{
                return 0;
            }
        }
            
            

             

	     
   });
};




