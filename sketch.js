/*

The Game Project Final

*/


//Extension - Platforms
//The platform floats above the ground and can be stood on and jumped off of.  The game character can jump from one platform to another and can stand on it to avoid falling into the canyon.  I found it difficult to keep track of the game character's isContact state because I chose to implement it as a variable whose value changes globally instead of having it reset when a conditional is met (like in the tutorial).  In addition to practicing keeping track of a variable state that interacts with other states like falling, I learned how to modify or mutate an array.

//Extension - Enemy
//The enemy emojis are game characters that interact with the player's character upon touching (standing within a certain distance of) the player.  I found it difficult to keep track of which variable I wanted to refer to, which gave me several errors to fix.  I realize why it is important to have descriptive variable names and how useful it is to follow naming conventions--even though this project is for me, just following consistent naming rules helps me mentally keep track of things when there's a lot going on.  For example, when I wrote this code at first, I reused a variable name 'isContact' which gave me unexpected behaviors like the inability to jump off platforms.  I fixed that by renaming the variable to 'touch'. This extension tought me how to implement a constructor function and also learned how to use the 'new' keyword to instantiate an object.


//Thanks UoL team for making such a fun assignment!  I really enjoyed the peer grading too because my more experienced classmates inspired me with how they built impressive things with the same simple implementations as me.


var gameChar_x
var gameChar_y
var floorPos_y
var scrollPos
var gameChar_world_x

var isLeft
var isRight
var isFalling
var isPlummeting

var trees_x
var mountains
var clouds
var collectables
var canyons

var game_score
var lives
var flagpole = { isReached: false, x_pos: 2700 }

var isContact = false;

var enemies;

function setup () {
  createCanvas(1024, 576)
  floorPos_y = height * 3 / 4
  lives = 3

  // Begins new round of the game
  startGame()
}

function draw () {
  background(100, 155, 255) // fill the sky blue

  noStroke()
  fill(0, 155, 0)
  rect(0, floorPos_y, width, height / 4) // draw some green ground

  // side scrolling
  push()
  translate(scrollPos, 0)

  // Draw clouds.
  drawClouds()
  // Draw mountains.
  drawMountains()
  // Draw trees.
  drawTrees()

  // Draw platforms
  for (var i = 0; i < platforms.length; i++) {
    platforms[i].draw()
  }

  // Draw canyons.
  for (var i = 0; i < canyons.length; i++) {
    drawCanyon(canyons[i])

    if (isPlummeting == true) {
      gameChar_y += 2
    }

    checkCanyon(canyons[i])
  }

  // Draw collectable items.
  for (var i = 0; i < collectables.length; i++) {
    if (collectables[i].isFound == false) {
      drawCollectable(collectables[i])

      checkCollectable(collectables[i])
    }
  }
    
  //Draw Enemy
  for(var i = 0; i < enemies.length; i++){
      enemies[i].draw()
      
      var touch = enemies[i].checkContact(gameChar_world_x, gameChar_y)
          
      if(touch){
          if(lives > 0){
              lives--
              startGame();
              break;
          }
      }
  }

  // Draws flagpole
  renderFlagpole()

  // Checks if game character falls down the canyon
  checkPlayerDie()

  // side scrolling
  pop()

  // Draw life tokens.
  drawLifeTokens()

  // Draw game character.

  drawGameChar()

  // Draw game score
  fill(255)
  noStroke()
  text('score: ' + game_score, 20, 20)
  text('lives: ' + lives, 20, 40)

  if (lives < 1) {
    fill(255, 0, 0)
    text('Game Over! Press space to continue.', width / 2, 60)
    return
  }

  if (flagpole.isReached == true) {
    fill(207, 151, 59)
    text('Level complete. Press space to continue.', width / 2, 60)
    return
  }

  // Logic to make the game character move or the background scroll.
  if (isLeft) {
    if (gameChar_x > width * 0.2) {
      gameChar_x -= 5
    } else {
      scrollPos += 5
    }
  }

  if (isRight) {
    if (gameChar_x < width * 0.8) {
      gameChar_x += 5
    } else {
      scrollPos -= 5 // negative for moving against the background
    }
  }

  // Logic to make the game character rise and fall.
  if (gameChar_y < floorPos_y) {
    isContact = false

    for (var i = 0; i < platforms.length; i++) {
      if (platforms[i].checkContact(gameChar_world_x, gameChar_y)) {
        isContact = true
        break
      }
    }

    if (isContact == false) {
      gameChar_y += 2
      isFalling = true
    }
  } else {
    isFalling = false
  }

  if (flagpole.isReached == false) {
    checkFlagpole()
  }

  // Update real position of gameChar for collision detection.
  gameChar_world_x = gameChar_x - scrollPos
}

