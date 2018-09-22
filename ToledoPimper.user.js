// ==UserScript==
// @name		ToledoPimper
// @namespace	ToledoPimper
// @description	Make toledo less boring
// @author		Sleeyax
// @include		*toledo.kuleuven.be/portal*
// @version		1.0
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require		libs/jBox.js
// @resource	jBoxCSS libs/jBox.css
// @resource	form form.html
// @grant		GM_addStyle
// @grant		GM_getResourceText
// @grant		GM_setValue
// @grant		GM_getValue
// ==/UserScript==

GM_addStyle(GM_getResourceText("jBoxCSS"));

function Toledo() 
{
    /**
     * Wait for courses to load
     * @param {function} onCoursesLoadedCallback
     * @param {int} timesToCheck 
     */
    this.onCoursesLoaded = function (onCoursesLoadedCallback, timesToCheck = 3) 
    {
        let coursesCount = 0;
        let coursesLoadedChecker = setInterval(() => {
            let currentCoursesCount = $(".tol-tile-link").length;
            
            if (currentCoursesCount > coursesCount) {
                coursesCount = currentCoursesCount;
            }else if(currentCoursesCount > 0 && currentCoursesCount == coursesCount){
                timesToCheck--;
            }

            if (timesToCheck <= 0) {
                clearInterval(coursesLoadedChecker);
                console.log("all courses are loaded!");
                onCoursesLoadedCallback();
            }
        }, 1000);
    };

    /**
     * Wait for settings panel to load when course settings button is clicked
     * @param {function} onCourseSettingsLoadedCallback
     */
    this.onCourseSettingsLoaded = function (onCourseSettingsLoadedCallback)
    {
        $(".btn-link[title='Information and settings']").click(function () { 
            let panelLoadChecker = setInterval(() => {
                if ($(".panel-body .col-md-6").length > 0) {
                    clearInterval(panelLoadChecker);
                    console.log("settings panel loaded");
                    onCourseSettingsLoadedCallback();
                }
            }, 1000);
        });
    }
};


function CoursePimper()
{
    /**
     * Add image container to the course if it doesn't exist yet
     * @param {object} element
     */
    let addImageContainer = function(element)
    {
        if ($(element).has(".image-container").length == 0) {
            $(element).prepend('<div class="image-container ng-scope"></div>');
        }
    };

    /**
     * Replace course cover images (or add new one if there it doesn't exist yet)
     * @param {array} replacements 
     */
    this.replaceCourseCoverImages = function(replacements = {})
    {
        $(".tol-tile-link").each(function() {
            addImageContainer(this);
            let courseName = $(this).find(".ng-binding").html();
            let coverImg = GM_getValue(courseName) !== undefined ? GM_getValue(courseName) : replacements[courseName];
            if (coverImg !== undefined) {
                $(this).find(".image-container").css("background", "rgba(0, 0, 0, 0) url('" + coverImg + "') no-repeat scroll center center / cover");
                console.log("Replaced " + courseName + " img with " + coverImg);
            }
        });
    };

    this.enablePimpSettings = function () {
        // Insert pimp link when it doesn't exist yet
        if ($(".panel-body .col-md-push-6 #toledoPimper").length == 0) {
            $(".panel-body .col-md-push-6").append('<h5 id="toledoPimper">Toledo pimper</h5><ul><li><a href="#" class="openCourseCoverImageChangerModal">Change cover image</a></li></ul>');
        }

        // Open img changer modal when user clicks the pimp link
        $(".panel-body .col-md-push-6 .openCourseCoverImageChangerModal").on("click", () => {
            let imageChangerModal = new jBox('Modal', {
                delayOpen: 500,
                delayClose: 1000,
                width: 500,
                height: 100,
                title: "Change cover image",
                content: GM_getResourceText("form"),
                closeButton: true
            });
            imageChangerModal.open();
            $("#imageChangerModalSaveBtn").click(() => {
                let courseTitle = $(".panel-body dt.ng-binding:contains('Full title')").next().text();
                GM_setValue(courseTitle, $("#imageLocationUrl").val());
                imageChangerModal.close();
                imageChangerModal.destroy();
                this.replaceCourseCoverImages();
            });
        });
    }
}

let toledo = new Toledo();

toledo.onCoursesLoaded(() => {
    let pimper = new CoursePimper();
    pimper.replaceCourseCoverImages();
    toledo.onCourseSettingsLoaded(() => {
        pimper.enablePimpSettings();
    });
});

