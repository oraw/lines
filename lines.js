// Логика программы
import {CreateArray, ROWS, Board, SetBall, ShowError, ShowBoard, ClearBall,
		SetBalls, ShowBalls, NumOfBalls, DeleteAnimate}   from './show.js';

// Объект для обмена модулей 
export let objClick = 
{
	xFrom:0, 
	yFrom:0,
	xTo:0, 
	yTo:0,
	IsMove:0,
	Lost:0,
	NumOfPoints:0
};

export let DelBuf = []; 	// буфер для удаляемых шариков
export let DelColor; 		// цвет удаляемых шариков


//Щелчок на пустом поле
export function SpaceClick()
{
    if(objClick.IsMove) //если шарик уже выбран
    {
        if(IsPath(objClick.xFrom, objClick.yFrom, objClick.xTo, objClick.yTo))
        {
            // есть возможность переместить шарик
            MoveBall(objClick.xFrom, objClick.yFrom, objClick.xTo, objClick.yTo);
            objClick.IsMove=false;
            // проверка пяти в ряд
            if(!IsFive(objClick.xTo,objClick.yTo, true))
            {
				SetLostBalls();
            }     
        }
        else // нельзя переместить шарик
        {
            ShowError("Invalid move");
        }
    }
}

function MoveBall(xFrom, yFrom, xTo, yTo)
{
    SetBall(xTo, yTo, Board[xFrom][yFrom]);
    SetBall(xFrom, yFrom, 0);
    ClearBall(xFrom, yFrom);    
}

function SetLostBalls()
{
    // Смотрим, сколько свободных полей осталось
    // и кидаем шарики
    objClick.Lost = ROWS*ROWS-NumOfBalls;
    if(objClick.Lost>=3) 
    {
		SetBalls(3);
	}
    else 
    {
		// Игра закончена
		SetBalls(objClick.Lost);
	}	
}

function IsPath(xFrom, yFrom, xTo, yTo)
{

    let IsFound = false;
    let iField = [];
    iField = CreateArray(ROWS, ROWS);  
    let i,j;

    for(j=0;j<ROWS;j++)
    {
        for(i=0;i<ROWS;i++)
        {
            iField[i][j]=Board[i][j];
        }
    }

    let iMaxPathLength=ROWS*ROWS+1;
    iField[xFrom][yFrom]=-1;        //начальная точка
    iField[xTo][yTo]=iMaxPathLength;//конечная точка
    let iNextSearch=-1;
    let bContSearch = true;
    while(bContSearch)
    {
        bContSearch=false;
        for(j=0; j<ROWS; j++)
        {
            for(i=0; i<ROWS; i++)
            {
                //найдено очередное поле для перемещения.
                if(iField[i][j]==iNextSearch){
                    //начинаем обследовать его соседей
                    //поле располжено слева
                    let bIsLeft=(i==0);
                    //поле расположено справа
                    let bIsRight=(i==(ROWS-1));
                    //поле расположено сверху
                    let bIsTop=(j==0);
                    //поле расположено снизу
                    let bIsButtom=(j==(ROWS-1));
                    if(!bIsLeft)
                    {
                        //если это искомое поле.
                        if(iField[i-1][j]==iMaxPathLength)
                        {
                            IsFound=true;
                            return IsFound;
                        }
                        if(iField[i-1][j]==0)
                        {//если поле слева свободно
                            iField[i-1][j]=iNextSearch-1;
                            bContSearch = true;
                        }
                    }
                    if(!bIsRight)
                    {
                        //если это искомое поле
                        if(iField[i+1][j]==iMaxPathLength)
                        {
                            IsFound=true;
                            return IsFound;
                        }
                        //если поле справа свободно
                        if(iField[i+1][j]==0)
                        {
                            iField[i+1][j]=iNextSearch-1;
                            bContSearch = true;
                        }
                    }
                    if(!bIsTop)
                    {
                        // если это искомое поле.
                        if(iField[i][j-1]==iMaxPathLength)
                        {
                            IsFound=true;
                            return IsFound;
                        }
                        // если поле сверху свободно
                        if(iField[i][j-1]==0)
                        {
                            iField[i][j-1]=iNextSearch-1;
                            bContSearch = true;
                        }
                    }
                    if(!bIsButtom)
                    {
                        // если это искомое поле
                        if(iField[i][j+1]==iMaxPathLength)
                        {
                            IsFound=true;
                            return IsFound;
                        }
                        // если поле снизу свободно
                        if(iField[i][j+1]==0)
                        {
                            iField[i][j+1]=iNextSearch-1;
                            bContSearch = true;
                        }
                    }
                }
            }
        }
        iNextSearch--;

    };

    return IsFound;
}

