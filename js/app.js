const width = 8;
const numberOfCells = 56;
const subInitialLocation = 22;
let fishTimerId = 0;
let fishTimerId2 = 0;
let gameTimerId = 0;
let generateFishTimerId = 0;
let points = 0;
let gameRunning = false;

const rowsObject = {
  //row: [most left, most right]
  row0: [0,7],
  row1: [8,15],
  row2: [16,23],
  row3: [24,31],
  row4: [32,39],
  row5: [40,47],
  row6: [48,55]
};

const rows = Object.keys(rowsObject);

function randomRow(){
  return Math.floor(Math.random()*(rows.length));
}
// //** tests **
// console.log('random row is ' + rows[randomRow()]);
// console.log('random key is ' + rowsObject[rows[randomRow()]]);
// console.log('random MostLeft is ' + rowsObject[rows[randomRow()]][0]);


let fishLocation = -1;
let fishLocation2 = -1;


$(() => {
  console.log('DOM loaded');
  const $cells = $('.cell');
  const $pointDisplay = $('#points');
  // const $cellContainer = $('.cellContainer');


  let subLocation = subInitialLocation;
  $cells.eq(subLocation).addClass('submarine');


  // $cells.eq(fishLocation).addClass('fish');

  function moveFish(number){
    $cells.eq(fishLocation).removeClass('fish');
    fishLocation += number;
    console.log(fishLocation);
    $cells.eq(fishLocation).addClass('fish');
  }

  function moveFish2(number){
    $cells.eq(fishLocation2).removeClass('fish');
    fishLocation2 += number;
    console.log(fishLocation2);
    $cells.eq(fishLocation2).addClass('fish');
  }
  //


  generateFishTimerId = setInterval( ()=>{
    fishLocation = rowsObject[rows[randomRow()]][0] -1;

    fishTimerId = setInterval( ()=>{
      moveFish(1);
      if ((fishLocation+1)%width === 0){
        clearInterval(fishTimerId);
        $cells.eq(fishLocation).removeClass('fish');
        fishLocation = -1;
      }
    },200);
    console.log(fishTimerId);


    fishLocation2 = rowsObject[rows[randomRow()]][1] +1;

    fishTimerId2 = setInterval( ()=>{
      moveFish2(-1);
      if ((fishLocation2)%width === 0){
        clearInterval(fishTimerId2);
        $cells.eq(fishLocation2).removeClass('fish');
        fishLocation2 = -1;
      }
    },200);
    console.log(fishTimerId2);

  },6000);


  function checkIfCaught(){
    if((subLocation === fishLocation)||(subLocation === fishLocation2)){
      console.log('FISH CAUGHT');
      points++;
      $pointDisplay.text(points);
      console.log(`POINTS ARE ${points}`);
      $cells.eq(fishLocation).removeClass('fish');
      $cells.eq(fishLocation2).removeClass('fish');
      fishLocation = -1;
      fishLocation2 = -1;
      clearInterval(fishTimerId);
      clearInterval(fishTimerId2);


    }
  }



  function runGame(){
    gameRunning = true;
    gameTimerId = setInterval( ()=>{
      checkIfCaught();
    },100);
    timeCountDown();
  }

  //Moving submarine
  function moveSub(number) {
    $cells.eq(subLocation).removeClass('submarine');
    $cells.eq(subLocation).removeClass('movingLeft');
    subLocation += number;
    console.log(subLocation, fishLocation);
    $cells.eq(subLocation).addClass('submarine');
  }


  function endGame(){
    gameRunning = false;
    clearInterval(gameTimerId);
    clearInterval(generateFishTimerId);
    points = 0;
    $pointDisplay.text(points);
  }


  function timeCountDown(){
    let timeLeft = 15;
    let countDownId = 0;
    countDownId = setInterval(()=>{
      timeLeft--;
      console.log(`${timeLeft} seconds left`);
      if (timeLeft===0){
        clearInterval(countDownId);
        endGame();
      }
    }, 1000);
  }


  $(document).on('button-up');
  $(window).on('keydown', keypressed);


  function keypressed(e){
    // ** TEST **
    // if (e.keyCode === 65){
    //   console.log('A pressed');
    //   //a key
    //   moveFish(1);
    //   console.log(randomRow());
    // }
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


  // let i=0;
  // $cell.each($cell, ()=>{
  //   $cell.attr('id', i);
  //   i++;
  // });

  // let subLocation = 0;
  // $cell.addClass('submarine');
  // $cell[subLocation].addClass('submarine');

  // setInterval(()=>{
  //   $cells.eq(subLocation).removeClass('submarine');
  //   subLocation++;
  //   $cells.eq(subLocation).addClass('submarine');
  // }, 500);

  // console.dir($cell[0]);
  //
  //
  // console.log($cell.hasClass('submarine'));
  //
  // // $cell.removeClass('submarine');
  // const submarineLocation = $cell.closest('.submarine');
  // const subLocationIndex = $cell.closest('.submarine').childElementCount();
  //
  // console.log(submarineLocation);
  // console.log(subLocationIndex);

});
