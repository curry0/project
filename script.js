//Before I start, I would like to tell that this is in JQuery. I have watched a lot of videos, debugging, and got a lot
//help from the internet. 
$.fn.extend({
    animateCss: function (n) {
        this.addClass("animated " + n).one("webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend", function () {
            $(this).removeClass("animated " + n);
        });
    },
});
// declaring variables !
$(
  (function() {
    var data = {
      side: 500,
      turn: "",
      playerToken: "",
      pcToken: "",
      board: [["", "", ""], ["", "", ""], ["", "", ""]],
      boxes: [],
      gameState: 0,
      wins: {
        player: 0,
        pc: 0
      },
      draws: 0,
      winner: "",
      games: 0,
      difficulty: "easy"
     }; //end of data

     //some function that will help us below
    var tictactoe = {
      //Setters and getters------------------------------------------------------------
      pcWins: function() {
        return data.wins.pc;
      },
      playerWins: function() {
        return data.wins.player;
      },
      draws: function() {
        return data.draws;
      },
      games: function() {
        return data.games;
      },
      side: function() {
        return data.side;
      },
      winner: function() {
        return data.winner;
      },
      gameState: function() {
        return data.gameState;
      },
      setGameState: function(state) {
        data.gameState = state;
      },
      setDifficulty: function(diff) {
        if (diff == "hard" || diff == "easy") data.difficulty = diff;
      },
      enableClicks: function() {
        document.getElementById("ticTacToe").style.pointerEvents = "auto";
      },
      disableClicks: function() {
        document.getElementById("ticTacToe").style.pointerEvents = "none";
      },
      setToken: function(token) {
        if (token == "tokenX") {
          data.playerToken = "x";
          data.pcToken = "o";
        } else {
          data.playerToken = "o";
          data.pcToken = "x";
        }
      }, //end of function(token)
      setTurn: function(player) {
        data.turn = player;
      },
      getTurn: function() {
        return data.turn;
      },
      //Canvas methods------------------------------------------------------------
   drawCanvas: function(canvas) {
        var boneH = new Image();
        boneH.src = "https://dl.dropbox.com/s/56koviiyr5b8bqp/bone_h.svg?dl=0";
        var boneV = new Image();
        boneV.src = "https://dl.dropbox.com/s/q8tlo6b5k1avcj2/bone_v.svg?dl=0";
        var side = data.side;
        var ctx = canvas.getContext("2d");
        var patternH = ctx.createPattern(boneH, "repeat");
        var patternV = ctx.createPattern(boneV, "repeat");
        ctx.beginPath();
        ctx.rect(26, 26, 450, 450);
        ctx.fillStyle = "rgba(51, 50, 50, 0.32)";
        ctx.fill();

        //the dimensions of the bones, the board
        ctx.lineWidth = side / 12;
        //horizontal lines
        ctx.beginPath();
        ctx.strokeStyle = patternH;
        //first horizontal line
        ctx.moveTo(0, side / 20);
        ctx.lineTo(side, side / 20);
        ctx.stroke();
        //second horizontal line
        ctx.moveTo(0, side / 3);
        ctx.lineTo(side, side / 3);
        ctx.stroke();
        //third horizontal line
        ctx.moveTo(0, 2 * side / 3);
        ctx.lineTo(side, 2 * side / 3);
        ctx.stroke();
        //fourth horizontal line
        ctx.moveTo(0, side - side / 20);
        ctx.lineTo(side, side - side / 20);
        ctx.stroke();
        //vertical lines
        ctx.beginPath();
        ctx.strokeStyle = patternV;
        //first vertical line
        ctx.moveTo(side / 20, 0);
        ctx.lineTo(side / 20, side);
        ctx.stroke();
        //second vertical line
        ctx.moveTo(side / 3, 0);
        ctx.lineTo(side / 3, side);
        ctx.stroke();
        //third vertical line
        ctx.moveTo(2 * side / 3, 0);
        ctx.lineTo(2 * side / 3, side);
        ctx.stroke();
        //fourth vertical line
        ctx.moveTo(side - side / 20, 0);
        ctx.lineTo(side - side / 20, side);
        ctx.stroke();
        //these are the position where the tokens are held
        //we have 3 x 3top-bottom
        data.boxes = [
          [
            {
              top: {
                x: 0,
                y: 0
              },
              bottom: {
                x: side / 3,
                y: side / 3
              }
            },
            {
              top: {
                x: side / 3,
                y: 0
              },
              bottom: {
                x: 2 * side / 3,
                y: side / 3
              }
            },
            {
              top: {
                x: 2 * side / 3,
                y: 0
              },
              bottom: {
                x: side,
                y: side / 3
              }
            }
          ],
          [
            {
              top: {
                x: 0,
                y: side / 3
              },
              bottom: {
                x: side / 3,
                y: 2 * side / 3
              }
            },
            {
              top: {
                x: side / 3,
                y: side / 3
              },
              bottom: {
                x: 2 * side / 3,
                y: 2 * side / 3
              }
            },
            {
              top: {
                x: 2 * side / 3,
                y: side / 3
              },
              bottom: {
                x: side,
                y: 2 * side / 3
              }
            }
          ],
          [
            {
              top: {
                x: 0,
                y: 2 * side / 3
              },
              bottom: {
                x: side / 3,
                y: side
              }
            },
            {
              top: {
                x: side / 3,
                y: 2 * side / 3
              },
              bottom: {
                x: 2 * side / 3,
                y: side
              }
            },
            {
              top: {
                x: 2 * side / 3,
                y: 2 * side / 3
              },
              bottom: {
                x: side,
                y: side
              }
            }
          ]
        ]; //end of data.boxes
      },  //end of drawCanvas: function(canvas)

      renderBoard: function(canvas) {
        var boxes = data.boxes;
        var board = data.board;
        var side = data.side;
        var ctx = canvas.getContext("2d");
        var offsetX, offsetY;
        ctx.clearRect(0, 0, side, side);
        var image = new Image(100, 100);
        this.drawCanvas(canvas);
        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            if (board[i][j]) {
              image.src =
                board[i][j] == "x"
                  ? "https://dl.dropbox.com/s/d63q5jv3pefjcwb/bones.svg?dl=0" // X
                  : "https://dl.dropbox.com/s/kxv0s79oo61smet/skull.svg?dl=0"; // O
              image.width = 100;

              // the position of the tokens, x or o
              switch (i) {
                case 0:
                  offsetY = 20.83 * 2.8;
                  break;
                case 1:
                  offsetY = 20.83 * 2;
                  break;
                case 2:
                  offsetY = 20.83 * 1.2;
                  break;
              } //end of switch (i)
              switch (j) {
                case 0:
                  offsetX = 20.83 * 2.8;
                  break;
                case 1:
                  offsetX = 20.83 * 2;
                  break;
                case 2:
                  offsetX = 20.83 * 1.2;
                  break;
              } //end of switch(j)

              ctx.drawImage(
                image,
                boxes[i][j].top.x + offsetX,
                boxes[i][j].top.y + offsetY,
                side / 3 / 2,
                side / 3 / 2
              ); //end of drawImage

              
            } //end of if(board[i][j])
          } //end for loop 'j'
        } //end for loop 'i'
      }, //end of renderBoard: function(canvas)
      //minimax from http://www.geeksforgeeks.org/minimax-algorithm-in-game-theory-set-3-tic-tac-toe-ai-finding-optimal-move/-----
      Move: function(row, col) {
        this.row = row;
        this.col = col;
      }, //end of function(row,col)

      isMovesLeft: function(board) {
        for (var i = 0; i < 3; i++)
          for (var j = 0; j < 3; j++) 
            if (board[i][j] == "") return true;
        return false;
      }, //function(board)

      //pcToken is actually x or 0
      //check if on the same row we have same token
      evaluate: function(b) {
        for (var row = 0; row < 3; row++) {
          if (b[row][0] == b[row][1] && b[row][1] == b[row][2]) {
            if (b[row][0] == data.pcToken) return 10; 
            else if (b[row][0] == data.playerToken) return -10;
          }  //end of if
        } //end of for loop 

        // Checking for Columns for X or O victory.
        for (var col = 0; col < 3; col++) {
          if (b[0][col] == b[1][col] && b[1][col] == b[2][col]) {
            if (b[0][col] == data.pcToken) return 10;
            else if (b[0][col] == data.playerToken) return -10;
          } //end of if
        } //end of for loop

        //diagonally
        if (b[0][0] == b[1][1] && b[1][1] == b[2][2]) {
          if (b[0][0] == data.pcToken) return 10;
          else if (b[0][0] == data.playerToken) return -10;
        }

        //diagonally
        if (b[0][2] == b[1][1] && b[1][1] == b[2][0]) {
          if (b[0][2] == data.pcToken) return 10;
          else if (b[0][2] == data.playerToken) return -10;
        }

        return 0;
      }, //end of function(b)

      minimax: function(board, depth, isMax) {
        var score = tictactoe.evaluate(board);

        // If PC has won the game return  evaluated score
        if (score == 10) return score;

        // If Player has won the game return his/her evaluated score
        if (score == -10) return score;

        // If there are no more moves and no winner then it is a tie
        if (tictactoe.isMovesLeft(board) === false) return 0;

        // If this pc's move
        if (isMax) {
          var best = -1000;

          // Traverse all cells and check if it is already filled
          for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
              // Check if cell is empty
              if (board[i][j] == "") {
                // Make the move
                board[i][j] = data.pcToken;

                // Call minimax recursively and choose the maximum value
                best = Math.max(
                  best,
                  tictactoe.minimax(board, depth + 1, !isMax)
                );

                // Undo the move
                board[i][j] = "";
              } //end of if (board[i][j] == "")
            } //end of for loop 'j'
          } //end of for loop 'i'
          return best;
        } //end of if (isMax)
         else {
          // If this player's move
          best = 1000;

          // Traverse all cells
          for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 3; j++) {
              // Check if cell is empty
              if (board[i][j] == "") {
                // Make the move
                board[i][j] = data.playerToken;

                // Call minimax recursively and choose the minimum value
                best = Math.min(
                  best,
                  tictactoe.minimax(board, depth + 1, !isMax)
                );

                // Undo the move
                board[i][j] = "";
              } //end of if (board[i][j] == "")
            } //end of for loop 'j'
          } //end of for loop 'i'
          return best;
        } //end of else
      }, //end of minimax: function(board, depth, isMax)

      // This will return the best possible move for the data.pcToken(the pc)
      findBestMove: function(board, difficulty) {
        var bestVal = -1000;
        var bestMove = new tictactoe.Move(-1, -1);


        // Traverse all cells, evalutae minimax function for
        // all empty cells. And return the cell with optimal
        // value. 
        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            // Check if celll is empty
            if (board[i][j] == "") {
              // Make the move
              board[i][j] = data.pcToken;

              // compute evaluation function for this
              // move.
              var moveVal = tictactoe.minimax(board, 0, false);

              // Undo the move
              board[i][j] = "";

              // If the value of the current move is
              // more than the best value, then update
              // best/
             
              console.log(Math.round(Math.random()));
              if (
                (moveVal > bestVal && difficulty == "hard") ||
                (difficulty == "easy" && Math.round(Math.random()) == 1)
              ) 
              {
                bestMove.row = i;
                bestMove.col = j;
                bestVal = moveVal;
              } //end of if 
            } //end of if (board[i][j] == "")
          } //end for loop 'j'
        } //end for loop 'i'

        return bestMove;
      }, //end of findBestMove: function(board, difficulty)

      //gameplay functions--------------------------------------------------------------------------------
      isValid: function(x, y) {
        var boxes = data.boxes;
        console.log("boxes");
        console.log(boxes);
        var board = data.board;
        for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            var box = boxes[i][j];
            if (
              x > box.top.x &&
              y > box.top.y &&
              x < box.bottom.x &&
              y < box.bottom.y &&
              board[i][j] == ""
            ) {
              if (!board[i][j]) {
                return [i, j];
              } //end second if
              return "invalid";
            } //end first if 
          } //end for loop 'j'
        } //end for loop 'i'
      }, //end of  isValid: function(x, y)

      playerMove: function(i, j) {
        console.log("playerToken=" + data.playerToken);
        data.board[i][j] = data.playerToken;
        setTimeout(function() {
          view.render();
        }, 200);
      }, //end of playerMove: function(i, j)

      resetGame: function() {
        //reset game variables
        tictactoe.setGameState(0);
        data.board = [["", "", ""], ["", "", ""], ["", "", ""]];
        data.winner = "";
        data.playerToken = "";
        data.pctoken = "";
        data.turn = "";
      }, // end of  resetGame: function()

      pcMove: function() {
        //for easy just use minimax to find best move and use something else for move

        var bestMove =
          data.difficulty == "easy"
            ? tictactoe.findBestMove(data.board, "easy")
            : tictactoe.findBestMove(data.board, "hard");

        data.board[bestMove.row][bestMove.col] = data.pcToken;
      }, //end of  pcMove: function()

      getMousePos: function(canvas, evt) {
        var rect = canvas.getBoundingClientRect();
        return {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };
      }, //end of  getMousePos: function(canvas, evt)

      checkWin: function(player) {
        if (tictactoe.gameState() == 1) {
          var b = data.board;

          token = player == "player" ? data.playerToken : data.pcToken;
          if ( //first if
            (b[0][0] == token && b[0][1] == token && b[0][2] == token) ||
            (b[1][0] == token && b[1][1] == token && b[1][2] == token) ||
            (b[2][0] == token && b[2][1] == token && b[2][2] == token) ||
            (b[0][0] == token && b[1][0] == token && b[2][0] == token) ||
            (b[0][1] == token && b[1][1] == token && b[2][1] == token) ||
            (b[0][2] == token && b[1][2] == token && b[2][2] == token) ||
            (b[0][0] == token && b[1][1] == token && b[2][2] == token) ||
            (b[0][2] == token && b[1][1] == token && b[2][0] == token)
          ) //first if 
          {
            data.winner = player;
            if (player == "player") {
              data.wins.player++;
            } else {
              data.wins.pc++;
            }
            data.games++;

            return;
          } //end of first if 

          if ( 
            b[0].every(a => { 
              return a;
            })
               &&
            b[1].every(a => {
              return a;
            }) &&
            b[2].every(a => {
              return a;
            })
          )//second if 
          { 
            //if gameboard is full then we have a draw
            data.winner = "draw";
            data.draws++;
            data.games++;

            return;
          } //end of second if
        } //end of  if (tictactoe.gameState() == 1)
      }, //end of checkWin: function(player)

      init: function() {
        view.init();
      } // end of  init: function()
    };
    // the init() function in jQuery returns a new jQuery object.
    var view = {
      init: function() {
        this.$canvas = document.getElementById("ticTacToeCanvas");
        this.$select = document.getElementById("tokenSelection");
        this.$pcWins = $("#pcWins");
        this.$playerWins = $("#playerWins");
        this.$draws = $("#draws");
        this.$games = $("#games");
        this.$canvasContainer = $("#canvasContainer");
        this.$gameEnd = document.getElementById("gameEnd");
        this.$loseOrWin = $("#loseOrWin");
        this.$score = $("#score");

        //Select token and difficulty 
        this.$select.addEventListener(
          "click",
          function(e) {
            //main if
            if (e.target !== e.currentTarget && e.target !== "playAgain") {
              var clickedItem = e.target.id;
              tictactoe.setDifficulty(clickedItem);
              //first if
              if (clickedItem == "hard") {
                $("#hard").addClass("active");
                $("#easy").removeClass("active");
                return;
              } //end of first if
              if (clickedItem == "easy") {
                $("#easy").addClass("active");
                $("#hard").removeClass("active");
                return;
              } //end of second if

              
              tictactoe.setToken(clickedItem);
              setTimeout(function() {
              
                if (clickedItem == "tokenO") {
                  tictactoe.setTurn("pc");
                } else {
                  tictactoe.setTurn("player");
                }
                tictactoe.setGameState(1);
                view.render();
              }, 1000); //end  setTimeout(function()
            } //end of main if
            e.stopPropagation();
          }, //end of fucntion(e)
          false
        ); //end of this.$select.addEventListener

        //click on canvas to play
        //the thing when we click on some cell and need to wait for the computer to make the move
        this.$canvas.addEventListener(
          "click",
          function(e) {
            tictactoe.disableClicks();
            var mousePos = tictactoe.getMousePos(this, e);
            tictactoe.disableClicks();

            var pos = tictactoe.isValid(mousePos.x, mousePos.y);
            //first if
            if (pos != "invalid") {
              tictactoe.playerMove(pos[0], pos[1]);
              tictactoe.checkWin("player");
              //second if
              if (!tictactoe.winner()) {
                setTimeout(function() {
                  tictactoe.setTurn("pc");
                  view.render();
                }, 800); //end of setTimeout(function()
              } //end of second if
            } //end of first if
            e.stopPropagation();
          }, //end of fucntion(e)
          false
        ); //end of this.$canvas.addEventListener

  
        this.$gameEnd.addEventListener(
          "click",
          function(e) {
            var clickedItem = e.target.id;
            console.log("clicked is " + clickedItem);
            setTimeout(function() {
              tictactoe.disableClicks();
              tictactoe.resetGame();
              view.render();
            }, 1000); //end of  setTimeout(function()
            e.stopPropagation();
          }, //end of function(e)
          false
        ); //end of  this.$gameEnd.addEventListener
        view.render();
      }, //end of  init: function()

      render: function() {
        tictactoe.enableClicks();
        switch (tictactoe.gameState()) {
          case 0: //display the frame 
            this.$select.style.display = "block";
            this.$canvas.style.display = "none";
            this.$gameEnd.style.display = "none";
            setTimeout(function() {
            }, 500);

            setTimeout(function() {
            }, 1500);
            break;

          case 1:
            this.$select.style.display = "none";
            this.$canvas.style.display = "inline";
            this.$gameEnd.style.display = "none";
            tictactoe.renderBoard(this.$canvas);

            if (tictactoe.winner()) {
              canvasContainer = this.$canvasContainer;

              setTimeout(function() {
              }, 1000);
              setTimeout(function() {
                tictactoe.setGameState(2);
                view.render();
              }, 2000);
            }
            if (tictactoe.getTurn() == "pc") {
              tictactoe.setTurn("player");
              tictactoe.pcMove();
              tictactoe.checkWin("pc");
              view.render();
            }
            break;

          case 2: //display win and display button to play again
            this.$select.style.display = "none";
            this.$canvas.style.display = "none";
            this.$gameEnd.style.display = "block";
            this.$pcWins.html(tictactoe.pcWins());
            this.$playerWins.html(tictactoe.playerWins());
            this.$draws.html(tictactoe.draws());
            this.$games.html(tictactoe.games());
            if (tictactoe.winner() == "player") {
              this.$loseOrWin.html("You won!");
            } else if (tictactoe.winner() == "pc") {
              this.$loseOrWin.html("You lost!");
            } else {
              this.$loseOrWin.html("It's a draw!");
            }

            break;
        } //end of  switch (tictactoe.gameState())
      } //end of render: function()
    };
    tictactoe.init();
  }) //end of first function
); //end of querry