// Интерфейс программы
import {SpaceClick, objClick, DelBuf, DelColor}   from './lines.js';

export const ROWS =  9;  	// количество рядов
const COLORS = 7   	// количество цветов
const LEN = 40    	// размер шарика
const CELL = 45    	// размер ячейки игрового поля
const BAR = 50    	// высота шапки

export let NumOfBalls; 	// количество шариков на поле
export let Board = []; 	// массив, задающий игровое поле
// Нумерация полей начинается с нуля
// Нумерация шариков с единицы. Ноль - шарика нет на поле

let canvas; 		// холст
let ctx; 			// контекст рисования

let spriteJump;		// спрайт анимации шарика
let spriteDel=[];	// массив спрайтов удаления
let isAnimate;		// есть ли анимация шарика
let jumpX, jumpY;	// координаты анимации
let jumpColor;		// цвет шарика
let requestId;		// Код анимации шарика 
let requestIdOut;	// Код анимации удаления 
let audioJump;		// Звук прыгающего шарика 
let audioDelete;	// Звук удаления шариков
let audioStart;	    // Звук старт игры

export function InitBoard() 
{
	// Игровое поле
	canvas = document.getElementById("draw");
	canvas.width = 407;
	canvas.height = 414+BAR;
    ctx = canvas.getContext("2d");
   
    // Создаем массив для хранения игрового поля
    Board = CreateArray(ROWS, ROWS);
    
    // Выводим счет
    InitBar();
    ShowPoints();

    // Включаем обработку кликов мыши 
    InitClick();    
    
   	audioJump = new Audio('jump.mp3');
	audioDelete = new Audio('delete.mp3');  
	
	audioStart = new Audio('243020__plasterbrain__game-start.ogg'); 	
	//audioStart = new Audio('gamestart.ogg');     
}

export function StartGame()
{
    NumOfBalls = 0; 			// На поле нет шариков
    objClick.NumOfPoints = 0;	// Обнуляем очки
    objClick.IsMove = 0; 		// Обнуляем число нажатий мыши

	// Отображаем доску
	ShowBoard();

	// Выводим счет
    ShowPoints();

    // Звук начала игры
    PlayStartSound();

    // Обнуляем игровое поле
    for(let j=0; j<ROWS; j++)
    {
        for(let i=0; i<ROWS; i++)
        {
            Board[i][j]=0; 
        }
    }
    
    // Бросаем пять шариков
	SetBalls(5); 
	//TestAnimate(2, 2, 2);
	
}

export function ShowBoard()
{
    // Создаем объект для рисования фона
    let picBoard = new Image();  
	picBoard.src = "board.png"; 
	// Отображаем картинку после ее загрузки
    picBoard.onload = function() 
    {    
        ctx.drawImage(picBoard, 0, BAR);
    }   
}


export function SetBall(x, y, ColorOfBall)
{
    //Устанавливает или убирает шарик
    Board[x][y]=ColorOfBall;
    if(ColorOfBall>0)   
    {
		NumOfBalls++;
	}
    else 
    {               
		NumOfBalls--;
	}	
}

export function SetBalls(NumBalls)
{
    let i, x, y; //переменная цикла и координаты шарика
    let ColorOfBall; //цвет шарика

    if(NumBalls != 0)
    {
        for(i=0; i<NumBalls; i++)
        {
            //выбор свободного места
            do
            {
                x = getRandomInRange(0, ROWS-1);
                y = getRandomInRange(0, ROWS-1);
            }while(Board[x][y]!=0);

            //выбор цвета
            ColorOfBall=getRandomInRange(1, COLORS);
            SetBall(x,y,ColorOfBall); //ставим шарик нужного цвета
        }
        ShowBalls();
        return true;
    }
    else
    {
        ShowBalls();
        ShowMessage("Игра закончена!");
        return false;
    }
}


export function CreateArray(rows, columns) 
{
	let arr = new Array();
	for (let i = 0; i < rows; i++) 
	{
		arr[i] = new Array();

		for (let j = 0; j < columns; j++) 
		{
			arr[i][j] = 0;
		}
	}
	return arr;
}


// Вывод шариков
export function ShowBalls()
{
    // Если есть анимация, то останавливаем
    StopBallAnimate();		
    // Проходим по доске и отображаем все шарики
    for (let i=0; i<ROWS; i++)
    {
        for (let j=0; j<ROWS; j++)
        {
            if (Board[i][j]>0)
            {
				ShowBall(i, j, Board[i][j]);
			}	
        }
    }	
}