// ---------------------
// Key control functions
// ---------------------

function keyPressed () {
  if (keyCode == 37) {
    console.log('left arrow')
    isLeft = true
  } else if (keyCode == 39) {
    console.log('right arrow')
    isRight = true
  } else if (keyCode == 32 && (gameChar_y == floorPos_y || isContact == true)) {
    console.log('spacebar')
    gameChar_y -= 100
  }
}

function keyReleased () {
  if (keyCode == 37) {
    console.log('left arrow')
    isLeft = false
  } else if (keyCode == 39) {
    console.log('right arrow')
    isRight = false
  }
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar () {
  // draw game character
  if (isLeft && isFalling) {
    // add your jumping-left code
    fill(0)
    ellipse(gameChar_x, gameChar_y - 60, 20, 20)
    stroke(0)
    line(gameChar_x, gameChar_y - 30, gameChar_x, gameChar_y - 55)
    line(gameChar_x - 15, gameChar_y - 45, gameChar_x + 15, gameChar_y - 45)
    line(gameChar_x, gameChar_y - 30, gameChar_x - 5, gameChar_y)
    line(gameChar_x, gameChar_y - 30, gameChar_x + 5, gameChar_y)
    stroke(255, 0, 0)
    line(gameChar_x + 15, gameChar_y - 60, gameChar_x + 15, gameChar_y - 20)
    fill(255, 0, 0)
    triangle(gameChar_x + 15, gameChar_y - 62, gameChar_x + 13,
      gameChar_y - 58, gameChar_x + 17, gameChar_y - 58)
  } else if (isRight && isFalling) {
    // add your jumping-right code
    fill(0)
    ellipse(gameChar_x, gameChar_y - 60, 20, 20)
    stroke(0)
    line(gameChar_x, gameChar_y - 30, gameChar_x, gameChar_y - 55)
    line(gameChar_x - 15, gameChar_y - 45, gameChar_x + 15, gameChar_y - 45)
    line(gameChar_x, gameChar_y - 30, gameChar_x - 5, gameChar_y)
    line(gameChar_x, gameChar_y - 30, gameChar_x + 5, gameChar_y)
    stroke(255, 0, 0)
    line(gameChar_x - 15, gameChar_y - 60, gameChar_x - 15, gameChar_y - 20)
    fill(255, 0, 0)
    triangle(gameChar_x - 15, gameChar_y - 62, gameChar_x - 13,
      gameChar_y - 58, gameChar_x - 17, gameChar_y - 58)
  } else if (isLeft) {
    // add your walking left code
    fill(0)
    ellipse(gameChar_x, gameChar_y - 40, 20, 20)
    stroke(0)
    line(gameChar_x, gameChar_y - 10, gameChar_x, gameChar_y - 35)
    line(gameChar_x - 15, gameChar_y - 25, gameChar_x + 15, gameChar_y - 25)
    line(gameChar_x, gameChar_y - 10, gameChar_x - 5, gameChar_y)
    line(gameChar_x, gameChar_y - 10, gameChar_x + 5, gameChar_y)
    stroke(255, 0, 0)
    line(gameChar_x + 15, gameChar_y - 40, gameChar_x + 15, gameChar_y)
    fill(255, 0, 0)
    triangle(gameChar_x + 15, gameChar_y - 42, gameChar_x + 13,
      gameChar_y - 38, gameChar_x + 17, gameChar_y - 38)
  } else if (isRight) {
    // add your walking right code
    fill(0)
    ellipse(gameChar_x, gameChar_y - 40, 20, 20)
    stroke(0)
    line(gameChar_x, gameChar_y - 10, gameChar_x, gameChar_y - 35)
    line(gameChar_x - 15, gameChar_y - 25, gameChar_x + 15, gameChar_y - 25)
    line(gameChar_x, gameChar_y - 10, gameChar_x - 5, gameChar_y)
    line(gameChar_x, gameChar_y - 10, gameChar_x + 5, gameChar_y)
    stroke(255, 0, 0)
    line(gameChar_x - 15, gameChar_y - 40, gameChar_x - 15, gameChar_y)
    fill(255, 0, 0)
    triangle(gameChar_x - 15, gameChar_y - 42, gameChar_x - 13,
      gameChar_y - 38, gameChar_x - 17, gameChar_y - 38)
  } else if (isFalling || isPlummeting) {
    // add your jumping facing forwards code
    fill(0)
    ellipse(gameChar_x, gameChar_y - 60, 20, 20)
    stroke(0)
    line(gameChar_x, gameChar_y - 30, gameChar_x, gameChar_y - 55)
    line(gameChar_x - 15, gameChar_y - 45, gameChar_x + 15, gameChar_y - 45)
    line(gameChar_x, gameChar_y - 30, gameChar_x - 5, gameChar_y)
    line(gameChar_x, gameChar_y - 30, gameChar_x + 5, gameChar_y)
  } else {
    // add your standing front facing code
    fill(0)
    ellipse(gameChar_x, gameChar_y - 40, 20, 20)
    stroke(0)
    line(gameChar_x, gameChar_y - 10, gameChar_x, gameChar_y - 35)
    line(gameChar_x - 15, gameChar_y - 25, gameChar_x + 15, gameChar_y - 25)
    line(gameChar_x, gameChar_y - 10, gameChar_x - 5, gameChar_y)
    line(gameChar_x, gameChar_y - 10, gameChar_x + 5, gameChar_y)
  }
}

// ---------------------------
// Background render functions
// ---------------------------

// Function to draw cloud objects.
function drawClouds () {
  for (var i = 0; i < clouds.length; i++) {
    fill(255, 255, 255)

    ellipse(clouds[i].x_pos, clouds[i].y_pos, 20 * clouds[i].size,
      20 * clouds[i].size)

    ellipse(clouds[i].x_pos - 12 * clouds[i].size, clouds[i].y_pos,
      15 * clouds[i].size, 15 * clouds[i].size)

    ellipse(clouds[i].x_pos + 12 * clouds[i].size, clouds[i].y_pos,
      15 * clouds[i].size, 15 * clouds[i].size)

    ellipse(clouds[i].x_pos - 20 * clouds[i].size, clouds[i].y_pos,
      10 * clouds[i].size, 10 * clouds[i].size)

    ellipse(clouds[i].x_pos + 20 * clouds[i].size, clouds[i].y_pos,
      10 * clouds[i].size, 10 * clouds[i].size)
  }
}

// Function to draw mountains objects.
function drawMountains () {
  for (var i = 0; i < mountains.length; i++) {
    fill(128, 128, 128)

    triangle(mountains[i].x_pos - 50 * mountains[i].size, mountains[i].y_pos,
      mountains[i].x_pos + 50 * mountains[i].size, mountains[i].y_pos,
      mountains[i].x_pos, mountains[i].y_pos - 100 * mountains[i].size)

    // mountain-top snow
    fill(255, 255, 255)
    triangle(mountains[i].x_pos - 14 * mountains[i].size,
      mountains[i].y_pos - 72 * mountains[i].size,
      mountains[i].x_pos + 14 * mountains[i].size,
      mountains[i].y_pos - 72 * mountains[i].size,
      mountains[i].x_pos, mountains[i].y_pos - 100 * mountains[i].size)
  }
}

// Function to draw trees objects.
function drawTrees () {
  for (var i = 0; i < trees_x.length; i++) {
    // draws tree trunk
    fill(120, 100, 40)

    rect(trees_x[i], floorPos_y - 150, 30, 150)

    // branches
    fill(0, 255, 0)

    triangle(trees_x[i] - 65, floorPos_y - 90, trees_x[i] + 15,
      floorPos_y - 200, trees_x[i] + 95, floorPos_y - 90)

    triangle(trees_x[i] - 45, floorPos_y - 160, trees_x[i] + 15,
      floorPos_y - 260, trees_x[i] + 75, floorPos_y - 160)

    triangle(trees_x[i] - 25, floorPos_y - 220, trees_x[i] + 15,
      floorPos_y - 310, trees_x[i] + 55, floorPos_y - 220)
  }
}

function drawLifeTokens () {
  for (var i = 0; i < lives; i++) {
    fill(255, 0, 0)

    rect(20 * i + 20, 60, 10, 10)

    fill(0)

    text('L', 20 * i + 23, 69)
  }
}

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon (t_canyon) {
  fill(100, 155, 255)

  noStroke()

  rect(t_canyon.x_pos, 432, t_canyon.width, 144)
}

// Function to check character is over a canyon.

function checkCanyon (t_canyon) {
  if (gameChar_y >= floorPos_y && gameChar_world_x > t_canyon.x_pos &&
      gameChar_world_x < t_canyon.x_pos + t_canyon.width) {
    isPlummeting = true
  }
}

// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable (t_collectable) {
  fill(155, 17, 30)

  triangle(t_collectable.x_pos, t_collectable.y_pos,
    t_collectable.x_pos - 10 * t_collectable.size,
    t_collectable.y_pos + 10 * t_collectable.size,
    t_collectable.x_pos + 10 * t_collectable.size,
    t_collectable.y_pos + 10 * t_collectable.size)

  triangle(t_collectable.x_pos, t_collectable.y_pos + 15 * t_collectable.size,
    t_collectable.x_pos - 10 * t_collectable.size,
    t_collectable.y_pos + 5 * t_collectable.size,
    t_collectable.x_pos + 10 * t_collectable.size,
    t_collectable.y_pos + 5 * t_collectable.size)
}

