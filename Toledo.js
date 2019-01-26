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
}