@echo off 

java -jar "../closure-compiler/compiler.jar" ^
--js "../snap/js/Utils.js" ^ "../snap/js/Constants.js" ^ "../snap/js/Analytics.js" ^ "../snap/js/ImageDialog.js" ^ "../snap/js/View.js" ^ "../snap/js/Factory.js" ^ "../snap/js/content.js" ^ 
--js_output_file "../snap/js/content_minified.js" ^
--formatting=PRETTY_PRINT ^
--warning_level VERBOSE ^
--source_map_format V3 
--compilation_level ADVANCED  
--language_in ECMASCRIPT6 
--language_out ECMASCRIPT6 
