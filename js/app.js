// ----- GAME SET UP [IMPORTANT: RESET IF BOARD SIZE CHANGES]-----
const width = 8;
const numberOfCells = 408;
const subInitialLocation = 2;
const initialTime = 60;
const sizeOfCell = 80;

// ----- ID AND INDEX SET UP -----
let countDownTimerId = 0;
let points = 0;
let gameRunning = false;
let gameMechanicsTimerId = 0;
let moveFishIndex = 0;
let spornFishIndex = 30;
let timeLeft = initialTime;
const fishInPlay = [];
let movingLeft = false;
let subAtSurface = false;


function randomLocation(){
  return Math.floor(Math.random()*(numberOfCells-1));
}


$(() => {
  console.log('DOM loaded');
  const $cells = $('.cell');
  const $pointDisplay = $('.points');
  const $restartButton = $('.restartButton');
  const $startButton = $('.startButton');
  const $airSupply = $('.airSupply');
  const $cellContainer = $('.cellContainer');
  const $modal = $('.modal');
  const $endMessage = $('.endMessage');
  const $modalTitle = $('.modalTitle');
  const $finalPoints = $('.finalPoints');
  const $ship = $('.ship');




  // ----- FISH CONSTRUCTOR -----
  class Fish {
    constructor(location, type, pointsValue, movementPatternArray, movementPatternIndex, age, alive){
      this.location = location;
      this.type = type;
      this.pointsValue = pointsValue;
      this.movementPatternArray = movementPatternArray;
      this.movementPatternIndex = movementPatternIndex;
      this.age = age;
      this.alive = alive;
    }
    move() {
      $cells.eq(this.location).removeClass(this.type);
      this.location += this.movementPatternArray[this.movementPatternIndex];


      if ((this.location !== subLocation) && !(mineLocations.includes(this.location)) && ((this.location < numberOfCells-1))){

        const travelAmount = this.movementPatternArray[this.movementPatternIndex];


        if (travelAmount === width){
          $cells.eq(this.location).css({top: `${-sizeOfCell}px`});
          $cells.eq(this.location).animate({top: '0px'}, 200, 'linear');
        } else if (travelAmount === -width){
          $cells.eq(this.location).css({top: `${sizeOfCell}px`});
          $cells.eq(this.location).animate({top: '0px'}, 200, 'linear');
        } else if (travelAmount > 0){
          $cells.eq(this.location).css({right: `${sizeOfCell}px`});
          $cells.eq(this.location).animate({right: '0px'}, 200, 'linear');
        } else if (travelAmount < 0){
          $cells.eq(this.location).css({right: `${-sizeOfCell}px`});
          $cells.eq(this.location).animate({right: '0px'}, 200, 'linear');
        }

      }

      this.movementPatternIndex++;

      if (this.movementPatternIndex===this.movementPatternArray.length){
        this.movementPatternIndex = 0;
      }
      if ((this.location < width)||(numberOfCells-1 < this.location)||(this.age<0)){
        this.alive = false;
      } else {
        $cells.eq(this.location).addClass(this.type);
        this.age--;
      }

    }
  }



  //----- SUBMARINE SET UP ------
  let subLocation = subInitialLocation;

  //----- MOVING SUBMARINE -----
  function moveSub(travelAmount) {

    $cells.eq(subLocation)
      .removeClass('submarine')
      .removeClass('movingLeft');
    subLocation += travelAmount;

    $cells.eq(subLocation).addClass('submarine');

    movingLeft && $cells.eq(subLocation).addClass('movingLeft');

    isAtTop(subLocation);
    animateSub(travelAmount);
  }


  function animateSub(travelAmount) {
    if (travelAmount === 1){
      $cells.eq(subLocation).css({right: `${sizeOfCell}px`});
      $cells.eq(subLocation).animate({right: '0px'}, 200);
    } else if (travelAmount === -1){
      $cells.eq(subLocation).css({right: `${-sizeOfCell}px`});
      $cells.eq(subLocation).animate({right: '0px'}, 200);
    } else if (travelAmount === width){
      $cells.eq(subLocation).css({top: `${-sizeOfCell}px`});
      $cells.eq(subLocation).animate({top: '0px'}, 300);
    } else if (travelAmount === -width){
      $cells.eq(subLocation).css({top: `${sizeOfCell}px`});
      $cells.eq(subLocation).animate({top: '0px'}, 300);
    }
  }


  function isAtTop(location){
    (location < width) ? (subAtSurface = true) : (subAtSurface = false);
  }


  // ---- MINES ----

  const mineLocations = [ 57, 78, 83, 130, 142, 156, 144, 167, 226, 229, 233, 236, 239, 240, 243, 246, 313, 317, 320, 323, 327, 330, 332];

  function makeMines() {
    mineLocations.forEach(location => $cells.eq(location).addClass('mine'));
  }

  //----- FISH FUNCTIONS -----
  function spornFish(){

    const greenFish = new Fish(randomLocation(), 'greenFish', 4, [1,1,width],0,20,true);
    fishInPlay.push(greenFish);

    const redFish = new Fish(randomLocation(), 'redFish', 3, [-1],0,14,true);
    fishInPlay.push(redFish);

    const greenFish2 = new Fish(randomLocation(), 'greenFishBackwards', 4, [-1,-1,-width],0,18,true);
    fishInPlay.push(greenFish2);

    const redFish2 = new Fish(randomLocation(), 'redFishBackwards', 3, [1],0,16,true);
    fishInPlay.push(redFish2);


    if (Math.random()< 0.25){
      const treasure = new Fish(numberOfCells-5, 'treasure', 40, [0],0,10,true);
      fishInPlay.push(treasure);
    }

    if (Math.random()< 0.25){
      const turtle = new Fish(Math.floor(Math.random()*(24))+224, 'turtle', 30, [1,0],0,20,true);
      fishInPlay.push(turtle);
    }

    if (Math.random()< 0.25){
      const fish3 = new Fish(Math.floor(Math.random()*(40))+340, 'fish3', 15, [1,0,width,0],0,20,true);
      fishInPlay.push(fish3);
    }

    if (Math.random()< 0.10){
      const fish4 = new Fish(Math.floor(Math.random()*(16))+390, 'fish4', 60, [-1,-1,-2],0,10,true);
      fishInPlay.push(fish4);
    }

    if (Math.random()< 0.20){
      const octopus = new Fish(Math.floor(Math.random()*(100))+206, 'octopus', 25, [width, width, 1, -width,-width,-width, 1],0,10,true);
      fishInPlay.push(octopus);
    }

  }


  function moveFish(){

    fishInPlay.forEach(fish => fish.move());

  }


  function checkIfCaught(){

    fishInPlay.forEach(fish => {
      if((fish.location === subLocation) && (fish.alive)){

        subCatchingFishAnimation();

        updatePoints(fish.pointsValue);

        fish.alive = false;
      }
    });
  }

  function subCatchingFishAnimation(){
    $cells.eq(subLocation).addClass('submarineFlash');
    $cells.eq(subLocation).on('animationend', function(){
      $cells.eq(subLocation).removeClass('submarineFlash');
    });
  }

  function removeDeadFish(){
    fishInPlay.forEach(fish => {
      if(fish.alive === false){
        const indexOfDeadFish = fishInPlay.findIndex(fish => fish.alive === false);

        if (indexOfDeadFish !== -1) {
          fishInPlay.splice(indexOfDeadFish, 1);
        }

        $cells.eq(fish.location).removeClass(fish.type);
      }
    });
  }


  function mineExploded(location){
    timeLeft -= 10;

    explodingMineAmination(location);
    airSupplyWarningAnimation();

    //Splice Mine from array of Active Mines (mineLocations)
    const indexOfExplodedMine = mineLocations.indexOf(location);
    mineLocations.splice(indexOfExplodedMine, 1);

  }

  function explodingMineAmination(location){
    $cells.eq(location).removeClass('mine');
    $cells.eq(location).addClass('mineExploded');
    setTimeout(()=>{
      $cells.eq(location).removeClass('mineExploded');
    }, 300);
  }

  function airSupplyWarningAnimation(){
    $airSupply.css('animation','warning 0.5s infinite');
    setTimeout(()=>{
      $airSupply.css('animation','');
    }, 1000);
  }


  function gameMechanics (){

    gameMechanicsTimerId = setInterval(()=>{

      if (moveFishIndex<2){
        moveFishIndex++;
      } else {
        moveFish();
        moveFishIndex = 0;
      }

      if (spornFishIndex<30){
        spornFishIndex++;
      } else {
        spornFish();
        spornFishIndex = 0;
      }

      checkIfCaught();
      removeDeadFish();
      checkIfGameHasEnd();


    }, 100);

  }

  function checkIfGameHasEnd(){
    if ((subAtSurface) && (timeLeft < (initialTime/2))){
      endGame();
    }

    if (timeLeft < 0){
      updatePoints(0);
      endGame();
    }
  }



  // ----- GAME START AND END FUNCTIONS -----
  function runGame(){

    startGameAnimations();

    updatePoints(0);
    timeLeft = initialTime;
    $airSupply.css('animation','');

    makeMines();
    timeCountDown();
    gameMechanics();

  }

  function startGameAnimations(){

    $ship.animate({left: '100px'}, 2000, ()=>{
      subLocation = subInitialLocation;
      $cells.eq(subLocation).addClass('submarine');
      gameRunning = true;
    });

    $modal.animate({opacity: 0}, 500);
  }

  function endGame(){
    gameRunning = false;

    clearInterval(countDownTimerId);
    clearInterval(gameMechanicsTimerId);

    updateModalMessage();
    endGameAnimations();

  }

  function updateModalMessage(){
    if (subAtSurface){

      $modalTitle.text('Well done!');
      $endMessage.text('You got back to the surface safely.');

    } else {

      $modalTitle.text('Oh no, you ran out of air!');
      $endMessage.text('You need to get back to the surface before your air supply runs out.');

    }

    $finalPoints.text(`You have ${points} points.`);
    $startButton.text('Dive again (D)');

  }

  function endGameAnimations(){
    let scrollTime = 2000;
    (subLocation < 100) &&  (scrollTime = 500);

    $cellContainer.animate({scrollTop: 0 }, scrollTime, 'swing', ()=>{
      $cells.eq(subLocation).removeClass('submarine');
      $modal.animate({opacity: 1}, 500);
      $ship.animate({left: '-300px'}, 2000, ()=>{
        $ship.css({left: '800px'});
      });
    });
  }


  function updatePoints(score){
    if (score === 0) {
      points = score;
    } else {
      points += score;
    }
    $pointDisplay.text(points);
  }

  // ----- GAME TIMER COUNTDOWN -----
  function timeCountDown(){

    countDownTimerId = setInterval(()=>{
      timeLeft--;
      $airSupply.height(`${timeLeft/initialTime*100}%`);

      (timeLeft < 20) && $airSupply.css('animation','warning 0.5s infinite');



    }, 1000);
  }




  // ----- USER CONTROLS -----
  $(window).on('keyup', keypressed);
  $restartButton.on('click',endGame);
  $startButton.on('click',runGame);
  $cellContainer.bind('mousewheel DOMMouseScroll touchmove', function () {
    return false;
  });

  function keypressed(e){
    e.preventDefault();

    if ((e.keyCode === 83) && gameRunning){
      console.log('S pressed - GAME ENDED');
      //S key
      endGame();
    }
    if ((e.keyCode === 68) && !gameRunning){
      console.log('D pressed - GAME STARTED');
      //R key
      runGame();
    }
    if (e.keyCode === 81){
      console.log('Q pressed');
      //Q key
      console.log('This is a test key');
      return false;
    }



    // ----- SUBMARINE CONTROLS -----
    if (gameRunning) {

      // --- RIGHT ARROW ---
      if (e.keyCode === 39) {

        movingLeft = false;

        if (mineLocations.includes(subLocation+1)) {
          mineExploded(subLocation+1);
        } else if ((subLocation+1)%width !== 0) {
          moveSub(1);
        }

      }

      // --- LEFT ARROW ---
      if (e.keyCode === 37) {

        movingLeft = true;

        if (mineLocations.includes(subLocation-1)) {
          mineExploded(subLocation-1);
        } else if (subLocation%width !== 0){
          moveSub(-1);
        }
      }

      // --- DOWN ARROW ---
      if (e.keyCode === 40){


        if ($('.submarine').position().top > 240){

          $('.cellContainer').animate({scrollTop: '+=80px'}, 300, 'swing');
        }
        if (mineLocations.includes(subLocation+width)) {
          mineExploded(subLocation+width);
        } else if (subLocation+width < numberOfCells) {
          moveSub(width);
        }

      }

      // --- UP ARROW ---
      if (e.keyCode === 38){


        // $('.cellContainer').scrollTop(100);
        if ($('.submarine').position().top < 180){
          $('.cellContainer').animate({scrollTop: '-=80px'}, 300, 'swing');
        }

        if (mineLocations.includes(subLocation-width)) {
          mineExploded(subLocation-width);
        } else if (subLocation-width+1 > 0){
          moveSub(-width);
        }
      }

    }

  }

});
