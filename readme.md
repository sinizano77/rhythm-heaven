#####NOTE THAT THIS PROJECT IS INCOMPLETE AND ON PAUSE CURRENTLY#####

Rhythm Heaven and all characters and music belong to Nintendo. This is merely
a personal project.

Coded, developed, with some assets created by sinizano77 and hcomet2062

--About--
This program allows "multiplayer" for the Nintendo Series of games, Rhythm Heaven, by
having each player take turns doing rhythm games which a point value is added to each
player's overall score. The player with the highest score wins. You need to already 
own the individual Rhythm Heaven games to actually play the rhythm games. This is 
merely a glorified randomizer with a point system.

--Why--
Well me and a few friends like to play Rhythm Heaven but it doesn't allow for a real 
group multiplayer (except for 2P in RH Fever and local Megamix), so we made a make 
shift program that could allow for all games in the series. It first started as an 
output to a console and eventually a front-end project. 
If you're asking why in a web app was because I (sinizano) wanted to get more practice 
with basic HTML and CSS. This should've probably been done from a game engine like 
Godot or Unity lol.

--Implementation--
The game's backend logic is written and pyfiles, while the frontend is written with
HTML and CSS (No current Frontend Framework), as well as JavaScript for communicating 
with the backend. This program utilizes Flask for web app development as a Framework, 
and Openpyxl as a way to read Excel file types because the database is currently held
within Excel files. We made it Excel files for now because it's easier for anyone to add,
modify, or delete games or data.

--Installation Steps--
1. Install Python (any Python 3 version) if you don't have it already
2. Install latest version of pip if you don't have it already
3. Install latest version of GitBash if you don't have it already
4. Open GitBash and cd into the directory/folder you want to install the program
5. In the folder/directory, run "git clone https://github.com/sinizano77/rhythm-heaven.git"
6. In the folder/directory, run "pip install Flask"
7. In the folder/directory, run "pip install Openpyxl"
8. Double click "rhm.py" or run it manually using a text editor (like VS code or IDLE which 
   came with python 3)
9. Copy paste "http://127.0.0.1:5000/", or whatever url in the console, in your browser 
   (preferably Google Chrome)
10. Enjoy and hope no errors happen. If you finish the game, reload from the url again to
    start another game.

--Steps on how to add/modify games--
1. In File Explorer (or your OS equivalent), navigate to the folder you cloned the repo
2. Keep clicking "rhythm-heaven" --> "static" --> "rhythm_games"
3. Click on an excel to modify or copy one of the existing Excel Sheets and rename it. 
   (You need to have an Excel subscription or you could open in Google sheets I think)
4. Modify or add contents for each column as well as a box color for your category type
   (reference one of the existing sheets to see as an example and DO NOT modify the 
   first row with all the titles)
5. OPTIONAL - If you want to add an image, drop the PNG in the "title_cards" folder or
   type in "no.png" if you don't have one (png should be at the weird pixel size of
   371x191)
6. OPTIONAL - If you made a new category that I didn't already make, go to the 
   "game_scoring" folder and modify the Excel Sheet and add the category name
   EXACTLY as it is typed in one of your rhythm games Excel sheets along with
   the color you made for it. Fill in the rest of the columns with the points.
   There are 5 category types: "Regular", "Challenge", "Endless", "Vs", "Starter". 
   Do not add modify or add more. Your game will most likely fall under "Regular"

--Known Issues--
* The pages are not responsive so it might not look well on certain devices.
  You might need to f12 and adjust the view to your liking for now.
* This program probably doesn't naturally work for MAC, but it _might_ be possible by editing
  the path variables in rhm.py to get rid of the extra '/' in the path variables that Windows
  needs.
* Some game modes and options don't work 
* Some categories and category types don't work, so omit them when selecting game categories. 
  Here are the categories and category types that do not work: 
   - Category types: Challenge, Endless, Vs, Starter
   - Categories: Endless (Fever), Endless (Megamix), Challenge (Megamix)

If the program crashes or you get an error screen. Reload the page again with the copy paste
url.

--Future Plans--
- Redo the front end in React or Angular
- Make the pages responsive
- Make a proper local database for all games, scoring, etc
  - Make game adding and scoring, done from a web page rather than Excel files.
- Finish the categories and categories types that are known to crash
- Make it MAC usable (Linux too if it doesn't work either) 