function onOpen(e) {
  var ui = DocumentApp.getUi();
  ui.createMenu("Play a Game")
  .addItem("Guess the Number", 'startNumGame')
  .addItem("Mystery Game", "rickRoll")
  .addItem("Tic Tac Toe", 'ticTacToe')
  .addToUi();
}

function startNumGame() {
  var ui = DocumentApp.getUi();
  let p = ui.prompt("Guess the Number (Between 1-10)").getResponseText();
  let num = Math.ceil(Math.random() * 10).toString();
  if (num == p) {
    ui.alert("You got it!")
  } else {
    ui.alert("The number was " + num + ". Nice try!");
  }
  if (p == "No.") {
    let a = ui.alert("Close the Game", "Click 'YES' to close the game.", ui.ButtonSet.YES_NO);
    if (a.YES) {
      ui.alert("jk lololololol");
    }
  }
}

let possibleSolutions = [
  [
    "x", "x", "x",
    "", "", "",
    "", "", ""
  ],
  [
    "", "", "",
    "x", "x", "x",
    "", "", ""
  ],
  [
    "", "", "",
    "", "", "",
    "x", "x", "x"
  ],
  [
    "x", "", "",
    "x", "", "",
    "x", "", ""
  ],
  [
    "", "x", "",
    "", "x", "",
    "", "x", ""
  ],
  [
    "", "", "x",
    "", "", "x",
    "", "", "x"
  ],
  [
    "x", "", "",
    "", "x", "",
    "", "", "x"
  ],
  [
    "", "", "x",
    "", "x", "",
    "x", "", ""
  ],
];
let board = [];
let usingAI = false;

function ticTacToe() {
  var ui = DocumentApp.getUi();
  
  let type = ui.prompt("Type", "Type 1 for AI, type 2 for 2 player, and type 3 to cancel.", ui.ButtonSet.OK).getResponseText();
  
  
  if (type == "1") {
    usingAI = true;
  } else if (type == "2") {
    usingAI = false;
  } else if (type == "3") {
    return;
  } else {
    ui.alert("Not a valid response. Closing game...");
    return;
  }
  
  board = [
    "_", "_", "_",
    "_", "_", "_",
    "_", "_", "_"
  ];
  let turnNum = 1;
  
  do {
    let turn = ""; 
    if (turnNum % 2 == 0) {
      turn = "O";
    } else {
      turn = "X";
    }
    ui.alert("It is " + turn + "'s turn.");
    
    let turnStr = turn + "'s Turn";
    let boardStr = board[0] + " | " + board[1] + " | " + board[2] + "\n" + board[3] + " | " + board[4] + " | " + board[5] + "\n" + board[6] + " | " + board[7] + " | " + board[8];
    
    let whereToGo = "";
    
    if (!usingAI) {
      do {
        whereToGo = ui.prompt(turnStr, boardStr + "\nEnter a number from 1-9", ui.ButtonSet.OK).getResponseText();
      } while (!validSpot(whereToGo));
    } else if (usingAI && turn == "O") {
      do {
        whereToGo = ui.prompt(turnStr, boardStr + "\nEnter a number from 1-9", ui.ButtonSet.OK).getResponseText();
      } while (!validSpot(whereToGo));
    } else {
      let cfb = checkForBlock();
      let cfw = checkForWinningMove();
      if (cfw.win) {
        whereToGo = cfw.space;
      } else if (cfb.block) {
        whereToGo = cfb.space;
      } else {
        do {
          whereToGo = "" + Math.ceil(Math.random() * 9);
        } while (!validSpot(whereToGo));
      }
      
      
    }
    
    
    let spot = parseInt(whereToGo);
    board[spot - 1] = turn;
    
    if (usingAI) {
      boardStr = board[0] + " | " + board[1] + " | " + board[2] + "\n" + board[3] + " | " + board[4] + " | " + board[5] + "\n" + board[6] + " | " + board[7] + " | " + board[8];
      ui.alert(turnStr, boardStr, ui.ButtonSet.OK);
    }
    
    
    turnNum++;
    
  } while (hasSomeoneWon() == "none" && turnNum < 10);
  
  ui.alert("Good game!");
  if (hasSomeoneWon() != "none") {
    ui.alert(hasSomeoneWon().toUpperCase() + " has won!");
    return;
  }
  if (turnNum >= 9) {
    ui.alert("No winner this time!");
  }
}

