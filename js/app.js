const width = 8;
const numberOfCells = 56;
const subInitialLocation = 22;
const initialTime = 60;

let gameTimerId = 0;
let moveFishTimerId = 0;
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
        console.log('Fish swam off board');
      } else {
        $cells.eq(this.location).addClass(this.type);
        this.age--;
      }
    }
    die (){
      const indexOfThisFish = $fishInPlay.findIndex(x => x.location === this.location);
      console.log(indexOfThisFish);

      if (indexOfThisFish !== -1) {
        $fishInPlay.splice(indexOfThisFish, 1);
      }

      $cells.eq(this.location).removeClass(this.type);
    }

  }

  const greenFish = new Fish(27, 'greenFish', 3, [1],0,10);
  $fishInPlay.push(greenFish);
  const redFish = new Fish(40, 'redFish', 4, [-1],0,10);
  $fishInPlay.push(redFish);

  console.log($fishInPlay);

  let subLocation = subInitialLocation;
  $cells.eq(subLocation).addClass('submarine');


  setInterval( ()=>{
    //GENERATE FISH

    const greenFish = new Fish(randomNumber(), 'greenFish', 3, [1],0,10);
    $fishInPlay.push(greenFish);
    const redFish = new Fish(randomNumber(), 'redFish', 4, [-1],0,10);
    $fishInPlay.push(redFish);

    console.log($fishInPlay);

  },10000);

  moveFishTimerId = setInterval( ()=>{

    $.each($fishInPlay, function( key, value ) {
      value.move();
    });


  },500);




  function checkIfCaught(){
    $.each($fishInPlay, function( key, value ) {
      if(value.location === subLocation){
        console.log(`${value.type} caught at location ${value.location}`);
        points += value.pointsValue;
        $pointDisplay.text(points);

        this.die();
      }
    });
  }


  $.each($fishInPlay, function( key, value ) {
    console.log('type: ' + value.type + ' | location: ' +value.locationIndex);
  });




  function runGame(){
    gameRunning = true;
    gameTimerId = setInterval( ()=>{
      checkIfCaught();
    },100);
    timeCountDown();
    points = 0;
    $pointDisplay.text(points);
  }

  //** Moving submarine **
  function moveSub(number) {
    $cells.eq(subLocation).removeClass('submarine');
    // $cells.eq(subLocation).removeClass('movingLeft');
    subLocation += number;
    // console.log(subLocation, fishLocation);
    $cells.eq(subLocation).addClass('submarine');
  }


  function endGame(){
    gameRunning = false;
    clearInterval(gameTimerId);
    clearInterval(moveFishTimerId);

  }


  function timeCountDown(){
    let timeLeft = initialTime;
    let countDownId = 0;
    countDownId = setInterval(()=>{
      timeLeft--;
      $airTank.height((700/initialTime)*timeLeft);
      // console.log(`${timeLeft} seconds left`);
      if (timeLeft===0){
        clearInterval(countDownId);
        endGame();
      }
    }, 1000);
  }


  $(document).on('button-up');
  $(window).on('keydown', keypressed);


  function keypressed(e){
    if (e.keyCode === 83){
      console.log('S pressed');
      //a key
      endGame();
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

  runGame();
});
