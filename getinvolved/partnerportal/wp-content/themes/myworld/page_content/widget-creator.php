<article class="mobile_style_article" id="page-about-my-world-content">
<div id="google_translate_element"></div>
<script type="text/javascript">
   function googleTranslateElementInit() {
	 new google.translate.TranslateElement({pageLanguage: 'en', layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL, multilanguagePage: true}, 'google_translate_element');
		}
</script>
<script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>


<h2 class="methodology-main-header" id="ballot-title"><span id="embed-ballot" ></span></h2>
<br>
<br>


<h2 class="methodology-header"><span id="what"></span></h2>
<br>
<span id="presentation" class="thin"></span>
	
<br><br>


<h2 class="methodology-header"><span id="how"></span></h2>
<br>
<span id="how-to" class="thin"></span>
<br><br>

<div id="widget-form-main-wrap" style="width: 50%">
<form id="widget-form">
<fieldset>
<div>
<label id="field-widget-height-label" class="hidden-mobile" for="widget-height-field" style="margin-right: 28px;"></label>
<input id="widget-height-field" name="widget-height" >
<span id="px"></span><span id="widget-height-tooltip" title="The widget is designed to work at 600 pixels wide. Please only use this width when embedding on your site. You may set the height to whatever you think is appropriate,but a height of between 500 and 800 pixels is recommended." style="color:red;margin-left:8px">(?)</span>
</div>
<div>
<label id="dropdowns-widget-language-label" class="hidden-mobile" for="widget-language-dropdown" style="margin-right: 7px;"></label>
<select id="widget-language-dropdown" class="widget-language-dropdown" name="widget-language-dropdown">
	<option value="en">English</option>
	<option value="es">Español</option>
	<option value="fr">Français</option>
	<option value="ru">Pусский</option>
	<option value="ar">العربية</option>
	<option value="ch">中文</option>
	<option value="kr">한국어</option>
	<option value="pr">Português</option>
	<option value="th">ภาษาไทย</option>
	<option value="bi">Bahasa Indonesia</option>
	<option value="vt">Tiếng Việt</option>
	<option value="bl">Беларуская</option>
	<option value="al">Albania</option>
	<option value="bs">Bisaya</option>
	<option value="ct">Catalan</option>
	<option value="bn">াংলা</option>
	<option value="tr">Türkçe</option>
	<option value="ja">日本語</option>
	
</select>
</div>

<div id="widget-language-wrap" >
<label id="dropdowns-widget-partnerID-label" class="hidden-mobile" for="widget-partnerID-dropdown"> </label>
<input id="widget-partnerID-field" name="widget-partnerID" ><span id="partnerID-tooltip" title="Include your organization's partner ID in the frame's source URL by filling out this text field" style="color:red;margin-left:8px;" >(?)</span>


</div>
</fieldset>
</form>
<button id="generate"></button>
</div>


<div id="result-window-frame">
<code id="result-frame" style="display:none" class="notranslate"></code>

</div>

<p id="base_url" style="display:none"><?php echo $base_url;?></p>
</article>

 <script>
	
	
	 $("#generate").on('click',function() {
	     $("#result-frame").hide();
	     var output='';
         var base_url= $("#base_url").text()+'/widget/';;
         var height = $("#widget-height-field").val();
         var lang= $("#widget-language-dropdown").val();
         var partnerID = $("#widget-partnerID-field").val();
         if(height== '') {
             height=500;
         }
         
         output+= '<iframe src="'+base_url+'?lang='+lang;
         if(partnerID!=''){
             
             output+='&partner='+partnerID;
             
         }
         output+='" width=600 height='+height+' frameborder="0" style="border:1px solid #aaa;"></iframe>'; 
         $("#result-frame").text(output).show('slow');
         
        
         
         
         
         	 });
	             
     

</script>
 