// Проверяет, есть ли 5 или более шариков подряд
function IsFive(x, y, bAddPoints)
{

    let i;//смещение относительно точки (x, y)
    let bSeeFuther;//смотрим ли далее
    //число совпадений вправо, влево, вверх и вниз
    let iO=0, iW=0, iN=0, iS=0; 
    //число совпадений вправо-вверх, влево-вверх, вправо-вниз и влево-вниз
    let iNO=0, iNW=0, iSO=0, iSW=0;
    let bRes = false;//возвращаемое значение

    //смотрим вправо
    bSeeFuther = true;
    i=1;
    while(x+i<ROWS && bSeeFuther)
    {
        //если поле справа существует
        bSeeFuther=false;
        if(Board[x+i][y]==Board[x][y])
        {//и его цвет совпадает с цветом (x,y)
            iO++;//увеличиваем счётчик совпадений вправо
            bSeeFuther=true;
        }
        i++;
    };

    // смотрим влево
    bSeeFuther=true;
    i=1;
    while(x-i>=0 && bSeeFuther)
        {//если поле справа существует
        bSeeFuther=false;
        if(Board[x-i][y]==Board[x][y])
        {//и его цвет совпадает с цветом (x,y)
            iW++;//увеличиваем счётчик совпадений вправо
            bSeeFuther=true;
        }
        i++;
    };

    // смотрим вниз
    bSeeFuther=true;
    i=1;
    while(y+i<ROWS && bSeeFuther)
    {	//если поле справа существует
        bSeeFuther=false;
        if(Board[x][y+i]==Board[x][y])
        {//и его цвет совпадает с цветом (x,y)
            iS++;//увеличиваем счётчик совпадений вправо
            bSeeFuther=true;
        }
        i++;
    };

    // смотрим вверх
    bSeeFuther=true;
    i=1;
    while(y-i>=0 && bSeeFuther)
    {//если поле справа существует
        bSeeFuther=false;
        if(Board[x][y-i]==Board[x][y])
        {//и его цвет совпадает с цветом (x,y)
            iN++;//увеличиваем счётчик совпадений вправо
            bSeeFuther=true;
        }
        i++;
    };
    /////////////проверки диагоналей/////////////
    //смотрим вправо-вниз
    bSeeFuther=true;
    i=1;
    //если поле справа внизу существует
    while(x+i<ROWS && y+i<ROWS && bSeeFuther)
    {
        bSeeFuther=false;
        if(Board[x+i][y+i]==Board[x][y])
        {//и его цвет совпадает с цветом (x,y)
            iSO++;//увеличиваем счётчик совпадений вправо
            bSeeFuther=true;
        }
        i++;
    };

    //смотрим вверх-влево
    bSeeFuther=true;
    i=1;
    while(x-i>=0 && y-i>=0 && bSeeFuther)
    {//если поле слева вверху существует
        bSeeFuther=false;
        if(Board[x-i][y-i]==Board[x][y])
        {//и его цвет совпадает с цветом (x,y)
            iNW++;//увеличиваем счётчик совпадений вправо
            bSeeFuther=true;
        }
        i++;
    };

    //смотрим вправо-вверх
    bSeeFuther=true;
    i=1;
    while(x+i<ROWS && y-i>=0 && bSeeFuther)
    {//если поле справа вверху существует
        bSeeFuther=false;
        if(Board[x+i][y-i]==Board[x][y])
        {//и его цвет совпадает с цветом (x,y)
            iNO++;//увеличиваем счётчик совпадений вправо
            bSeeFuther=true;
        }
        i++;
    };

    // смотрим вниз-влево
    bSeeFuther=true;
    i=1;
    while(x-i>=0 && y+i<ROWS && bSeeFuther)
    {//если поле слева внизу существует
        bSeeFuther=false;
        if(Board[x-i][y+i]==Board[x][y])
        {//и его цвет совпадает с цветом (x,y)
            iSW++;//увеличиваем счётчик совпадений вправо
            bSeeFuther=true;
        }
        i++;
    };

    // запоминаем, сколько шариков было до удаления
    let iWasNumOfBalls = NumOfBalls;
    if(iS+iN+1>=5)
    {   // Есть 5 в ряд
        //console.log("5 в ряд по вертикали");

        Delete5InLine(x,y-iN,x,y+iS);
        bRes=true;
        //return true;
    }
    if(iO+iW+1>=5)
    {   //есть 5 в ряд
        //console.log("5 в ряд по горизонтали");
        Delete5InLine(x-iW,y,x+iO,y);
        bRes=true;
        //return true;
    }

    //есть 5 в ряд по диагонали слева-сверху справа-снизу
    if(iNW+iSO+1>=5)
    {
        //console.log("5 в ряд по диагонали слева-сверху справа-снизу");
        Delete5InLine(x-iNW,y-iNW,x+iSO,y+iSO);
        bRes=true;
        //return true;
    }

    //есть 5 в ряд по диагонали справа-сверху слева-снизу
    if(iSW+iNO+1>=5)
    {
        //console.log("5 в ряд по диагонали справа-сверху слева-снизу");
        Delete5InLine(x+iNO,y-iNO,x-iSW,y+iSW);
        bRes=true;
        //return true;
    }

    if(bAddPoints)
    {
        objClick.NumOfPoints+=CalcPoints(iWasNumOfBalls-NumOfBalls);
    }
    return bRes;//нет 5 в ряд
}


