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
                $(this).find(".image-container").css("background", "rgba(255, 255, 255) url('" + coverImg + "') no-repeat scroll center center / cover");
                console.log("Replaced " + courseName + " img with " + coverImg);
            }
        });
    };

    this.enablePimpSettings = function () {
        // Insert pimp link when it doesn't exist yet
        if ($(".panel-body .col-md-push-6 #toledoPimper").length == 0) {
            $(".panel-body .col-md-push-6").append('<h5 id="toledoPimper">Toledo pimper</h5><ul><li><a class="openCourseCoverImageChangerModal" style="cursor: pointer;">Change cover image</a></li></ul>');
        }

        // Open img changer modal when user clicks the pimp link
        $(".panel-body .col-md-push-6 .openCourseCoverImageChangerModal").on("click", () => {
            console.log("course image cover changer modal opened");
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
            $("#imageChangerModalSaveBtn").on("click", () => {
                let courseTitle = $(".panel-body dt.ng-binding:contains('Full title')").next().text();
                GM_setValue(courseTitle, $("#imageLocationUrl").val());
                imageChangerModal.close();
                imageChangerModal.destroy();
                console.log("course image cover changer modal destroyed");
                this.replaceCourseCoverImages();
            });
        });
    }
}