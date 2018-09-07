# WDI-Project1
# General Assembly Project 1 : Simple front-end game

## Goal: To create a single page game

## Technologies used

* HTML5 + HTML5 Audio
* CSS + CSS Animation
* Javascript (ES6) + jQuery
* GitHub

## My Game - Deep Sea Dive

![Deep Sea Dive](https://user-images.githubusercontent.com/40343797/45214662-fc243200-b292-11e8-9c52-5a1053aa8c0a.png)


### Game overview
Deep Sea Dive is a one person game inspired by the French conservationist and filmmaker Jacques Cousteau. The aim is to capture as many specimen of sea life and return to the surface before the air supply runs out.

The player controls the movement of a submarine in order to capture the fish and avoid underwater mines.


### Controls
- Submarine movements: ← ↑ → ↓ keys
- Start game: "Start" button or pressing "D"
- End game: "End Game" button or pressing "S"
- Toggle mute: Speaker Icon or pressing "Q"

### Game Instructions
1. The game begins with a welcome modal introducing the aim of the game. The game is started by clicking on the "Start" button or by pressing "D".

![screenshot - Start Modal](https://user-images.githubusercontent.com/40343797/45220826-6777ff00-b2a7-11e8-8511-8a5f00bc0b74.png)

2. Once the game begins, there is short animation of a boat entering onto the screen and the player's submarine appears below the boat. Once the submarine appears, it can be controlled by the player.

![screenshot - Beginning position](https://user-images.githubusercontent.com/40343797/45220870-8ececc00-b2a7-11e8-804a-c271278a428f.png)

3. Points are gained when the submarine is moved into a fish/marine life. This 'captures' the specimen. The fishes are randomly spawned and each have there own movement patterns. Different types of fish are spawned at different levels and at different frequencies. Generally the fish with higher score values are only spawned at the lower depths and spawned less frequently.

![screenshot - Fish types](https://user-images.githubusercontent.com/40343797/45220971-e53c0a80-b2a7-11e8-9942-714db52793d9.png)

4. If the submarine moves into an underwater mine, the mine will explode. This deducts an amount from your Air Supply.

![screenshot - Mines](https://user-images.githubusercontent.com/40343797/45220908-b4f46c00-b2a7-11e8-9460-2a4dee40d0ae.png)

5. Your Air Supply is shown in the air tank on the left of the screen. You must return to the surface before the Air Supply runs out. Failure to return to the surface before the Air Supply runs out will result in the game ending and any points gained being lost. A warning is given when your Air Supply is running low.

![screenshot - End Modal Successful](https://user-images.githubusercontent.com/40343797/45221008-04d33300-b2a8-11e8-999e-62b50286c8ec.png)

### Process

The starting point for this game was creating the basic grid layout on which the submarine could move. This was created by a list of 'div's in the html, each cell within the grid being a individual element. These cells are nestled within a container. The submarine, and fish were created by applying classes to the elements within the grid. When the submarine or fish is moved, their class is removed from the cell of their current position and applied to the new cell.

I created fish as objects containing their points value, an array of their movement patterns, their age and the class which is being applied to the cell that they are in. The class relates to a css class with a corresponding background image of the fish type. When a fish is created it is added to an array of fish in play.

While the game is running, a function runs through the array of fish in play and moves each fish the corresponding amount within their movement patterns.

A function was also created which checks if a fish has been caught. This runs through the array of fish in play to check if its location is the same of that of the submarine. If it has been caught, it is removed from the array of fish in play and its corresponding points value to added to the player's score.

Once I had this mechanics working, I worked on adding timer countdown which displayed as an air supply within an air tank. The height of the air supply element is a proportion of the amount of time left.

I then moved onto the task of allowing the position of the submarine to control the scrolling the view of the grid. This also required stoping the default behaviour of controls to prevent the user from scrolling through the grid to a position where the submarine was not visible.

As the game continued to develop I created a fish constructor function which created the fish objects and also contained the method which allowed the fish to move. I had initially also created a method which allowed the fish, when they were caught or swam off screen, to be removed from the fish in played array and remove their classes from the grid. However, I later changed this to a key within the fish which specified whether the fish was active or not. During the game, a function now runs through the array of fish in play and removes any fish which have been set to no longer active.

The final significant element was creating an variable which specified whether the submarine was at the top of the surface or not when the air supply had reached zero. I created a modal with content which varied depending on whether the player had returned to the surface by the end of the game.

### Challenges

This game involves quite a lot of different things going on at the same time. It was a challenge to make the gaming mechanics were being being timer correctly. It was also important that I created a code logic that could cope with expanding numbers of different fish characters.

There were several tricky tasks including the scrolling of the grid being controlled by the submarine and the animation of the fish.

### Wins

Creating cascading animations and sounds really helped the game come alive and gave me more creative control over the feel of the play. I invested a lot of time in the stying of the game, particularly the animations and air supply tank to give them a consistent and professional feel.

## Future features

If I had more time, I would like to try and make the game playable on mobile. I would need to make a button panel that would appear on a touch device to replace the keyboard inputs.

Different levels could be added to the game with different patterns of mine positioning and different fish spawning at different depths.

I would also like to improve the animations of the submarine (such as adding bubbles/ending movements when moving) and improving the animations of the fish, particularly in allowing them to move diagonally.
