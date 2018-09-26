function CoursePimper() {
    /**
     * Add image container to the course if it doesn't exist yet
     * @param {object} element
     */
    let addImageContainer = function (element) {
        if ($(element).has(".image-container").length === 0) {
            $(element).prepend('<div class="image-container ng-scope"></div>');
        }
    };

    /**
     * Change single course
     * @param config
     * @param addImgContainer
     */
    this.updateSingle = function (config) {
        try {
            console.log(config);
            let course = $(".tol-tile-link").find("span.ng-binding[title='" + config.course + "']").parents("a.tol-tile-link");

            addImageContainer(course);

            if (config.hasOwnProperty("title") && config.title != null) {
                $(course).find("span.ng-binding").text(config.title);
                console.log("replaced " + config.course + " title with " + config.title);
            }

            if (config.hasOwnProperty("image") && config.image != null) {
                $(course).find(".image-container").css("background", "rgba(0, 0, 0, 0) url('" + config.image + "') no-repeat scroll center center / cover");
                console.log("replaced " + config.course + " img with " + config.image);
            }

        } catch (error) {
            console.error(error.message);
        }
    };

    /**
     * Modify all courses
     * @param config for all courses
     */
    this.update = function (config = undefined) {
        let self = this;

        // Loop over every course
        $(".tol-tile-link").each(function() {

            let courseName = $(this).find("span.ng-binding").text();

            // Read stored values & Update cover images
            self.updateSingle({
                "image": GM_getValue(courseName),
                "course": courseName
            });
        });

        // If config is specified, overwrite specific courses
        if (config !== undefined) {
            config.forEach((courseConfig) => {
                this.updateSingle(courseConfig);
            });
        }
    };

    /**
     * Add pimp link to course settings when it doesn't exist yet
     */
    this.insertControl = function () {
        if ($(".panel-body .col-md-push-6 #coursePimper").length === 1) {
            return;
        }

        $(".panel-body .col-md-push-6").append(
            '<h5 class="ng-binding" id="coursePimper">Course pimper</h5>' +
            '<ul><li><a id="coursePimperChangeCover" style="cursor: pointer;">Change cover image</a></a></li></ul>'
        );

        $("a#coursePimperChangeCover").on("click", () => {
            let imageChangerModal = new jBox('Modal', {
                attach: "#imageChangerModalSaveBtn",
                width: 500,
                height: 100,
                title: "Change cover image",
                content: GM_getResourceText("form"),
                closeButton: true
            });

            imageChangerModal.open();
            console.log("modal opened");

            $("button#imageChangerModalSaveBtn").on("click", () => {
                console.log("modal save btn clicked");

                let courseTitle = $(".panel-body dt.ng-binding:contains('Full title')").next().text();
                let imageLocation = $("#imageLocationUrl").val();

                if (imageLocation != null && imageLocation !== "") {
                    GM_setValue(courseTitle, imageLocation);

                    this.updateSingle({
                        "course": courseTitle,
                        "image": imageLocation
                    });
                }

                imageChangerModal.close();
                imageChangerModal.destroy();
                console.log("modal closed");
            });
        });
    }
}