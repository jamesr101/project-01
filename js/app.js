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
let movingLeft = false;



function randomLocation(){
  return Math.floor(Math.random()*(numberOfCells-1));
}

// function randomLocationOnSeaFloor(){
//   return Math.floor(Math.random()*(numberOfCells));
// }

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


      if ((this.location !== subLocation) && !(mineLocations.includes(this.location))){

        if ((this.movementPatternArray[this.movementPatternIndex])>0){
          $cells.eq(this.location).animate({right: '100px'}, 0, 'linear');
          $cells.eq(this.location).animate({right: '0px'}, 200, 'linear');
        } if ((this.movementPatternArray[this.movementPatternIndex])<0) {
          $cells.eq(this.location).animate({right: '-100px'}, 0, 'linear');
          $cells.eq(this.location).animate({right: '0px'}, 200, 'linear');
        }

      }

      this.movementPatternIndex++;

      if (this.movementPatternIndex===this.movementPatternArray.length){
        this.movementPatternIndex = 0;
      }
      if ((this.location < width)||(numberOfCells-1 < this.location)||(this.age<0)){
        this.alive = false;
        // $cells.eq(this.location).animate({opacity: '0'}, 500);
        // $cells.eq(this.location).css({opacity: '1'});
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

    $cells.eq(subLocation)
      .removeClass('submarine')
      .removeClass('movingLeft');
    subLocation += number;
    $cells.eq(subLocation).addClass('submarine');
    if (movingLeft) {
      $cells.eq(subLocation).addClass('movingLeft');
    }
    console.log(subLocation);
  }

  // ---- MINES ----

  let mineLocations = [];

  function makeMines() {
    mineLocations = [ 57, 78, 83, 130, 142, 156, 144, 167];
    mineLocations.forEach(location => $cells.eq(location).addClass('mine'));
  }



  //----- FISH FUNCTIONS -----
  function spornFish(){

    const greenFish = new Fish(randomLocation(), 'greenFish', 3, [1,1,width],0,20,true);
    fishInPlay.push(greenFish);

    const redFish = new Fish(randomLocation(), 'redFish', 4, [-1],0,14,true);
    fishInPlay.push(redFish);

    const greenFish2 = new Fish(randomLocation(), 'greenFishBackwards', 3, [-1,-1,-width],0,18,true);
    fishInPlay.push(greenFish2);

    const redFish2 = new Fish(randomLocation(), 'redFishBackwards', 4, [1],0,16,true);
    fishInPlay.push(redFish2);


    if (Math.floor(Math.random()*4) === 0){
      const treasure = new Fish(203, 'treasure', 20, [0],0,10,true);
      fishInPlay.push(treasure);
    }


    console.log(fishInPlay);
  }


  function moveFish(){

    fishInPlay.forEach(fish => fish.move());

  }


  function checkIfCaught(){

    fishInPlay.forEach(fish => {
      if((fish.location === subLocation) && (fish.alive)){


        $cells.eq(subLocation).addClass('shadow-pulse');
        $cells.eq(subLocation).on('animationend', function(){
          $cells.eq(subLocation).removeClass('shadow-pulse');
          // do something else...
        });

        // $cells.eq(subLocation).css({border: '10px solid orange'});
        // $cells.eq(subLocation).css({boxShadow: '0px 0px 300px 200px orange;'});
        // $cells.eq(subLocation).animate({right: '0px'}, 200);
        // $cells.eq(subLocation).animate({border: '1px solid orange'}, 500);
        // box-shadow: 0px 0px 300px 200px orange;

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


        movingLeft = false;

        if (mineLocations.includes(subLocation+1)) {
          console.log('BANG');
          mineExploded(subLocation+1);
        } else if ((subLocation+1)%width !== 0) {
          moveSub(1);
          $cells.eq(subLocation).css({right: '100px'});
          $cells.eq(subLocation).animate({right: '0px'}, 200);
        }

      }

      // --- LEFT ARROW ---
      if (e.keyCode === 37) {
        e.preventDefault();

        movingLeft = true;

        if (mineLocations.includes(subLocation-1)) {
          console.log('BANG');
          mineExploded(subLocation-1);
        } else if (subLocation%width !== 0){
          moveSub(-1);
          $cells.eq(subLocation).css({right: '-100px'});
          $cells.eq(subLocation).animate({right: '0px'}, 200);
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
          $cells.eq(subLocation).css({top: '-100px'});
          $cells.eq(subLocation).animate({top: '0px'}, 300);
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
          $cells.eq(subLocation).css({top: '100px'});
          $cells.eq(subLocation).animate({top: '0px'}, 300);
        }
      }

    }

  }

});
