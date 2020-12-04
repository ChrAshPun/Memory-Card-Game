var controller = (function() {
  var startMemoryGame = function() {
    let playersPair = []; // start with empty hand
    let playerScoreValue = 0; // initialize player's score
    let computerScoreValue = 0; // initialize computer's score
    let playerFirstCard = "";
    let playerSecondCard = "";
    let revealedCards = {
      // list of cards that have been revealed each turn
      0: "",
      1: "",
      2: "",
      3: "",
      4: "",
      5: "",
      6: "",
      7: "",
      8: "",
      9: "",
      10: "",
      11: ""
    };
    let unknownCards = []; // cards that have not been revealed yet

    function resetUI() {
      //reset the UI
      Array.prototype.slice // remove hidden class from all cards
        .call(document.querySelectorAll(DOMstrings.cards))
        .forEach(function(card) {
          card.classList.remove("hidden");
        });
      document.getElementById("memory__win-page").classList.toggle("hidden"); // hide win pop up

      for (let i = 0; i < 12; i++) {
        document.getElementById(i).dataset.cardValue = ""; // reset card's value
        document.getElementById(i).children[0].children[0].innerText = "";
        document.getElementById(i).children[0].children[1].innerText = "";
        if (
          // remove all color classes
          document
            .getElementById(i)
            .children[0].children[0].classList.contains("red__font-color")
        ) {
          document
            .getElementById(i)
            .children[0].children[0].classList.remove("red__font-color");
          document
            .getElementById(i)
            .children[0].children[1].classList.remove("red__font-color");
          document
            .getElementById(i)
            .children[0].children[2].classList.remove("red__front-design");
        } else {
          document
            .getElementById(i)
            .children[0].children[2].classList.remove("black__front-design");
        }
      }

      document.getElementById(
        // reset player's score on UI
        DOMstrings.playerScore
      ).innerText = playerScoreValue;
      document.getElementById(
        // reset computer's score on UI
        DOMstrings.computerScore
      ).innerText = computerScoreValue;
    }

    var DOMstrings = {
      startButton: "memory-start-button",
      playerScore: "memory__player-score",
      computerScore: "memory__computer-score",
      cards: ".card",
      winPopUp: "memory__win-page",
      winMessage: "memory__win-message"
    };

    function flipAllCardsFaceDown() {
      setTimeout(() => {
        Array.prototype.slice
          .call(document.querySelectorAll(DOMstrings.cards))
          .forEach(function(card) {
            card.classList.remove("flipped");
          });
      }, 2000);
    }

    function removeMatchedCard() {
      let cards = Array.prototype.slice.call(
        document.querySelectorAll(DOMstrings.cards)
      );

      // remove the flipped card from the game
      for (let i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains("flipped")) {
          cards.splice(i, 1);
        }
      }
    }

    function findDuplicateValue() {
      let revealedCardsValues = Object.values(revealedCards);

      for (i = 0; i < revealedCardsValues.length; i++) {
        for (j = i + 1; j < revealedCardsValues.length; j++) {
          if (
            revealedCardsValues[i] == revealedCardsValues[j] &&
            revealedCardsValues[i] != ""
          ) {
            return revealedCardsValues[i];
          }
        }
      }
      return "none";
    }

    function findAMatch(duplicate) {
      var cards = Array.prototype.slice.call(
        document.querySelectorAll(".card")
      );

      for (i = 0; i < cards.length; i++) {
        if (cards[i].classList.contains("flipped")) {
          continue;
        }
        if (revealedCards[i] == duplicate) {
          let card = cards[i];
          card.classList.toggle("flipped");
          return card;
        }
      }
      return "none";
    }

    function returnUnknownCards() {
      unknownCards = [];
      for (i = 0; i < 12; i++) {
        if (revealedCards[i] === "") {
          unknownCards.push(i);
        }
      }
      return unknownCards;
    }

    function selectComputersFirstCard() {
      var cards = Array.prototype.slice.call(
        document.querySelectorAll(DOMstrings.cards)
      );
      return new Promise(resolve => {
        setTimeout(() => {
          let duplicate = findDuplicateValue(); // is there a matching pair that was revealed already?
          if (duplicate != "none") {
            // if duplicates were found, find the first card
            console.log("A match was found");
            card = findAMatch(duplicate); // find the first match and flip the card over
            resolve(card);
          } else {
            // since there's no matches, reveal a card that wasn't shown already
            unknownCards = returnUnknownCards();
            console.log(
              "Computer is about to flip the first card and the unknownCards are: " +
                unknownCards
            );
            // select a random unknown card
            let randomNumber =
              unknownCards[Math.floor(Math.random() * unknownCards.length)];
            let card = cards[randomNumber];
            // flip that card over
            card.classList.toggle("flipped");
            resolve(card);
          }
        }, 3000);
      });
    }

    function returnComputersSecondCard(computersPair) {
      var cards = Array.prototype.slice.call(
        document.querySelectorAll(DOMstrings.cards)
      );
      return new Promise(resolve => {
        setTimeout(() => {
          revealedCards[computersPair[0].id] =
            computersPair[0].dataset.cardValue;
          console.log("The unknownCards are: " + unknownCards);
          let duplicate = computersPair[0].dataset.cardValue; // is the computer's first card in the revealedCards array?
          card = findAMatch(duplicate); // find the first match and flip the card over
          if (card != "none") {
            resolve(card);
          } else {
            // since there's no matches, reveal a card that wasn't shown already
            unknownCards = returnUnknownCards();
            console.log(unknownCards);
            // select a random unknown card
            let randomNumber =
              unknownCards[Math.floor(Math.random() * unknownCards.length)];
            let card = cards[randomNumber];
            // flip that card over
            card.classList.toggle("flipped");
            resolve(card);
          }
        }, 1000);
      });
    }

    async function computersTurn() {
      let computersPair = []; // start with empty hand
      computerFirstCard = await selectComputersFirstCard(); // flip first card
      computersPair.push(computerFirstCard); // add card to hand
      revealedCards[computersPair[0].id] = computersPair[0].dataset.cardValue; // add that card to revealed
      computerSecondCard = await returnComputersSecondCard(computersPair); // flip second card
      computersPair.push(computerSecondCard); // add card to hand
      revealedCards[computersPair[1].id] = computersPair[1].dataset.cardValue; // add that card to revealed
      computerFirstCard = computersPair[0].dataset.cardValue;
      computerSecondCard = computersPair[1].dataset.cardValue;
      if (computerFirstCard == computerSecondCard) {
        // if its a match
        delete revealedCards[computersPair[0].id]; //remove card from revealedCards dictionary
        delete revealedCards[computersPair[1].id]; //remove card from revealedCards dictionary
        flipAllCardsFaceDown(); // wait 2 seconds and flip all cards face down
        computerScoreValue++; // +1 to computer's score
        setTimeout(() => {
          removeMatchedCard(); // remove card from game
          removeMatchedCard(); // remove card from game
          computersPair[0].classList.add("hidden"); // hide card from UI
          computersPair[1].classList.add("hidden"); // hide card from UI
          document.getElementById(
            DOMstrings.computerScore
          ).innerText = computerScoreValue; // update UI
        }, 2500);
        if (computerScoreValue + playerScoreValue === 6) {
          // check win scenarios
          if (computerScoreValue > playerScoreValue) {
            // if computer won
            setTimeout(() => {
              document.getElementById(DOMstrings.winMessage).innerText =
                "Computer Won!";
              document
                .getElementById(DOMstrings.winPopUp)
                .classList.toggle("hidden");
            }, 3000);
          } else if (playerScoreValue > computerScoreValue) {
            // if player won
            setTimeout(() => {
              document.getElementById(DOMstrings.winMessage).innerText =
                "Player Won!";
              document
                .getElementById(DOMstrings.winPopUp)
                .classList.toggle("hidden");
            }, 3000);
          } else if (computerScoreValue === playerScoreValue) {
            // if it's a tie
            setTimeout(() => {
              document.getElementById(DOMstrings.winMessage).innerText =
                "It's a tie!";
              document
                .getElementById(DOMstrings.winPopUp)
                .classList.toggle("hidden");
            }, 3000);
          }
        } else {
          computersTurn();
        }
      } else if (computerFirstCard !== computerSecondCard) {
        // add player's hand to revealed cards dictionary
        flipAllCardsFaceDown(); // wait 2 seconds and flip all cards face down
        setTimeout(() => {
          playersPair = []; // reset player's hand
        }, 2500);
      }
    }

    function setupStartScreen() {
      document
        .getElementById(DOMstrings.startButton)
        .addEventListener("click", function() {
          document.querySelector(".memory-start-page").classList.add("hidden");
        });
    }

    function setupAllCards() {
      const cardValues = [
        ["A", "red"],
        ["A", "black"],
        ["2", "red"],
        ["2", "black"],
        ["3", "red"],
        ["3", "black"],
        ["4", "red"],
        ["4", "black"],
        ["5", "red"],
        ["5", "black"],
        ["6", "red"],
        ["6", "black"]
      ];

      for (let i = 0; i < 12; i++) {
        let randomNumber = Math.floor(Math.random() * cardValues.length);
        // get random index value within cardValues length
        document.getElementById(i).dataset.cardValue =
          cardValues[randomNumber][0]; // set card's value
        document.getElementById(i).children[0].children[0].innerText =
          cardValues[randomNumber][0];
        document.getElementById(i).children[0].children[1].innerText =
          cardValues[randomNumber][0];
        if (cardValues[randomNumber][1] === "red") {
          // add red color
          document
            .getElementById(i)
            .children[0].children[0].classList.add("red__font-color");
          document
            .getElementById(i)
            .children[0].children[1].classList.add("red__font-color");
          document
            .getElementById(i)
            .children[0].children[2].classList.add("red__front-design");
        } else {
          // add black color
          document
            .getElementById(i)
            .children[0].children[2].classList.add("black__front-design");
        }
        // remove the element from the cardValues array
        cardValues.splice(randomNumber, 1);
      }
    }

    function setupEventListeners() {
      console.log("Event Listeners are working");

      // EventListeners for each card
      Array.prototype.slice
        .call(document.querySelectorAll(DOMstrings.cards))
        .forEach(function(card) {
          card.addEventListener("click", function() {
            if (playersPair.length == 2) {
              // do not flip if player flipped 2 cards already
              console.log("player already flipped 2 cards");
              return;
            }
            if (card.classList.contains("flipped")) {
              // do not flip if the card was already flipped
              console.log("this card was already flipped");
              return;
            } else {
              card.classList.toggle("flipped"); // flip the card
              playersPair.push(card); // add to player's hand
              if (playersPair.length === 2) {
                // when player has 2 cards in hand check for a match
                playerFirstCard = playersPair[0].dataset.cardValue;
                playerSecondCard = playersPair[1].dataset.cardValue;
                if (playerFirstCard == playerSecondCard) {
                  console.log("Player found a match");
                  // if player found a match
                  delete revealedCards[playersPair[0].id]; //remove card from revealedCards dictionary
                  delete revealedCards[playersPair[1].id]; //remove card from revealedCards dictionary
                  flipAllCardsFaceDown(); // wait 2 seconds and flip all cards face down
                  setTimeout(() => {
                    removeMatchedCard(); // remove card from game
                    removeMatchedCard(); // remove card from game
                    playersPair[0].classList.add("hidden"); // hide card from UI
                    playersPair[1].classList.add("hidden"); // hide card from UI
                    playerScoreValue++; // +1 to player's score
                    document.getElementById(
                      DOMstrings.playerScore
                    ).innerText = playerScoreValue; // update UI
                    if (playerScoreValue + computerScoreValue === 6) {
                      // check win scenarios
                      if (computerScoreValue > playerScoreValue) {
                        // if computer won
                        setTimeout(() => {
                          document.getElementById(
                            DOMstrings.winMessage
                          ).innerText = "Computer Won!";
                          document
                            .getElementById(DOMstrings.winPopUp)
                            .classList.toggle("hidden");
                        }, 500);
                      } else if (playerScoreValue > computerScoreValue) {
                        // if player won
                        setTimeout(() => {
                          document.getElementById(
                            DOMstrings.winMessage
                          ).innerText = "Player Won!";
                          document
                            .getElementById(DOMstrings.winPopUp)
                            .classList.toggle("hidden");
                        }, 500);
                      } else if (computerScoreValue === playerScoreValue) {
                        // if it's a tie
                        setTimeout(() => {
                          document.getElementById(
                            DOMstrings.winMessage
                          ).innerText = "It's a tie!";
                          document
                            .getElementById(DOMstrings.winPopUp)
                            .classList.toggle("hidden");
                        }, 500);
                      }
                    } else {
                      playersPair = []; // reset player's hand
                    }
                  }, 2500);
                  return;
                } else {
                  // if player didn't find a match
                  // add player's hand to revealed cards dictionary
                  revealedCards[playersPair[0].id] =
                    playersPair[0].dataset.cardValue;
                  revealedCards[playersPair[1].id] =
                    playersPair[1].dataset.cardValue;
                  flipAllCardsFaceDown(); // wait 2 seconds and flip all cards face down
                  computersTurn(); // computer's turn to flip 2 cards
                }
              }
            }
          });
        });
    }
    resetUI();
    setupStartScreen();
    setupAllCards();
    setupEventListeners();
  };

  return {
    init: function() {
      startMemoryGame();
    }
  };
})();

controller.init();
