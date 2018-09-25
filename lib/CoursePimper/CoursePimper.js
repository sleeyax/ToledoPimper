function CoursePimper() {
    /**
     * Add image container to the course if it doesn't exist yet
     * @param {object} element
     */
    let addImageContainer = function (element) {
        if ($(element).has(".image-container").length == 0) {
            $(element).prepend('<div class="image-container ng-scope"></div>');
        }
    };

    /**
     * Course cover image changer modal
     */
    var imageChangerModal = new jBox('Modal', {
        delayOpen: 500,
        delayClose: 1000,
        width: 500,
        height: 100,
        title: "Change cover image",
        content: GM_getResourceText("form"),
        closeButton: true
    });

    /**
     * Modify courses
     * @param {array} config
     */
    this.load = function (config = undefined) 
    {
        $(".tol-tile-link").each(function () {
            addImageContainer(this);
            
            let courseName = $(this).find("span.ng-binding").html();
            let courseImg = GM_getValue(courseName);

            // Read settings from json config
            if (config !== undefined) {
                config.forEach((courseConfig) => {
                    try {
                        if (courseName == courseConfig.course) {
                            if (courseConfig.hasOwnProperty("image")) {
                                courseImg = courseConfig.image;
                            }

                            // Can replace course title with something custom
                            if (courseConfig.hasOwnProperty("title")) {
                                $(this).find("span.ng-binding").html(courseConfig.title);
                                console.log("replaced " + courseName + " name with " + courseConfig.title);
                            }
                        }
                    }catch (err) {
                        console.log(err.message);
                    }
                });
            }

            if (courseImg !== undefined) {
                $(this).find(".image-container").css("background", "rgba(255, 255, 255) url('" + courseImg + "') no-repeat scroll center center / cover");
                console.log("Replaced " + courseName + " img with " + courseImg);
            }
        });
    };

    /**
     * Add pimp link to course settings when it doesn't exist yet
     */
    this.insertControl = function () {
        if ($(".panel-body .col-md-push-6 #coursePimper").length === 1) {
            return;
        }

        $(".panel-body .col-md-push-6").append('<h5 class="ng-binding" id="coursePimper">Course pimper</h5>');
        $(".panel-body .col-md-push-6 h5#coursePimper").append("<ul><li></li></ul>");
        let $control = $("<a>Change cover image</a>")
            .addClass("openCourseCoverImageChangerModal")
            .css("cursor", "pointer")
            .on("click", () => {
                imageChangerModal.open();
                console.log("course image cover changer modal opened");

                $("#imageChangerModalSaveBtn").on("click", () => {
                    let courseTitle = $(".panel-body dt.ng-binding:contains('Full title')").next().text();
                    GM_setValue(courseTitle, $("#imageLocationUrl").val());
                    imageChangerModal.close();
                    imageChangerModal.destroy();
                    console.log("course image cover changer modal closed");
                    this.load();
                });
            });
        $(".panel-body .col-md-push-6 h5#coursePimper ul li").append($control);
    }
}