function ShowBall(i, j, ColorOfBall)
{
    let sx; //Смещение картинки шарика по горизонтали
    let sy; //Смещение картинки шарика по вертикали

    //Определяем смещение в зависимости от цвета и позиции шарика
    sx = 0;
    sy = (ColorOfBall-1)*LEN;

    //Определяем целевые позиции в зависимости от цвета
    let dx = i*CELL+4; //Позиция по горизонтали на игровом поле
    let dy = j*CELL+8+BAR; //Позиция по вертикали на игровом поле

    // Вывод шарика
    let picBalls = new Image();  
    picBalls.src = 'balls.png';     
	picBalls.onload = function() 
    {    
		ctx.drawImage(picBalls, sx, sy, LEN, LEN, dx, dy, LEN, LEN);
	}	
	
}

// Удаление шарика
export function ClearBall(i, j)
{
    let sx; 
    let sy; 

    sx = 4;
    sy = 7;

    let dx = i*CELL+4; //Позиция по горизонтали на игровом поле
    let dy = j*CELL+8+BAR; //Позиция по вертикали на игровом поле

    // Вывод доски
    let pic = new Image();  
    pic.src = 'board.png';
	pic.onload = function() 
    {    
        ctx.drawImage(pic, sx, sy, LEN, LEN, dx, dy, LEN, LEN);
    }
}


function TestShowOne()
{
    ShowBall(1, 1, 4);
    objClick.NumOfPoints++;
    ShowPoints();
}

