const width = 8;
const numberOfCells = 56;

$(() => {
  console.log('DOM loaded');
  const $cells = $('.cell');
  const $cellContainer = $('.cellContainer');

  console.dir($cells.eq(1));
  console.dir($cellContainer);

  let subLocation = 17;
  $cells.eq(subLocation).addClass('submarine');

  function moveSub(number) {
    $cells.eq(subLocation).removeClass('submarine');
    $cells.eq(subLocation).removeClass('movingLeft');
    subLocation += number;
    console.log(subLocation);
    $cells.eq(subLocation).addClass('submarine');
  }

  $(document).on('button-up');
  $(window).on('keydown', keypressed);


  function keypressed(e){
    if ((e.keyCode === 39) && ((subLocation+1)%width !== 0)){
      //right arrow
      moveSub(1);

    }
    if ((e.keyCode === 37) && (subLocation%width !== 0)){
      //left arrow
      moveSub(-1);
      $cells.eq(subLocation).addClass('movingLeft');
    }
    if ((e.keyCode === 40) && (subLocation+width < numberOfCells)){
      //down arrow
      moveSub(width);
    }
    if ((e.keyCode === 38) && (subLocation-width+1 > 0)){
      //up arrow
      moveSub(-width);
    }
  }
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
