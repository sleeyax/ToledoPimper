// ==UserScript==
// @name		ToledoPimper
// @namespace	ToledoPimper
// @description	For a less boring toledo experience
// @author		Sleeyax
// @include		*toledo.kuleuven.be/portal*
// @version		2.0
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require		inc/jBox.js
// @require     Pimper.js
// @require	    Toledo.js
// @require	    lib/CoursePimper/CoursePimper.js
// @require	    lib/Clock/Clock.js
// @resource	jBoxCSS inc/jBox.css
// @resource	coursepimper_modal lib/CoursePimper/coursepimper_modal.html
// @resource	coursepimper_settings lib/CoursePimper/coursepimper_settings.html
// @resource	pimper_modal pimper_modal.html
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
    let clock = new Clock();
    clock.insert();

    let coursePimper = new CoursePimper();
    coursePimper.update();

    toledo.onCourseSettingsLoaded(() => {
        coursePimper.insertControl();
    });

    let pimper = new Pimper();
    pimper.insertSettingsMenu(function(elemToAppend) {
        coursePimper.updatePimperSettingsMenu(elemToAppend);
    });
});
