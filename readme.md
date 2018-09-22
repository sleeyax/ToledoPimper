# ToledoPimper
Remove that boring toledo (KU Leuven) look and have some fun! Inspired by [toledomod](https://github.com/Sigurd3K/ToledoMod).

# Features
- Change course cover images (gifs work too!)

# Installation
Install using your favorite userscript manager. ([Read more about userscripts here](https://greasyfork.org/en)). 
Generally speaking, you can use the code in 2 different ways to change the covers.
## Method 1
Using code only:
```
let toledo = new Toledo();
toledo.onCoursesLoaded(() => {
    let pimper = new CoursePimper();
    pimper.replaceCourseCoverImages({
        "Course name 1 [Z12345]": "https://i.imgur.com/hnA7X9y.jpg",
        "Course name 2 [Z678910]": "https://i.imgur.com/bEurifB.jpg"
    });
}); 
```
Cover images will be statically updated.
## Method 2
By inserting a graphical control:
```
let toledo = new Toledo();
toledo.onCoursesLoaded(() => {
    let pimper = new CoursePimper();
    pimper.replaceCourseCoverImages();
    toledo.onCourseSettingsLoaded(() => {
        pimper.enablePimpSettings();
    });
});
```
This will add a link to your course settings panel:
![Screenshot](https://i.imgur.com/F9kqC9e.png)

# Screenshots


# More
Looking for a [dark theme](https://userstyles.org/styles/148080/toledo-dark-theme)?