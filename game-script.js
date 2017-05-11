$(function() {

	/* <------------> */
	var firstSquare = [0,1,4,5];
	var secondSquare = [2,3,6,7];
	var thirdSquare = [8,9,12,13];
	var fourthSquare = [10,11,14,15];


	var pos = -1;
	// codes of arrow keys
	var up = 38;
	var down = 40;
	var left = 37;
	var right = 39;
	
	var numbers = 4;
	var rows = 4;
	var cols = 4; 
	var size = rows*cols;

	var userTime = 2; // allowed time for user in minutes

	/* number codes from 1 to 4*/
	var one = 49;
	var two = 50;
	var three = 51;
	var four = 52;

	// Finish Button
	var btnFinish = $('#btnFinish');

	// flags
	var flagStart = 0; //flag to start timer first time only
	var flagCells = 0; // to indicate the number of cells filled by user
	var emptyCells = size - numbers;
	var flagCheck = 0; // flag to check for win everytime after user fills all cells
	
	function init_cells() {
		var randRowsArr = [];
		var randColsArr = [];
		var squaresArr = [];

		var randRow = Math.floor(Math.random() * rows); // takes values from 0 to 3
		var randCol = Math.floor(Math.random() * cols); // takes values from 0 to 3
		var square = Math.floor(Math.random() * numbers); // takes values from 0 to 3

		for(var i=0;i<numbers;) {
			if(!(randRowsArr.includes(randRow))) {
				if(!(randColsArr.includes(randCol))) {
					var cellIndex = randRow*numbers + randCol;
					//check for which square the index is in
					if(firstSquare.includes(cellIndex)) {
						square = 0;
					}
					else if(secondSquare.includes(cellIndex)) {
						square = 1;
					}
					else if(thirdSquare.includes(cellIndex)) {
						square = 2;
					}
					else if(fourthSquare.includes(cellIndex)) {
						square = 3;
					}
					//check if the square has already benn filled
					if(!(squaresArr.includes(square))) {
						$("td:eq("+cellIndex+")").text(i+1).addClass("init");
						i++;
						randRowsArr.push(randRow);
						randColsArr.push(randCol);
						squaresArr.push(square);
					}
					else { //choose another cell Index, to change square
						randRow = Math.floor(Math.random() * rows);
						randCol = Math.floor(Math.random() * cols);
						continue;
					}
				}
				else //choose another column
					randCol = Math.floor(Math.random() * cols);
			}
			else //choose another row
				randRow = Math.floor(Math.random() * rows);
		}
		//only for testing
		console.log(randRowsArr);
		console.log(randColsArr);
	}//<-- End of Init function -->

	init_cells();

	var timerID;
	function setTimer(time) {
		min = parseInt(time);
		sec = 0;
		function startTimer() {
			// Code To Display Time Properly only
			if(sec<10&&min<10){
				$('#timer').html("0"+min+" : 0"+sec);
			}
			else if(sec<10) {
				$('#timer').html(min+" : 0" +sec);
			}
			else if(min<10) {
				$('#timer').html("0"+min+" : "+sec);
			}
			else {
				$('#timer').html(min+" : "+sec);
			}
			// Actual functionality of the code
			if(sec==0) {
				min--;
				sec = 60;
			}
			if(min==-1) {
				// <-- in case of "time up" -->
				clearInterval(timerID);
				btnFinish.trigger('click');
				return;
			}
			sec--;
		}
		startTimer();
		timerID = setInterval(startTimer, 1000);
	}

	// <----- Start Event ----->
	$("body").on("keydown", function(evt) {
		
		//start Timer only once with first key stroke
		if(flagStart===0) {
			setTimer(userTime);
			flagStart = 1;
		}

		var code = evt.which;
		var key = evt.key;

		switch(code) {
			case right:
				$("td").removeClass("pos");
				pos++;
				if(pos==size) 
					pos=0;
				break;
			case left:
				$("td").removeClass("pos");
				pos--;
				if(pos<0)
					pos=size-1;
				break;
			case up:
				$("td").removeClass("pos");
				pos-=cols;
				if(pos<0)
					pos+=size;
				break;
			case down:
				$("td").removeClass("pos");
				pos+=cols;
				if(pos>size-1) 
					pos=pos%cols;
				break;
			case one:
			case two: 
			case three:
			case four:
				//Code to check if cell was empty and increment the Cells flag
				var currentValue = parseInt($(".pos").text());
				if(!($.isNumeric(currentValue))&&flagCheck==0) {
					flagCells++;
					if(flagCells==emptyCells) {
						if(check_for_win()) {
							console.log("win : ",check_for_win());
							clearInterval(timerID);
							btnFinish.trigger('click');
						}
						else {
							console.log("lose : ",check_for_win());
							flagCheck = 1;
						}
					}
				}
				$(".pos").not(".init").text(key);
				//check for win each time after the user fills the whole cells in the table
				if(flagCheck==1) {
					if(check_for_win()) {
						console.log("win : ",check_for_win());
						clearInterval(timerID);
						btnFinish.trigger('click');
					}
					else {
						console.log("lose : ",check_for_win());						
					}
				}
				break;
		}

		// highlight current position
		$("td:eq("+pos+")").addClass("pos");

	});//end of keydown evt on body


	function check_for_win() {
		// check for empty cells , loop on whole array
		for(var i=0; i<size; i++) {
			var currentNumber = parseInt($("td:eq("+i+")").text());
			if(!($.isNumeric(currentNumber))) {
				return false;
			}
		}	

		//loop on rows to check for each row sum
		for(var i=0; i < rows; i++) {
			var rowSum = 0;
			for(var j=0; j < cols; j++) {
				var currentIndex = i*cols + j;
				rowSum += parseInt($("td:eq("+currentIndex+")").text());
			}
			if(rowSum!==10) {
				return false;
			}
		}

		//loop on each col to check for sum		
		for(var i=0; i < cols; i++) {
			var colSum = 0;
			for(var j=0; j < rows; j++) {
				var currentIndex = i + j*rows;
				colSum += parseInt($("td:eq("+currentIndex+")").text());
			}
			if(colSum!==10) {
				return false;
			}
		}

		//loop on each row to check for repeated cells
		for(var i=0; i < rows; i++) {
			var rowNumArr = [];
			for(var j=0; j < cols; j++) {
				var currentIndex = i*cols + j;
				var currentNumber = parseInt($("td:eq("+currentIndex+")").text());
				if(rowNumArr.includes(currentNumber)) {
					return false;
				}
				rowNumArr.push(currentNumber);
			}
		}
		
		//loop on each col to check for repeated cells
		for(var i=0; i < rows; i++) {
			var colNumArr = [];
			for(var j=0; j < cols; j++) {
				var currentIndex = i + j*rows;
				var currentNumber = parseInt($("td:eq("+currentIndex+")").text());
				if(colNumArr.includes(currentNumber)) {
					return false;
				}
				colNumArr.push(currentNumber);
			}
		}

		return true;

	}//<-- End of Win function -->


	btnFinish.on('click', function() {
		if(check_for_win()) {
			$('.modalMessage').addClass('win').html('Congratulations, you won! :)');
			$('.modal').show();
		}
		else {
			$('.modalMessage').addClass('lose').html('Sorry, hard luck!');
			$('.modal').show();
		}
	});//end of button Finish click Event


	$('#ok').on('click', function() {
		$('.modal').hide();
		location.reload();
	});//end of on click event of okay button


	$('#cancel').on('click', function() {
		$('.modal').hide();
	});//end of click event of cancel button


});//end of load evt on document