// ----- GAME SET UP [IMPORTANT: RESET IF BOARD SIZE CHANGES]-----
const width = 8;
const numberOfCells = 208;
const subInitialLocation = 12;
const initialTime = 60;

// ----- ID AND INDEX SET UP -----
let countDownTimerId = 0;
let points = 0;
let gameRunning = false;
let gameMechanicsTimerId = 0;
let moveFishIndex = 0;
let spornFishIndex = 30;
let timeLeft = initialTime;
const fishInPlay = [];




function randomLocation(){
  return Math.floor(Math.random()*(numberOfCells));
}

$(() => {
  console.log('DOM loaded');
  const $cells = $('.cell');
  const $pointDisplay = $('#points');
  const $restartButton = $('.restartButton');
  const $airTank = $('.airTank');
  const $cellContainer = $('.cellContainer');

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
      this.movementPatternIndex++;
      if (this.movementPatternIndex===this.movementPatternArray.length){
        this.movementPatternIndex = 0;
      }
      if ((this.location < width)||(numberOfCells < this.location)||(this.age<0)){
        this.alive = false;
        // console.log('Fish swam off or died of old age');
      } else {
        $cells.eq(this.location).addClass(this.type);
        this.age--;
      }
    }
  }

  //----- SUBMARINE SET UP ------
  let subLocation = subInitialLocation;
  $cells.eq(subLocation).addClass('submarine');

  //----- MOVING SUBMARINE -----
  function moveSub(number) {

    $cells.eq(subLocation).removeClass('submarine');
    subLocation += number;
    $cells.eq(subLocation).addClass('submarine');

  }

  // ---- MINES ----

  let mineLocations = [];

  function makeMines() {
    mineLocations = [ 46, 25, 51];
    mineLocations.forEach(location => $cells.eq(location).addClass('mine'));
  }



  //----- FISH FUNCTIONS -----
  function spornFish(){

    const greenFish = new Fish(randomLocation(), 'greenFish', 3, [1,1,width],0,20,true);
    fishInPlay.push(greenFish);

    const redFish = new Fish(randomLocation(), 'redFish', 4, [-1],0,14,true);
    fishInPlay.push(redFish);

    const greenFish2 = new Fish(randomLocation(), 'greenFish', 3, [-1,-1,-width],0,18,true);
    fishInPlay.push(greenFish2);

    const redFish2 = new Fish(randomLocation(), 'redFish', 4, [1],0,16,true);
    fishInPlay.push(redFish2);

    console.log(fishInPlay);
  }


  function moveFish(){

    fishInPlay.forEach(fish => fish.move());

  }

  function checkIfCaught(){

    fishInPlay.forEach(fish => {
      if((fish.location === subLocation) && (fish.alive)){

        points += fish.pointsValue;
        $pointDisplay.text(points);

        fish.alive = false;
      }
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
    $cells.eq(location).removeClass('mine');
    timeLeft -= 10;
    $cells.eq(location).addClass('mineExploded');
    setTimeout(()=>{
      $cells.eq(location).removeClass('mineExploded');
    }, 300);

    const indexOfExplodedMine = mineLocations.indexOf(location);
    mineLocations.splice(indexOfExplodedMine, 1);

    $airTank.css('animation','warning 0.5s infinite');
    setTimeout(()=>{
      $airTank.css('animation','');
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

    }, 100);

  }




  // ----- GAME START AND END FUNCTIONS -----
  function runGame(){
    gameRunning = true;
    points = 0;
    $pointDisplay.text(points);
    timeLeft = initialTime;
    $airTank.css('animation','');

    makeMines();
    timeCountDown();
    gameMechanics();

    subLocation = subInitialLocation;
    $cells.eq(subLocation).addClass('submarine');
    moveSub(0);
  }


  function endGame(){
    gameRunning = false;

    clearInterval(countDownTimerId);
    clearInterval(gameMechanicsTimerId);

    $cells.eq(subLocation).removeClass('submarine');
    $cellContainer.animate({scrollTop: 0}, 2000, 'swing');
  }


  function restartGame(){

    console.log('RESTART GAME');
    endGame();
    runGame();
  }

  // ----- GAME TIMER COUNTDOWN -----
  function timeCountDown(){

    countDownTimerId = setInterval(()=>{
      timeLeft--;
      $airTank.height(`${timeLeft/initialTime*100}%`);

      (timeLeft < 20) && $airTank.css('animation','warning 0.5s infinite');

      if (timeLeft < 0){
        endGame();
      }

    }, 1000);
  }





  // ----- USER CONTROLS -----
  $(window).on('keyup', keypressed);
  $restartButton.on('click',restartGame);
  $cellContainer.bind('mousewheel DOMMouseScroll touchmove', function () {
    return false;
  });

  function keypressed(e){
    if (e.keyCode === 83){
      console.log('S pressed - GAME ENDED');
      //S key
      endGame();
    }
    if (e.keyCode === 82){
      console.log('R pressed - GAME STARTED');
      //R key
      restartGame();
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
        e.preventDefault();

        if (mineLocations.includes(subLocation+1)) {
          console.log('BANG');
          mineExploded(subLocation+1);
        } else if ((subLocation+1)%width !== 0) {
          moveSub(1);
        }

      }

      // --- LEFT ARROW ---
      if (e.keyCode === 37) {
        e.preventDefault();

        if (mineLocations.includes(subLocation-1)) {
          console.log('BANG');
          mineExploded(subLocation-1);
        } else if (subLocation%width !== 0){
          moveSub(-1);
        }
      }

      // --- DOWN ARROW ---
      if (e.keyCode === 40){
        e.preventDefault();
        if ($('.submarine').position().top > 500){

          $('.cellContainer').animate({scrollTop: '+=100px'}, 100, 'swing');
        }
        if (mineLocations.includes(subLocation+width)) {
          console.log('BANG');
          mineExploded(subLocation+width);
        } else if (subLocation+width < numberOfCells) {
          moveSub(width);
        }

      }

      // --- UP ARROW ---
      if (e.keyCode === 38){
        e.preventDefault();

        // $('.cellContainer').scrollTop(100);
        if ($('.submarine').position().top < 300){

          $('.cellContainer').animate({scrollTop: '-=100px'}, 100, 'swing');
        }

        if (mineLocations.includes(subLocation-width)) {
          console.log('BANG');
          mineExploded(subLocation-width);
        } else if (subLocation-width+1 > 0){
          moveSub(-width);
        }
      }

    }

  }

});