// Function to check character has collected an item.

function checkCollectable (t_collectable) {
  if (dist(gameChar_world_x, gameChar_y, t_collectable.x_pos,
    t_collectable.y_pos) < 85) {
    t_collectable.isFound = true
    game_score++
  }
}

// Function to draw the flagpole

function renderFlagpole () {
  push()
  strokeWeight(5)
  stroke(180)
  line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250)
  fill(255, 0, 255)
  noStroke()

  if (flagpole.isReached) {
    rect(flagpole.x_pos, floorPos_y - 250, 50, 50)
  } else {
    rect(flagpole.x_pos, floorPos_y - 50, 50, 50)
  }
  pop()
}

function checkFlagpole () {
  var d = abs(gameChar_world_x - flagpole.x_pos)

  if (d < 15) {
    flagpole.isReached = true
  }
}

function Enemy(x, y, range){
    this.x = x;
    this.y = y;
    this.range = range;
    this.currentX = x
    this.inc = 1;
    
    this.update = function(){
        this.currentX += this.inc;
        
        if(this.currentX >= this.x + this.range){
            this.inc = -1;
        }
        else if(this.currentX < this.x){
            this.inc = 1;
        }
    }
    
    this.draw = function(){
        this.update();
        fill(255, 255, 0)
        ellipse(this.currentX, this.y, 60, 60)
        fill(255)
        ellipse(this.currentX - 5, this.y - 10, 25, 25)
        fill(0)
        ellipse(this.currentX - 5, this.y - 10, 5, 5)
        fill(255)
        ellipse(this.currentX + 15, this.y - 10, 25, 25)
        fill(0)
        ellipse(this.currentX + 15, this.y - 10, 5, 5)
        rect(this.currentX - 8, this.y + 10, 20, 10)
    }
    
    this.checkContact = function(gc_x, gc_y){
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        if(d < 33){
            return true
        }
        else{
            return false
        }
    }
    
}

