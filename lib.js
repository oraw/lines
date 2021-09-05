// Модуль lib
// Измените таймер обратного отсчета так, чтобы обратный 
// отсчет начинался с пяти (5, 4, 3…) и останавливался на нуле. 
// После этого должно появится анимационное сообщение “Акция закончена”. 
// Эффекты появления и исчезновения не должны совпадать с примерами в уроке.

let clock;

function ButtonStart()
{
	//Конечная дата таймера
	let timerDate = new Date("2020-10-29 05:02:12 pm"); 
	
	// Текущая дата
	let currentDate = new Date(); 
	
	// Получаем разницу
	let diff = timerDate.getTime() - currentDate.getTime();
	
	// Устанавливаем нужное время в секундах
	clock.setTime(diff/1000); 
	
	// Запускаем отсчет
    clock.start(); 				
}

export function InitFlipClock()
{ 

		$(document).ready(function() {
			
			clock = $('.clock').FlipClock(10, {
		        clockFace: 'MinuteCounter',
		        countdown: true,
		        autoStart: false,
		        callbacks: {
		        	start: function() {
		        		$('.message').html('Акция началась!');
		        	},
		        	stop: function() {
		        		$('.message').html('Акция закончена!');
		        	}
		        }
		    });

		    $('.start').click(function(e) {

		    	clock.start();
		    });

		});
		
}

export function InitButton()
{ 
	$("#btn_rules").click(btn_rules);
	$("#btn_settings").click(btn_settings);
}

function Button1()
{
	//let dialog = new Messi('Простое сообщение');	
    var dialog = new Messi(
    'This message will close automatically!',
    {autoclose: 1000}
    );
}

function Button2()
{   
	var dialog = new Messi(
    'This is a message with Messi with custom buttons on the bottom.',
    {
        title: 'Buttons',
        buttons: [
            {id: 0, label: 'Yes', val: 'Y', class: 'btn-success'},
            {id: 1, label: 'No', val: 'N', class: 'btn-danger'},
            {id: 2, label: 'Cancel', val: 'C'}
        ]
    }
);
	
}

function btn_rules()
{

//<br><br>To set your parameters, go to Settings.
var dialog = new Messi(
    'On a 9x9 board (default size), 3 balls of different colors appear each move (seven colors in total). <br><br>You need to make lines of the same color in five or more pieces horizontally, vertically or diagonally (hence the original name Lines - Lines). <br><br>Only one ball can be moved in one move and the path between the start and end positions must be clear. <br><br>A path is considered free if it consists of one or more movements of the ball one square vertically or horizontally, but not diagonally. <br><br>If, after moving the ball, a line of the same color with a length of 5 or more balls is formed, then it is destroyed, the player is awarded points (10 for 5 balls, 12 for 6, 18 for 7, 28 for 8, 42 for 9) and the appearance of the next three balls is postponed until next move. <br><br>The goal of the game is to score as many points as possible and hold out as many moves as possible. <br><br>To move the ball, you must first click on the selected ball (the ball starts "jumping" in the cell), and then on the cell where you want to move it. <br>If the ball cannot be moved, a corresponding message will appear at the bottom of the playing field. <br><br>There are also game options with different field sizes and the number of balls lined up.'
    ,
    {
        title: 'Game Rules',
        animate: { open: 'bounceInRight', close: 'bounceOutRight' },
        buttons: [ {id: 0, label: 'Close', val: 'X'} ]
    }
);

}

function btn_settings()
{

var dialog = new Messi(
    'Number of rows<br> Number of columns <br> Ball line length',
    {
        title: 'Game Settings',
        buttons: [ {id: 0, label: 'Accept', val: 'A'},
                   {id: 1, label: 'Default' , val:'D'},
                   {id: 2, label: 'Close', val:'C'} ]
    }
);

}
