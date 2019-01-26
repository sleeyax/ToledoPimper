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

    this.insertSettingsMenu = function () {
        $("div#tol-filter-bar ul.dropdown-menu").append("<li><a class='ng-binding' id='openPimperSettingsModal' style='cursor: pointer;'>Toledo pimper</a></li>");

        $("div#tol-filter-bar ul.dropdown-menu li a#openPimperSettingsModal").on("click", () => {
            let settingsModal = new jBox('Modal', {
                width: 500,
                height: 300,
                title: "Toledo pimper settings",
                content: GM_getResourceText("settings"),
                overlay: true,
                onCloseComplete: function() {
                    settingsModal.close();
                    settingsModal.destroy();
                }
            });
            settingsModal.open();

            $("#coursePimperExportConfigBtn").on("click", () => {
                let config = this.export();
                $("#coursePimperConfigInput").val(JSON.stringify(config));
            });

            $("#coursePimperImportConfigBtn").on("click", () => {
                let configStr = $("#coursePimperConfigInput").val();
                this.import(JSON.parse(configStr));
                location.reload(true);
            });

            $("#coursePimperDeleteConfigBtn").on("click", () => {
                this.delete();
                location.reload(true);
            });
        });
    };

    /**
     * Delete stored config
     */
    this.delete = function() {
        GM_listValues().forEach(function (key) {
            GM_deleteValue(key);
        });
    };

    /**
     * Import and store config from an array
     * @param config
     */
    this.import = function (config) {
        Object.keys(config).forEach(function(key){
            GM_setValue(key, config[key]);
        });
    };

    /**
     * Export stored config to an array
     */
    this.export = function() {
        let config = {};
        GM_listValues().forEach(function (key) {
            config[key] = GM_getValue(key);
        });
        return config;
    };

    /**
     * Change single course
     * @param config
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

    this.getRandomCat = function(callback) {
        $.get("https://api.thecatapi.com/v1/images/search?", (data) => {
            return callback(data[0].url);
        });
    };

    this.catify = function() {
        let self = this;

        $(".tol-tile-link").each(function() {
            let courseName = $(this).find("span.ng-binding").text();
            self.getRandomCat(function (catUrl) {
                self.updateSingle({
                    "image": catUrl,
                    "course": courseName
                });
            });
        });
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
     * Add edit button to course
     */
    this.insertControl = function () {
        $(".tol-enrollment-favorite").append('<a href="#" class="tp-changeCover" role="button" title="Mark as favorite"><span class="sr-only ng-binding">Change cover image</span><span class="glyphicon glyphicon-pencil"></span></a>');
        let self = this;

        $(".tp-changeCover").on("click", function() {
            let courseTitle = $(this).parent().parent().find("h5.tol-enrollment-label").text().trim();
            let imageChangerModal = new jBox('Modal', {
                attach: "#imageChangerModalSaveBtn",
                width: 500,
                height: 100,
                title: "Change cover image",
                content: GM_getResourceText("modal"),
                closeButton: true,
                onCloseComplete: function() {
                    console.log("modal onCloseComplete event fired");
                    imageChangerModal.destroy();
                }
            });
            imageChangerModal.open();
            console.log("modal opened");

            $("button#imageChangerModalSaveBtn").on("click", () => {
                console.log("modal save btn clicked");
                let imageLocation = $("#imageLocationUrl").val();
                if (imageLocation != null && imageLocation !== "") {
                    GM_setValue(courseTitle, imageLocation);
                    self.updateSingle({
                        "course": courseTitle,
                        "image": imageLocation
                    });
                }

                imageChangerModal.close();
                imageChangerModal.destroy();
                console.log("modal closed");
            });
        });
    };
}