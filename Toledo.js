function Toledo()
{
    /**
     * Wait for courses to update
     * @param {function} onCoursesLoadedCallback
     * @param {int} timesToCheck
     */
    this.onCoursesLoaded = function (onCoursesLoadedCallback, timesToCheck = 1)
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
     * Wait for settings panel to update when course settings button is clicked
     * @param {function} onCourseSettingsLoadedCallback
     */
    this.onCourseSettingsLoaded = function (onCourseSettingsLoadedCallback)
    {
        $(".tol-enrollment-links a.btn:nth-child(3)").click(function () {
            let panelLoadChecker = setInterval(() => {
                if ($(".panel-body .col-md-6").length > 0) {
                    clearInterval(panelLoadChecker);
                    console.log("settings panel loaded");
                    onCourseSettingsLoadedCallback();
                }
            }, 1000);
        });
    }
}