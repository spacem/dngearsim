# dngearsim - Dragon Nest Gear Simulator

In case you came here looking to use the sim here is a link:
https://dngearsim.netlify.com

Also check out my dnt viewer that is hosted here:
https://dntviewer.netlify.com/

In the rest of this readme I will discuss the architecture of dngearsim.
If you want to help with development please feel free to contact me via discord.
Here is my discord server: https://discord.gg/011C92KwJWoCfRcEY

## History
I wanted an app that is usable on mobile but I didn’t want hosting costs.
My idea was to use static html/javascript pages which could be hosted on free hosting (ie. github pages).

## Development environment
* Install node.js, git and an editor (eg. visual studio code)
* Open command prompt
* git clone https://github.com/spacem/dngearsim.git
* cd dngearsim
* npm install

## Starting development
* npm start
* Now browse to http://localhost:8080/dngearsim
* Open the dngearsim folder in your ide to begin development
* When you save you should notice the browser refresh
* For unit tests browse to http://localhost:8080/dngearsim/tests/test.html

## Data
I don’t use a database - as such.
Your data when you use the sim is simply compressed and stored in the browser local storage.
The data from the game is read directly from optimised versions of the games data files.
These are mostly the same files that are used by dntviewer however to speed up the sim a little I have a script that preprocesses some of them and saves them with the extension .optimised.json.

## Code Structure
The ui folder contains subfolders for each screen and a folder called widgets which has controls shared between the screens.
Each screen is split into several controls and each control has a html template file and js controller file.
There is a simple gulp script that combines all the html files so they can be loaded into the template cache at the start.
The index/index.html is the main layout and it presents some fixed controllers such as navigation and regions as well as presenting the routes to each screen which are configured in app.js.
Most logic for the sim is separated from the ui into the javascript files in the services folder.
So that the site will work in html5mode on github pages there are several sym links to the index.html file.

## Loading Data
Location of datafiles is stored in regionService.js.
When we change region all data is reset via DntResetService and will be reloaded when required from the new location.
Raw data is accessed via either TranslationsService for translations or DntDataService for dnt data.
Additionally certain dnt tables are wrapped up in their own services for example JobService and CharacterService.

## Item Data
I tried to split up certain item types based on the files they come from in ItemSourceService.
There is not an exact mapping to the categories used in the sim so I also use ItemCategoryService which has configuration on each category.
Items are built from data from several dnt files by ItemFactoryService and an in-memory list of pre-built items is stored in ItemSourceService to allow for faster searching.

## Stats and Hardcoded Values
StatService has calculations for stats however mappings of the stat to its id is inside ValueService.
ValueService also has other hardcoded values for example definition of pre-defined custom stats, mappings from skill states to their equivalent stats, names of item grades, etc.

## Links to Builds and Items
To allow users to share links to items and builds I encode the minimum required details of these into the url.
This encoding (and the decoding) is done through ItemLinkService.

## Saving a Build
SaveService has most of the code used to save, load and update builds, etc.
This service stringifies javascript objects to json and then compresses them before saving to the browser localStorage.

## Deploying Data Files
Data files for each region are uploaded to separate firebase hosting sites each with CORS enabled.
This allows regions to be updated separately from the sim or from each other.
Potentially they could go anywhere - even to the same location as dngearsim just as long as RegionService.js has the correct url to the locations.
In theory you can deploy vanilla dnt files however you will need to adjust the file names in ItemSourceService as most files deployed use optimised versions.
There are a set of scripts in a separate dntpreprocess project that create the optimised files as well as a few extra files.
