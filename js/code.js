window.onload = function(){

    function handlerClic(){

        document.querySelectorAll(".chess-block").forEach(function(e){
                e.classList.remove("possible-moves");
                e.classList.remove("target");
                e.onclick= handlerClic;
            });//очистка поля от подцветки хода
        //let id=this.getAttribute("id");
        if(this.classList.contains(game.player+"Figure")){
            this.classList.add("target");//подсвечиваем выбранную фигуру
            gameLogic.walk(this);
        }

        };

    var gameField = {
        field : [
        [0,1,0,1,0,1,0,1],
        [1,0,1,0,1,0,1,0],
        [0,1,0,1,0,1,0,1],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [2,0,2,0,2,0,2,0],
        [0,2,0,2,0,2,0,2],
        [2,0,2,0,2,0,2,0],
    ],

        creatField : function creatField(){
            let str = "";
            for(let i=1;i<this.field.length+1;i++){
                for(let j=1;j<this.field[i-1].length+1;j++){
                    if(i%2==0 && j%2==0 || i%2!=0 && j%2!=0){
                        str += '<div id = "'+i+j+'" class = "chess-block bg-white"></div>';
                    }
                    else{
                        str += '<div id = "'+i+j+'" class = "chess-block bg-black"></div>';
                    }
                }

            }
            document.querySelector("#field").innerHTML=str;

        },


    };

    function Figure(name,fraction,coordinate){
        this.name = name;
        this.fraction =fraction;
        this.coordinate = coordinate;


    }
    Figure.prototype.move = function(newCoordinate){
        this.coordinate=newCoordinate;

    };


    var game = {
        player : "white",//чей ход
        whiteShapes : [],
        blackShapes : [],

        clearField : function(){
            document.querySelectorAll(".chess-block").forEach(function(e){
                e.classList.remove("whiteFigure");
                e.classList.remove("blackFigure");
                e.classList.remove("possible-moves");
                e.classList.remove("target");

            });
        },

        printShapes: function(){
            for(let i=0;i<this.whiteShapes.length;i++){
                document.getElementById(this.whiteShapes[i].coordinate).classList.add("whiteFigure") ;
                document.getElementById(this.whiteShapes[i].coordinate).onclick = handlerClic;
            }
            for(let i=0;i<this.blackShapes.length;i++){
                document.getElementById(this.blackShapes[i].coordinate).classList.add("blackFigure") ;
                document.getElementById(this.blackShapes[i].coordinate).onclick = handlerClic;
            }

        },

        creatFigure : function (){
            let xWhite = [12,14,16,18,21,23,25,27,32,34,36,38];
            let xBlack = [61,63,65,67,72,74,76,78,81,83,85,87];

            for(let i = 0;i<12;i++){
                this.whiteShapes[i] = new Figure("pawn","white",""+xWhite[i]);
                this.blackShapes[i] = new Figure("pawn","black",""+xBlack[i]);
            }

        },

        deliteFigure: function (id,opponent){
            this[opponent+"Shapes"]=this[opponent+"Shapes"].filter(el=>el.coordinate!=id);

            if (this[opponent+"Shapes"].length === 0){gameLogic.gameOver(opponent);}
        },

        beginGame : function(){
            gameField.creatField();
            this.creatFigure();
            this.printShapes();

        },

    };

    var gameLogic = {
        walk : function(aim){
                let players = ["white","black"];
                let opponent = game.player=="white" ? "black":"white" ;

                let id=aim.getAttribute("id");
                let x =[Number(id)+9,Number(id)+11,Number(id)-9,Number(id)-11];//возможные ходы

                for(let i=0;i<x.length;i++){
                    let element = document.getElementById(x[i]);
                    if(element){
                        if(element.classList.contains(game.player+"Figure")){}//если наша фигура то пусто

                        else if(element.classList.contains(opponent+"Figure")){//если черная фигура
                            let y = x[i]+x[i]-Number(id);//получаем координату за ней
                       if(document.getElementById(y)){ if(!document.getElementById(y).classList.contains(game.player+"Figure")&&!document.getElementById(y).classList.contains(opponent+"Figure")){//если пусто

                            document.getElementById(y).classList.add("possible-moves");//подсвечиваем возможные ходы
                            document.getElementById(y).onclick = function(){//вешаем события на подсвеченные клетки
                                    game[game.player+"Shapes"].forEach(function(e){

                                    if(e.coordinate==id){
                                        e.move(y);


                                        game.deliteFigure(x[i],opponent);
                                        game.clearField();
                                        game.printShapes();
                                        //надо придумать как продолжить ход если это возможно
                                        gameLogic.repeatMove(game.player,opponent,e.coordinate);
                                        game.printShapes();

                                        game.player=opponent;
                                        document.getElementById("info").innerHTML=(opponent=="white") ? "Ход белых":"Ход черных";

                                    }
                                });

                            };//вешаем события на подсвеченные клетки

                            }}
                        }//если черная фигура
                        else{//если пусто
                            if((game.player=="white" && i<2)||(game.player!="white" && i>1)){
                                element.classList.add("possible-moves");//подсвечиваем возможные ходы
                                element.onclick = function(){
                                    game[game.player+"Shapes"].forEach(function(e){

                                        if(e.coordinate==id){
                                            e.move(x[i]);
                                            game.clearField();
                                            game.printShapes();
                                            game.player=opponent;
                                            document.getElementById("info").innerHTML=(opponent=="white") ? "Ход белых":"Ход черных";

                                        }
                                    });

                                };//вешаем события на подсвеченные клетки
                            }
                        }//если пусто
                    }
                }//конец цикла
           // }

        },

        gameOver : function(opponent){
            alert(opponent=="black" ? "Белые победили" : "Черные победили");
            game.clearField();
            game.beginGame();
        },

        repeatMove : function(player,opponent,aimId){

            let x =[aimId+9,aimId+11,aimId-9,aimId-11];//возможные ходы
            document.querySelectorAll(".chess-block").forEach(e=>e.onclick=null);
        for(let i=0;i<x.length;i++){
            if(document.getElementById(x[i])){
            if(document.getElementById(x[i]).classList.contains(opponent+"Figure")){
            let y = x[i]+x[i]-aimId;//получаем координату за ней
                if(document.getElementById(y)){
            if(!document.getElementById(y).classList.contains(player+"Figure")&&!document.getElementById(y).classList.contains(opponent+"Figure")){//если пусто

                document.getElementById(y).classList.add("possible-moves");//подсвечиваем возможные ходы\

                document.getElementById(y).onclick = function(){//вешаем события на подсвеченные клетки
                    game[player+"Shapes"].forEach(function(e){

                        if(e.coordinate==aimId){
                            e.move(y);

                            game.deliteFigure(x[i],opponent);
                            game.clearField();
                            game.printShapes();
                            gameLogic.repeatMove(player,opponent,e.coordinate);


                        }
                    });

                };//вешаем события на подсвеченные клетки

            }}//else{return}
            }}
            game.printShapes();
          }
        }
    };

game.beginGame();

}