function createPlatforms (x, y, length) {
  var p = {
    x: x,
    y: y,
    length: length,
    draw: function () {
      fill(255, 0, 255)
      rect(this.x, this.y, this.length, 20)
    },
    checkContact: function (gc_x, gc_y) {
      if (gc_x > this.x && gc_x < this.x + this.length) {
        var d = this.y - gc_y
        if (d >= 0 && d < 5) {
          return true
        }
      }
    }
  }
  return p
}

function checkPlayerDie () {
  if (gameChar_y > 576) {
    lives--
    startGame()
  }
}

function startGame () {
  gameChar_x = width / 2
  gameChar_y = floorPos_y

  // Variable to control the background scrolling.
  scrollPos = 0

  // Variable to store the real position of the gameChar in the game
  // world. Needed for collision detection.
  gameChar_world_x = gameChar_x - scrollPos

  // Boolean variables to control the movement of the game character.
  isLeft = false
  isRight = false
  isFalling = false
  isPlummeting = false

  // Initialise arrays of scenery objects.
  trees_x = [100, 200, 500, 850, 1000, 1500, 2400, 2600, 1250, -400, -700]

  mountains = [
    { x_pos: 180, y_pos: floorPos_y, size: 2 },
    { x_pos: 610, y_pos: floorPos_y, size: 2.5 },
    { x_pos: 910, y_pos: floorPos_y, size: 3.5 },
    { x_pos: 1610, y_pos: floorPos_y, size: 2.5 },
    { x_pos: -610, y_pos: floorPos_y, size: 1 },
    { x_pos: 1010, y_pos: floorPos_y, size: 2.5 },
    { x_pos: 1300, y_pos: floorPos_y, size: 1.5 },
    { x_pos: 2000, y_pos: floorPos_y, size: 3.5 }
  ]

  clouds = [{ x_pos: 150, y_pos: 100, size: 4 },
    { x_pos: 250, y_pos: 120, size: 4 },
    { x_pos: 400, y_pos: 90, size: 4 },
    { x_pos: 0, y_pos: 90, size: 4 },
    { x_pos: 1000, y_pos: 90, size: 4 },
    { x_pos: -300, y_pos: 90, size: 4 },
    { x_pos: 1400, y_pos: 90, size: 4 },
    { x_pos: 2100, y_pos: 90, size: 4 }
  ]

  collectables = [
    { x_pos: 200, y_pos: 350, size: 3, isFound: false },
    { x_pos: 650, y_pos: 350, size: 3, isFound: false },
    { x_pos: 950, y_pos: 350, size: 1, isFound: false },
    { x_pos: 1150, y_pos: 350, size: 2, isFound: false },
    { x_pos: -250, y_pos: 350, size: 2, isFound: false },
    { x_pos: 2650, y_pos: 350, size: 4, isFound: false },
    { x_pos: 1850, y_pos: 350, size: 4, isFound: false },
    { x_pos: 2050, y_pos: 350, size: 5, isFound: false },
    { x_pos: 2150, y_pos: 350, size: 4, isFound: false },
    { x_pos: 2450, y_pos: 350, size: 5, isFound: false }
  ]

  canyons = [
    { x_pos: 70, width: 55 },
    { x_pos: 570, width: 35 },
    { x_pos: 970, width: 50 },
    { x_pos: 1370, width: 35 }
  ]

  enemies = [];
    
  enemies.push(new Enemy(750, floorPos_y - 30, 100), new Enemy(1450, floorPos_y - 30, 100))
    
  platforms = []

  platforms.push(createPlatforms(1350, floorPos_y - 40, 60), createPlatforms(975, floorPos_y - 40, 60), createPlatforms(1015, floorPos_y - 70, 60), createPlatforms(1055, floorPos_y - 100, 60))

  game_score = 0
}
