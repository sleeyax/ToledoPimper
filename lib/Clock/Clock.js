function Clock()
{
    /**
     * Insert panel
     */
    this.insert = function() {
        $("#tol-upcoming").before("<div class='panel panel-default'><div class='panel-heading tol-panel-title'>Clock</div><div class='panel-body' id='clockbox'>Loading...</div></div>");

        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        setInterval(function() {
            let date = new Date();

            let minutes = date.getMinutes();
            let seconds = date.getSeconds();
            if (minutes <= 9) minutes = "0" + minutes;
            if (seconds <= 9) seconds = "0" + seconds;

            $("#clockbox").html(
                days[date.getDay()] + " " +
                date.getDate() + " " +
                months[date.getMonth()] + " " +
                date.getFullYear() + " - " +
                date.getHours() + ":" + minutes + ":" + seconds + ""
            );
        }, 1000);
    }
}