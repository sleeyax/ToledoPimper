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
     * Replace course cover images (or add new one if it doesn't exist yet)
     * @param {array} replacements
     */
    this.replaceCoverImages = function (replacements = {}) {
        $(".tol-tile-link").each(function () {
            addImageContainer(this);
            let courseName = $(this).find(".ng-binding").html();
            let coverImg = GM_getValue(courseName) !== undefined ? GM_getValue(courseName) : replacements[courseName];
            if (coverImg !== undefined) {
                $(this).find(".image-container").css("background", "rgba(255, 255, 255) url('" + coverImg + "') no-repeat scroll center center / cover");
                console.log("Replaced " + courseName + " img with " + coverImg);
            }
        });
    };

    /**
     * Add pimp link to course settings when it doesn't exist yet
     */
    this.insertControl = function () {
        if ($(".panel-body .col-md-push-6 #toledoPimper").length > 0) {
            return;
        }

        $(".panel-body .col-md-push-6").append('<h5 class="ng-binding" id="coursePimper">Course pimper</h5>');
        $(".panel-body .col-md-push-6 h5#coursePimper").append("<ul><li></li></ul>");
        let $control = $("<a>Change cover image</a>")
            .addClass("openCourseCoverImageChangerModal")
            .css("cursor", "pointer")
            .click(() => {
                console.log("course image cover changer modal opened");
                imageChangerModal.open();

                $("#imageChangerModalSaveBtn").on("click", () => {
                    let courseTitle = $(".panel-body dt.ng-binding:contains('Full title')").next().text();
                    GM_setValue(courseTitle, $("#imageLocationUrl").val());
                    imageChangerModal.close();
                    imageChangerModal.destroy();
                    console.log("course image cover changer modal closed");
                    this.replaceCoverImages();
                });
            });
        $(".panel-body .col-md-push-6 h5#coursePimper ul li").append($control);
    }
}