function getRandomInRange(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function InitBar()
{
	// Кнопка Старт
	ctx.fillStyle = "#C5C5C5";
	ctx.fillRect(0, 0, 203, BAR);
	  
	ctx.fillStyle = "white";
	ctx.font = "normal 12pt Arial";
	ctx.fillText("Start", 77, 32);

	// Область счета
	ctx.fillStyle = "black";
	ctx.fillRect(203, 0, 204, BAR);	
}	

// Вывод счета
function ShowPoints()
{
	ctx.fillStyle = "black";
	ctx.fillRect(203, 0, 204, BAR);

	ctx.fillStyle = "white";
	ctx.font = "normal 18pt Arial";
	ctx.textAlign = "right";
	
	ctx.fillText(String(objClick.NumOfPoints), 307, 32);	
}	

function InitClick()
{
    // обрабатываем клики мышью
    canvas.onclick = function (e) 
    { 
        let x = (e.pageX - canvas.offsetLeft) | 0;
        let y = (e.pageY - canvas.offsetTop)  | 0;
        Click(x, y); 
    };
    // обрабатываем касания пальцем
    canvas.ontouchend = function (e) 
    { 
        let x = (e.touches[0].pageX - canvas.offsetLeft) | 0;
        let y = (e.touches[0].pageY - canvas.offsetTop)  | 0;
        Click(x, y);
    };
}

function Click(x, y)
{
	//TestMouseClick(x, y);
	MouseClick(x, y);
}


function TestMouseClick(x, y)
{
    // Проверка на попадание в шапку
    if (y<BAR)
    {
		objClick.NumOfPoints++;
		ShowPoints();
		return;
	}
    //координаты выбранного шарика
    let x0, y0, color;     

    x0=parseInt(x/CELL);
    y0=parseInt((y-BAR)/CELL);

    if(Board[x0][y0]!=0)
    {
        //Если кликаем на шарике, то убираем его
        Board[x0][y0] = 0;
        ClearBall(x0, y0);
    }
    else
    {
        // Если кликаем на пустом поле, то ставим шарик случайного цвета
        Board[x0][y0] = getRandomInRange(1, COLORS);
        ShowBall(x0, y0, Board[x0][y0]);
    }
}


function MouseClick(x, y)
{
    let x0, y0;
    
    // Проверка на кнопку "Старт"
    if (x<200 && y<BAR)
    {
		StartGame();
		return;
	}

	// Получаем координаты клика
    x0 = parseInt(x/CELL);
    y0 = parseInt((y-BAR)/CELL);
    objClick.xTo = parseInt(x/CELL);
    objClick.yTo = parseInt((y-BAR)/CELL);

    if(Board[x0][y0]!=0)
    {
        // Если кликаем на шарике
        StopBallAnimate();
        objClick.IsMove=true;
        objClick.xFrom=x0;
        objClick.yFrom=y0;
        BallAnimate();
    }
    else
    {
        // Если кликаем на пустом поле
        StopBallAnimate();
        SpaceClick();
    }

    // Проверяем, есть не все ли клетки заняты
    // Если да, то заканчиваем игру
    objClick.Lost = ROWS*ROWS-NumOfBalls;
    if(objClick.Lost == 0)
    {
        ShowMessage("Игра закончена");
    }
    // Показываем счет
	ShowPoints();
}


function ShowMessage(s)
{
	let dialog = new Messi
	(
		s,
		{
			autoclose: 1000,
			padding: '20px',
			width:	'150px'				
		}
	);
}

export function ShowError(s)
{
	let dialog = new Messi(
		s,
		{
			autoclose: 1000,
			padding: '20px',
			width:	'170px'				
		}
	);
}

// Анимация выбранного шарика
function BallAnimate()
{
	// Если уже есть анимация шарика, останавливаем
    StopBallAnimate();
	
	let x = objClick.xFrom;
	let y = objClick.yFrom;
	let color = Board[x][y];
	
	StartBallAnimate(x, y, color);
}


function TestDeleteBallAnimate(x, y, color, n)
{
	for(let i=0; i<n; i++)
	{
		DeleteBallAnimate(x+i*CELL, y, color);
	}	

}

// Анимация исчезновения шариков
export function DeleteAnimate(DelNum)
{
    let x,y;

	// Цикл по буферу удаляемых шариков
	for(let j=0; j<DelNum; j++)
	{
		x = DelBuf[j][0];
		y = DelBuf[j][1];
		StartDeleteAnimate(x, y, DelColor);
	}	
}



// Начинаем анимацию шарика 
function StartBallAnimate(x, y, color)
{
	isAnimate = true;
	jumpX = x;
	jumpY = y;
	jumpColor = color;
	let spriteImage = new Image();
	spriteImage.src = 'jumpballs.png';

	// Количество кадров
	let numberOfFrames = 6;
	// Текущий кадр	
	let frame = 0; 

    let sx; //Смещение картинки шарика по горизонтали
    let sy; //Смещение картинки шарика по вертикали

    //Определяем смещение в зависимости от цвета и позиции шарика
    sx = 0;
    sy = (color-1)*LEN;

    //Определяем целевые позиции в зависимости от цвета
    let dx = x*CELL+4; //Позиция по горизонтали на игровом поле
    let dy = y*CELL+7+BAR; //Позиция по вертикали на игровом поле

	let timeStart = Date.now(); // время начала вывода кадра
	const Interval = 60;	// интервал вывода кадров
	
	let up = false; // движение вверх
	// Кадр анимации
	function animate() 
	{
		// Готовим следующий кадр
		requestId = requestAnimationFrame(animate);
		
		if (Date.now() - timeStart > Interval) 
		{
			timeStart = Date.now();
	
			// Рисование кадра
			ctx.drawImage(spriteImage, LEN * frame, sy, LEN, 
			LEN, dx, dy, LEN, LEN);
			
			// Переход к следующему кадру
			
			if (up == false)
			{
				frame++;
				if (frame == 1) PlayJumpSound();
				if (frame == numberOfFrames) up = true;
			}
			if (up == true)
			{
				frame--;
				if (frame == 0) up = false;
			}	
		}	
	}

	// Запускаем анимацию 
	requestAnimationFrame(animate);
}

// Останавливаем анимацию шарика
function StopBallAnimate()
{
	if(isAnimate)
    {
		isAnimate = false;
		
		// Остановка звуа
		audioJump.pause();
		audioJump.currentTime = 0;
		
		// Остановка анимации
		cancelAnimationFrame(requestId);
		ShowBall(jumpX, jumpY, jumpColor);
	}	
}


// Запускаем анимацию удаления шариков
function StartDeleteAnimate(x, y, color)
{
	let n = 0;
	let spriteImage = new Image();
	spriteImage.src = 'outballs.png';

	// Количество кадров
	let numberOfFrames = 10;
	// Текущий кадр	
	let frame = 0; 

    let sx; //Смещение картинки шарика по горизонтали
    let sy; //Смещение картинки шарика по вертикали


    //Определяем смещение в зависимости от цвета и позиции шарика
    sx = 0;
    sy = (color-1)*LEN;

    //Определяем целевые позиции в зависимости от цвета
    let dx = x*CELL+4; //Позиция по горизонтали на игровом поле
    let dy = y*CELL+7+BAR; //Позиция по вертикали на игровом поле


	let timeStart = Date.now(); // время начала вывода кадра
	const Interval = 60;	// интервал вывода кадров
	PlayDeleteSound();
	// Кадр анимации
	function animate() 
	{
		// Готовим следующий кадр
		requestIdOut = requestAnimationFrame(animate);

		if (Date.now() - timeStart > Interval) 
		{
			timeStart = Date.now();
	
			// Рисование кадра
			ctx.drawImage(spriteImage, LEN * frame, sy, LEN, 
			LEN, dx, dy, LEN, LEN);
			
			// Переход к следующему кадру
			frame++;
			if (frame == numberOfFrames)
			{
				cancelAnimationFrame(requestIdOut);
				ClearBall(x, y);
			}	
		}	
	}

	// Запускаем анимацию 
	requestAnimationFrame(animate);
}

// Звук прыжка шарика
function PlayJumpSound()
{
	audioJump.play();
}
	
// Звук удаления шариков
function PlayDeleteSound()
{
	audioDelete.play();
}

// Звук начала игра
function PlayStartSound()
{
	audioStart.play();
	
	// Остановка звуа
	//	audioStart.pause();
	//	audioStart.currentTime = 0;
}


