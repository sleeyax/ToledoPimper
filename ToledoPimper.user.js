// ==UserScript==
// @name		ToledoPimper
// @namespace	ToledoPimper
// @description	Make toledo less boring
// @author		Sleeyax
// @include		*toledo.kuleuven.be/portal*
// @version		1.4
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require		inc/jBox.js
// @require	    Toledo.js
// @require     Pimper.js
// @require	    lib/CoursePimper/CoursePimper.js
// @resource	jBoxCSS inc/jBox.css
// @resource	form lib/CoursePimper/form.html
// @grant		GM_addStyle
// @grant		GM_getResourceText
// @grant		GM_setValue
// @grant		GM_getValue
// ==/UserScript==

// --DO NOT DELETE--
GM_addStyle(GM_getResourceText("jBoxCSS"));
// ----

let toledo = new Toledo();

toledo.onCoursesLoaded(() => {
    (new Pimper()).insertMenu();

    let coursePimper = new CoursePimper();
    coursePimper.update([
        {
            "course": "Frans [Z60286]",
            "title" : "Je ne comprend pas"
        }
    ]);

    toledo.onCourseSettingsLoaded(() => {
        coursePimper.insertControl();
    });
});
