# ToledoPimper
Remove that boring toledo (KU Leuven) look and have some fun! Inspired by [toledomod](https://github.com/Sigurd3K/ToledoMod).

# Features
- CoursePimper
    - Change course cover images (gifs work too!)
    - Change course titles

# Installation
Install using your favorite userscript manager. ([Read more about userscripts here](https://greasyfork.org/en)). 

# Examples
## CoursePimper
### Code only
```
let toledo = new Toledo();
toledo.onCoursesLoaded(() => {
    let pimper = new CoursePimper();
    pimper.load([
        {
            "course": "course name 1",
            "image": "https://i.imgur.com/c7GOFJv.jpg",
        },
        {
           "course": "course name 2",
           "title": "my much better custom course title"
        },
        {
           "course": "course name 3",
           "image": "https://i.imgur.com/c7GOFJv.jpg",
           "title": "my much better custom course title"
        },
    ]);                                
}); 
```
### Insert graphical control
```
let toledo = new Toledo();
toledo.onCoursesLoaded(() => {
    let pimper = new CoursePimper();
    pimper.load();
    toledo.onCourseSettingsLoaded(() => {
        pimper.insertControl();
    });
});
```
This will add a link to your course settings panel:
![Screenshot](https://i.imgur.com/F9kqC9e.png)


### Combined
Of course you can combine the two methods above, but note that the code only method will always overwrite the graphical control settings.

# Screenshots
![Screenshot 2](https://i.imgur.com/VYosZwV.png)

# More
Looking for a [dark theme](https://userstyles.org/styles/148080/toledo-dark-theme)?