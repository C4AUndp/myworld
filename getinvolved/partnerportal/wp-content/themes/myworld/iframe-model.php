<?php
/*
Template Name: Iframe-model
*/
?>



<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">  
		<title>MW2015 Widget</title>
		<link rel="stylesheet" href="<?php bloginfo('stylesheet_directory'); ?>/assets/css/widget.css">
	</head>
	<body>
		<p id="base_directory" style="display:none"><?php echo  bloginfo('stylesheet_directory'); ?></p>
		
		



			<a href="http://myworld2015.org"><img src="<?php bloginfo('stylesheet_directory');?>/assets/img/logo.png" alt="" class="widget_logo" ></a>
			<br>
		<div id="widget-content">
			<header class="vote-header-wrap" style="margin-bottom: 0;">
			<p id="vote-header"> </p>
			</header>

			
			<div class="accordion vote-form"></div>

			<div class="suggest-priority">
				<h4><span  class="box  plus-sign"></span><a id="priority-item-title" href="#"></a></h4>
					<article id="priority-item-content-wrap" style="display:none">
						<textarea id="priority-item-content" placeholder=""></textarea>
					</article>
			</div>
            
            <br>
		    <section class="dropdowns-wrap">
		    	<section class="dropdowns-wrap-inner">
		    		<p id="dropdowns-title"></p>
		    		<p id="dropdowns-content"></p>
		    		<section id="dropdown-area" class="row" style="margin-bottom: 20px">

								<label for="gender-dropdown" id="dropdowns-gender-label" class="hidden-mobile"></label>
								<select name="gender-dropdown" id="gender-dropdown" class="gender-dropdown"></select>
								

								<label for="age-dropdown" id="dropdowns-age-label" class="hidden-mobile"></label>
								<select name="age-dropdown" id="age-dropdown" class="age-dropdown"></select>
							

								<label for="countries-dropdown" id="dropdowns-country-label" class="hidden-mobile"></label>
								<select name="countries-dropdown" id="countries-dropdown" class="countries-dropdown"></select>
								

								<label for="education-dropdown" id="dropdowns-education-label" class="hidden-mobile"></label>
								<select name="education-dropdown" id="education-dropdown" class="education-dropdown"></select>
					</section>
					<br><br>
				    <p id="dropdowns-oath" style=""></p>	
				    <section class="row submit-btn-wrap" style="margin-bottom: 0">
								<span style="display: block; height: 50px; margin: 0px auto; position: relative; width: 262px;">

									<input type="button" value="" name="submit-btn" id="submit-btn" class=" btn-active " style="">
								</span>
					</section>	

					<section style="height:80px">
					<p id="validation-message" class="validation-message" style="word-wrap:break-word;margin-top:5px;margin-bottom:5px;display:none">
					</p>
					</section>
					

		    	</section>
		    </section>

		   

		




		</div>
		<div id="thank-you-for-voting"><p id="thank-you-message" class="vote-message" style="display:none"></p></div>
			<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
			<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
			<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/assets/js/easyXDM.js"></script>
			<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/assets/js/MW.js"></script>
			<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/assets/js/accordion.js"></script>
			<script type="text/javascript" src="<?php bloginfo('stylesheet_directory'); ?>/assets/js/widget.js"></script>
			
    </body>
</html>