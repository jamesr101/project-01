const width = 8;
const numberOfCells = 56;
const subInitialLocation = 22;
const initialTime = 60;


let countDownTimerId = 0;
let points = 0;
let gameRunning = false;
const $fishInPlay = [];


function randomNumber(){
  return Math.floor(Math.random()*(numberOfCells));
}

$(() => {
  console.log('DOM loaded');
  const $cells = $('.cell');
  const $pointDisplay = $('#points');
  const $restartButton = $('.restartButton');
  const $airTank = $('.airTank');
  // const $cellContainer = $('.cellContainer');

  class Fish {
    constructor(location, type, pointsValue, movementPatternArray, movementPatternIndex, age){
      this.location = location;
      this.type = type;
      this.pointsValue = pointsValue;
      this.movementPatternArray = movementPatternArray;
      this.movementPatternIndex = movementPatternIndex;
      this.age = age;
    }
    move () {
      $cells.eq(this.location).removeClass(this.type);
      this.location += this.movementPatternArray[this.movementPatternIndex];
      if ((this.location < 0)||(numberOfCells < this.location)){
        this.die();
        console.log('Fish swam off');
      } else {
        $cells.eq(this.location).addClass(this.type);
        this.age--;
      }
    }
    die (){
      const indexOfThisFish = $fishInPlay.findIndex(x => x.location === this.location);

      if (indexOfThisFish !== -1) {
        $fishInPlay.splice(indexOfThisFish, 1);
      }

      $cells.eq(this.location).removeClass(this.type);
    }

  }

  //----- INITIAL SET UP ------
  let subLocation = subInitialLocation;
  $cells.eq(subLocation).addClass('submarine');

  //----- MOVING SUBMARINE -----
  function moveSub(number) {
    $cells.eq(subLocation).removeClass('submarine');
    subLocation += number;
    $cells.eq(subLocation).addClass('submarine');
  }

  function spornFish(){
    const greenFish = new Fish(randomNumber(), 'greenFish', 3, [1],0,10);
    $fishInPlay.push(greenFish);
    const redFish = new Fish(randomNumber(), 'redFish', 4, [-1],0,10);
    $fishInPlay.push(redFish);
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

        this.die();
      }
    });
  }

  let gameMechanicsTimerId = 0;
  let moveFishIndex = 0;
  let spornFishIndex = 30;


  function gameMechanics (){
    gameMechanicsTimerId = setInterval(()=>{

      if (moveFishIndex<2){
        moveFishIndex++;
      } else{
        moveFish();
        moveFishIndex = 0;
      }

      if (spornFishIndex<30){
        spornFishIndex++;
      } else{
        spornFish();
        spornFishIndex = 0;
      }

      checkIfCaught();
    }, 100);
  }





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

  function timeCountDown(){
    let timeLeft = initialTime;
    countDownTimerId = setInterval(()=>{
      timeLeft--;
      $airTank.height((700/initialTime)*timeLeft);

      if (timeLeft===0){
        endGame();
      }

    }, 1000);
  }


  // ----- CONTROLS -----
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
      //S key
      restartGame();
    }
    if ((e.keyCode === 39) && ((subLocation+1)%width !== 0)){
      //right arrow
      (gameRunning) && moveSub(1);
    }
    if ((e.keyCode === 37) && (subLocation%width !== 0)){
      //left arrow
      (gameRunning) && moveSub(-1);
      (gameRunning) && $cells.eq(subLocation).addClass('movingLeft');
    }
    if (e.keyCode === 40) {
      //down arrow
      e.preventDefault();
      (gameRunning) && (subLocation+width < numberOfCells) && moveSub(width);
    }
    if (e.keyCode === 38) {
      //up arrow
      e.preventDefault();
      (gameRunning) && (subLocation-width+1 > 0) && moveSub(-width);
    }

  }

});
