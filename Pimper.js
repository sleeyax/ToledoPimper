function Pimper()
{
    /**
     * Add the pimper settings menu modal to the settings menu
     * @param callback
     */
    this.insertSettingsMenu = function (callback = undefined) {
        $("div#tol-filter-bar ul.dropdown-menu").append("<li><a class='ng-binding' id='openPimperSettingsModal' style='cursor: pointer;'>Toledo pimper</a></li>");

        $("div#tol-filter-bar ul.dropdown-menu li a#openPimperSettingsModal").on("click", function() {
            let settingsModal = new jBox('Modal', {
                width: 500,
                height: 300,
                title: "Toledo pimper settings",
                content:  GM_getResourceText("pimper_modal"),
                overlay: true,
                onCloseComplete: function() {
                    settingsModal.close();
                    settingsModal.destroy();
                }
            });
            settingsModal.open();

            if (callback !== undefined) {
                callback("#pimperSettingsMenuModal");
            }
        });
    };
}