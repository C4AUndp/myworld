<?php
session_start();
header('Cache-control: private'); // IE 6 FIX

if(isSet($_GET['lang']))
{
   $lang = $_GET['lang'];

// register the session and set the cookie
   $_SESSION['lang'] = $lang;

   setcookie("lang", $lang, time() + (3600 * 24 * 30));
}
else if(isSet($_SESSION['lang']))
{
   $lang = $_SESSION['lang'];
}
else if(isSet($_COOKIE['lang']))
{
   $lang = $_COOKIE['lang'];
}
else
{
   $lang = 'en';
}






$language_selected='English';//we set it as default
$language_selected_label='Language:';//we set it as default

switch ($lang) {
  case 'en':
  $lang_file = 'lang.en.php';
  $language_selected='English';
  $language_selected_label='Language:'; 
  $logo_ext='';
  break;

  case 'es':
  	$lang_file = 'lang.es.php';
  	$language_selected='Español';
  	$language_selected_label='Idioma:';
  	$logo_ext='-es';
  	break;
  
  case 'fr':
	$lang_file = 'lang.fr.php';
	$language_selected='Français';
	$language_selected_label='Langue:';
	$logo_ext='-fr';
  	break;
  	
  case 'ru':
 	$lang_file = 'lang.ru.php';
 	$language_selected='Pусский';
 	$language_selected_label='Язык:';
 	$logo_ext='-ru';
  	break;

  case 'ar':
  	$lang_file ='lang.ar.php';
  	$language_selected='العربية';
  	$language_selected_label='اللغة:';
  	$logo_ext='-ar';
  	break;
  	
  case 'ch':
  	$lang_file = 'lang.ch.php';
  	$language_selected='中文';
  	$language_selected_label='语言：';
  	$logo_ext='-ch';
  	break;
  	
  case 'kr':
  	$lang_file = 'lang.kr.php';
  	$language_selected='한국어';
  	$language_selected_label='언어:';
  	$logo_ext='-kr';
  	break;
  	
  case 'pr':
  	$lang_file = 'lang.pr.php';
  	$language_selected='Português';
  	$language_selected_label='Idioma:';
  	$logo_ext='-pr';
  	break;
  	
  case 'th':
  	$lang_file = 'lang.th.php';
  	$language_selected='ภาษาไทย';
  	$language_selected_label='ภาษา:';
  	$logo_ext='-th';
  	break;
  	
  case 'bi':
  	$lang_file = 'lang.bi.php';
  	$language_selected='Bahasa Indonesia';
  	$language_selected_label='Bahasa:';
  	$logo_ext='-bi';
  	break;
  	
  case 'vt':
  	$lang_file = 'lang.vt.php';
  	$language_selected='Tiếng Việt';
  	$language_selected_label='Ngôn ngữ';
  	$logo_ext='-vt';
  	break;
  	
  case 'bl':
  	$lang_file = 'lang.bl.php';
 	$language_selected='Беларуская';
  	$language_selected_label='Мова:';
  	$logo_ext='-bl';
  	break;
  	
  case 'al':
  	$lang_file = 'lang.al.php';
  	$language_selected='Albania';
  	$language_selected_label='Gjuhë';
  	$logo_ext='-al';
  	break;
  	
  case 'bs':
  	$lang_file = 'lang.bs.php';
  	$language_selected='Bisaya';
  	$language_selected_label='Lengguwahe';
  	$logo_ext='-bs';
  	break;
  	
  case 'ct':
  	$lang_file = 'lang.ct.php';
  	$language_selected='Catalan';
  	$language_selected_label='Llengua';
  	$logo_ext='-ct';
  	break;
  
  case 'tr':
  	$lang_file = 'lang.tr.php';
  	$language_selected='Türkçe';
  	$language_selected_label='dil';
  	$logo_ext='-tr';
  	break;
  	
  case 'ja':
	$lang_file = 'lang.ja.php';
 	$language_selected='日本語';
  	$language_selected_label='言語';
  	$logo_ext='-ja';
  	break;
  	
  		 

  default:
  $lang_file = 'lang.en.php';
  

}


include_once 'site_url.php';//contains the web site base url 






//Define content to be added
$post =get_post($post->ID);
$page = strtolower($post->post_title);



?>