function Delete5InLine(x1, y1, x2, y2)
{
    //удаляет n шариков, расположенных в ряд
    //от поля (x1, y1) до поля (x2, y2).

    let DelNum=0; //число удаляемых шариков
    DelColor=Board[x1][y1];
    DelBuf = CreateArray(ROWS, ROWS);

    let i;
    //удаление по горизонтали
    if(y1==y2)
    {
        for(i=x1;i<=x2;i++)
        {
            if(Board[i][y1]!=0)
            {
                DelBuf[DelNum][0]=i;
                DelBuf[DelNum][1]=y1;
                DelNum++;
                SetBall(i,y1,0);
            }
        }
    }
    //удаление по вертикали
    if(x1==x2)
    {
        for(i=y1;i<=y2;i++)
        {
            if(Board[x1][i]!=0)
            {
                DelBuf[DelNum][0]=x1;
                DelBuf[DelNum][1]=i;
                DelNum++;
                SetBall(x1,i,0);                
            }
        }
    }
    //удаление по диагонали сверху-слева - снизу-справа
    if((x1<x2) && (y1<y2))
    {
        for(i=x1;i<=x2;i++)
        {
            if(Board[i][y1-x1+i]!=0)
            {
                DelBuf[DelNum][0]=i;
                DelBuf[DelNum][1]=y1-x1+i;
                DelNum++;

                SetBall(i,y1-x1+i,0);
            }
        }
    }
    //удаление по диагонали снизу-слева - сверху-справа
    if((x1>x2) && (y1<y2))
    {
        for(i=y1;i<=y2;i++)
        {
            if(Board[x1+y1-i][i]!=0)
            {
                DelBuf[DelNum][0]=x1+y1-i;
                DelBuf[DelNum][1]=i;
                DelNum++;

                SetBall(x1+y1-i,i,0);
            }
        }
    }
    DeleteAnimate(DelNum);
}

function  CalcPoints(iNumDeletedBalls)
{
    let iRes;

    if(iNumDeletedBalls<5)
    {
        return 0;
    }
    else
    {
        iRes = 2* iNumDeletedBalls*iNumDeletedBalls
            -20*iNumDeletedBalls+60;
    }
    return iRes;
}

