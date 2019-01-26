// ==UserScript==
// @name		ToledoPimper
// @namespace	ToledoPimper
// @description	For a less boring toledo experience
// @author		Sleeyax
// @include		*toledo.kuleuven.be/portal*
// @version		2.1
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require		inc/jBox.js
// @require	    Toledo.js
// @require	    CoursePimper.js
// @resource	jBoxCSS inc/jBox.css
// @resource	modal modal.html
// @resource	settings settings.html
// @grant		GM_addStyle
// @grant		GM_getResourceText
// @grant		GM_setValue
// @grant		GM_getValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// ==/UserScript==

// --DO NOT DELETE--
GM_addStyle(GM_getResourceText("jBoxCSS"));
// ----

let toledo = new Toledo();

toledo.onCoursesLoaded(() => {
    let coursePimper = new CoursePimper();
    coursePimper.update();
    coursePimper.insertControl();
    coursePimper.insertSettingsMenu();
});
