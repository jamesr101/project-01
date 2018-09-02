// ----- GAME SET UP [IMPORTANT: RESET IF BOARD SIZE CHANGES]-----
const width = 8;
const numberOfCells = 208;
const subInitialLocation = 20;
const initialTime = 60;

// ----- ID AND INDEX SET UP -----
let countDownTimerId = 0;
let points = 0;
let gameRunning = false;
let gameMechanicsTimerId = 0;
let moveFishIndex = 0;
let spornFishIndex = 30;
const $fishInPlay = [];


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
    constructor(location, type, pointsValue, movementPatternArray, movementPatternIndex, age){
      this.location = location;
      this.type = type;
      this.pointsValue = pointsValue;
      this.movementPatternArray = movementPatternArray;
      this.movementPatternIndex = movementPatternIndex;
      this.age = age;
    }
    move() {
      $cells.eq(this.location).removeClass(this.type);
      this.location += this.movementPatternArray[this.movementPatternIndex];
      this.movementPatternIndex++;
      if (this.movementPatternIndex===this.movementPatternArray.length){
        this.movementPatternIndex = 0;
      }
      if ((this.location < 0)||(numberOfCells < this.location)||(this.age<0)){
        this.remove();
        console.log('Fish swam off or died of old age');
      } else {
        $cells.eq(this.location).addClass(this.type);
        this.age--;
      }
    }
    remove() {
      const indexOfThisFish = $fishInPlay.findIndex(fish => fish.location === this.location);

      if (indexOfThisFish !== -1) {
        $fishInPlay.splice(indexOfThisFish, 1);
      }

      $cells.eq(this.location).removeClass(this.type);
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

  //----- FISH FUNCTIONS -----
  function spornFish(){

    const greenFish = new Fish(randomLocation(), 'greenFish', 3, [1,1,width],0,20);
    $fishInPlay.push(greenFish);

    const redFish = new Fish(randomLocation(), 'redFish', 4, [-1],0,14);
    $fishInPlay.push(redFish);

    const greenFish2 = new Fish(randomLocation(), 'greenFish', 3, [-1,-1,-width],0,18);
    $fishInPlay.push(greenFish2);

    const redFish2 = new Fish(randomLocation(), 'redFish', 4, [1],0,16);
    $fishInPlay.push(redFish2);

    console.log($fishInPlay);
  }


  function moveFish(){

    $.each($fishInPlay, function( key, value ) {
      value.move();
    });

  }


  function checkIfCaught(){

    $.each($fishInPlay, function( key, value ) {

      if(value.location === subLocation){

        points += value.pointsValue;
        $pointDisplay.text(points);

        this.remove();
      }

    });

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

    }, 100);

  }




  // ----- GAME START AND END FUNCTIONS -----
  function runGame(){
    gameRunning = true;
    points = 0;
    $pointDisplay.text(points);

    timeCountDown();
    gameMechanics();
  }


  function endGame(){
    gameRunning = false;

    clearInterval(countDownTimerId);
    clearInterval(gameMechanicsTimerId);
  }


  function restartGame(){
    console.log('RESTART GAME');
    endGame();
    runGame();
  }

  // ----- GAME TIMER COUNTDOWN -----
  function timeCountDown(){
    let timeLeft = initialTime;
    countDownTimerId = setInterval(()=>{
      timeLeft--;
      $airTank.height(`${timeLeft/initialTime*100}%`);

      if (timeLeft===0){
        endGame();
      }

    }, 1000);
  }



  // ----- USER CONTROLS -----
  $(window).on('keydown', keypressed);
  $restartButton.on('click',restartGame);

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
      // $cellContainer.scrollTo(0, -500);
      $cellContainer.animate({
        scrollTop: $cellContainer.offset().top
      }, 1000);
      return false;
    }

    // ----- SUBMARINE CONTROLS -----
    if ((e.keyCode === 39) && ((subLocation+1)%width !== 0)){
      //RIGHT arrow
      (gameRunning) && moveSub(1);
    }
    if ((e.keyCode === 37) && (subLocation%width !== 0)){
      //LEFT arrow
      (gameRunning) && moveSub(-1);
      (gameRunning) && $cells.eq(subLocation).addClass('movingLeft');
    }
    if (e.keyCode === 40) {
      //DOWN arrow
      e.preventDefault();

      // $cellContainer.scrollTo(0, -500);

      // $cellContainer.scrollTop() ;
      (gameRunning) && (subLocation+width < numberOfCells) && moveSub(width);
    }
    if (e.keyCode === 38) {
      //UP arrow
      e.preventDefault();
      (gameRunning) && (subLocation-width+1 > 0) && moveSub(-width);
    }

  }

});
