function CoursePimper() {

    /**
     * Insert required CSS for the script to work
     */
    this.inject = function()
    {
        // Hide default image container & that annoying circle thing no one cares about
        let stylesheet = ".tol-enrollments-tiles .tol-enrollment-container .tol-enrollment .wrapper::before, " +
            ".tol-tile-link .image-container" +
            "{display: none;}\n";

        // Add our own image container
        stylesheet += "a.tol-tile-link::after {" +
            "content: '';" +
            "display: block;" +
            "height: 110px;" +
            "position: relative;" +
            "width: 100%;" +
            "overflow: hidden" +
            "border-top-left-radius: 3px;" +
            "border-top-right-radius: 3px;" +
            "}\n";

        GM_addStyle(stylesheet);
    };

    /**
     * Change course cover images
     * @param overwiteConfig to overwrite specific course images manually
     */
    this.update = function(overwiteConfig = undefined) {
        let stylesheet = "";

        // Set cover images
        GM_listValues().forEach(function (key) {
            stylesheet += "a[title='" + key + "']::after {" +
                "background: rgba(0, 0, 0, 0) url('" + GM_getValue(key) + "') no-repeat scroll center center / cover;" +
                "}\n";
        });

        if (overwiteConfig !== undefined) {
            console.log("a");
            overwiteConfig.forEach((config) => {
                stylesheet +=  "a[title='" + config.course + "']::after {background: rgba(0, 0, 0, 0) url('" + config.image + "') no-repeat scroll center center / cover !important;} \n";
            });
        }

        GM_addStyle(stylesheet);
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
     * Change single course after they are loaded
     * @param config
     */
    this.updateSingle = function (config) {
        console.log(config);

        if (config.hasOwnProperty("title") && config.title != null) {
            let course = $(".tol-tile-link").find("span.ng-binding[title='" + config.course + "']").parents("a.tol-tile-link");
            $(course).find("span.ng-binding").text(config.title);
            console.log("replaced " + config.course + " title with " + config.title);
        }

        if (config.hasOwnProperty("image") && config.image != null) {
            let stylesheet = "a[title='" + config.course + "']::after {" +
                "background: rgba(0, 0, 0, 0) url('" + config.image + "') no-repeat scroll center center / cover;" +
                "}\n";
            GM_addStyle(stylesheet);
            console.log("replaced " + config.course + " img with " + config.image);
        }
    };

    let getRandomCat = function(callback) {
        $.get("https://api.thecatapi.com/v1/images/search?", (data) => {
            return callback(data[0].url);
        });
    };

    this.catify = function() {
        let self = this;

        $(".tol-tile-link").each(function() {
            let courseName = $(this).find("span.ng-binding").text();
            getRandomCat(function (catUrl) {
                self.updateSingle({
                    "image": catUrl,
                    "course": courseName
                });
            });
        });
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