function hasSomeoneWon() {
  let winner = "none";
  for (let i = 0; i < possibleSolutions.length; i++) {
    let countForX = 0;
    let countForO = 0;

    for (let j = 0; j < possibleSolutions[i].length; j++) {
      if (possibleSolutions[i][j] == "x") {
        if (board[j] == "X") {
          countForX++;
        } else if (board[j] == "O") {
          countForO++;
        }
      }
    }
    if (countForX == 3) {
      winner = "x";
      break;
    } else if (countForO == 3) {
      winner = "o";
      break;
    }
  }
  return winner;
}

function checkForBlock() {
  let block = {
    block: false,
    space: 0
  };
  for (let i = 0; i < possibleSolutions.length; i++) {
    let countForX = 0;
    let countForO = 0;
    let openSpace = 0;

    for (let j = 0; j < possibleSolutions[i].length; j++) {
      if (possibleSolutions[i][j] == "x") {
        if (board[j] == "X") {
          countForX++;
        } else if (board[j] == "O") {
          countForO++;
        } else {
          openSpace = j + 1;
        }
      }
    }
    if (countForO == 2 && countForX == 0) {
      block.block = true;
      block.space = openSpace;
      break;
    }
  }
  return block;
}

function checkForWinningMove() {
  let win = {
    win: false,
    space: 0
  };
  for (let i = 0; i < possibleSolutions.length; i++) {
    let countForX = 0;
    let countForO = 0;
    let openSpace = 0;

    for (let j = 0; j < possibleSolutions[i].length; j++) {
      if (possibleSolutions[i][j] == "x") {
        if (board[j] == "X") {
          countForX++;
        } else if (board[j] == "O") {
          countForO++;
        } else {
          openSpace = j + 1;
        }
      }
    }
    if (countForX == 2 && countForO == 0) {
      win.win = true;
      win.space = openSpace;
      break;
    }
  }
  return win;
}

function validSpot(whereToGo) {
  let spot = parseInt(whereToGo);
  let validResults = ["1", "2", "3", "4", "5", "6", "7", "8", "9"]
  if (validResults.includes(whereToGo)) {
    if (!spaceTaken(spot)) {
      return true;
    }
  }
  return false;
}

function spaceTaken(spot) {
  if (board[spot - 1] != "_") {
    return true;
  }
  return false;
}



function rickRoll() {
  openUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
}

function openUrl( url ){
  var html = HtmlService.createHtmlOutput('<html><script>'
  +'window.close = function(){window.setTimeout(function(){google.script.host.close()},9)};'
  +'var a = document.createElement("a"); a.href="'+url+'"; a.target="_blank";'
  +'if(document.createEvent){'
  +'  var event=document.createEvent("MouseEvents");'
  +'  if(navigator.userAgent.toLowerCase().indexOf("firefox")>-1){window.document.body.append(a)}'                          
  +'  event.initEvent("click",true,true); a.dispatchEvent(event);'
  +'}else{ a.click() }'
  +'close();'
  +'</script>'
  // Offer URL as clickable link in case above code fails.
  +'<body style="word-break:break-word;font-family:sans-serif;">Failed to open automatically. <a href="'+url+'" target="_blank" onclick="window.close()">Click here to proceed</a>.</body>'
  +'<script>google.script.host.setHeight(40);google.script.host.setWidth(410)</script>'
  +'</html>')
  .setWidth( 90 ).setHeight( 1 );
  DocumentApp.getUi().showModalDialog( html, "Opening ..." );
}
