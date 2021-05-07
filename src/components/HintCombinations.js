export const singleCombination = (
  revolution,
  hints_obj,
  cards_field,
  cards_prev,
  cards_flipped,
) => {
  const hasHumalien = cards_flipped.some((card) => card.number === 999);
  const hasEye = cards_flipped.some((card) => card.number === 666);
  const hasOwl = cards_flipped.some((card) => card.number === 333);
  const cardField = cards_field[0] ? cards_field[0].number : 0;
  const cardPrev = cards_prev[0] ? cards_prev[0].number : 0;

  if (cardField >= 1 && cardField <= 13 && cardField !== 7) {
    // 1 <= cardsField <= 13 but not 7

    if (
      !revolution && // 13 & Humalien is strongest
      cards_flipped.some(
        (card) => card.number >= cardField && card.number >= 1 && card.number <= 13,
      )
    ) {
      hints_obj.single = cardField;
    } else if (
      revolution && // 1 & Humalien is strongest
      cards_flipped.some(
        (card) => card.number <= cardField && card.number >= 1 && card.number <= 13,
      )
    ) {
      hints_obj.single = cardField;
    }
  } else if (cardField === 999 && hasHumalien) {
    hints_obj.single = 'Humalien';
  } else if (cardField === 666) {
    if (cards_prev.length === 0) {
      hints_obj.single = 1;
    } else if (cards_prev.length !== 0 && cardPrev === 333) {
      hints_obj.single = '🦉の1枚前';
    } else {
      hints_obj.single = cardPrev;
    }
  } else if (cardField === 333) {
    hints_obj.single = cardPrev;
  } else if (cardField === 0 && !revolution) {
    hints_obj.single = cards_flipped[0].number;
  } else if (cardField === 0 && revolution) {
    const noSpecials = cards_flipped.filter(
      (card, index) => card.number !== 999 && card.number !== 666 && card.number !== 333,
    );
    hints_obj.single = noSpecials[noSpecials.length - 1].number;
  }

  // ↓ Special cards
  if (hasHumalien && cardField !== 7) {
    hints_obj.specialCards.push({
      title: 'Humalien',
      color: 'white',
    });
  }
  if (hasEye) {
    hints_obj.specialCards.push({
      title: 'Eye of Providence',
      color: 'yellow',
    });
  }
  if (hasOwl && cardField !== 333 && cardField !== 7) {
    const owls = cards_flipped.filter((card, index) => card.number === 333);
    hints_obj.specialCards.push({
      title: 'Owl 🦉',
      color: owls[0].color,
    });
  }
  // console.log('revolution', revolution);
  //   console.log("hints_obj", hints_obj);
  //   console.log("cards_field", cardField);
  //   console.log("cards_prev", cardPrev);
  //   console.log("cards_flipped", cards_flipped);

  return hints_obj;
};

export const doubleCombination = (
  revolution,
  hints_obj,
  cards_field,
  cards_prev,
  cards_flipped,
  chunkSameNumbers,
) => {
  const hasHumalien = cards_flipped.some((card) => card.number === 999);
  const numCardsField = cards_field.length;

  for (let idx in chunkSameNumbers) {
    if (chunkSameNumbers[idx].length >= 2) {
      // pair or more
      let pairCardNum = chunkSameNumbers[idx][0].number;
      if (numCardsField === 0) {
        if (pairCardNum >= 1 && pairCardNum <= 13) {
          hints_obj.double.push({
            title: pairCardNum + ' のペア',
          });
        }
      } else if (numCardsField === 1) {
        let cardField = cards_field[0].number;
        if (cardField === 666 || cardField === 333) {
          cardField = cards_prev[0].number;
        }
        if (!revolution) {
          if (pairCardNum >= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.double.push({
              title: pairCardNum + ' のペア',
            });
          }
        } else if (revolution) {
          if (pairCardNum <= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.double.push({
              title: pairCardNum + ' のペア',
            });
          }
        }
      } else if (numCardsField === 2) {
        let cardField = cards_field[0].number;
        if (cards_field[0].number + cards_field[1].number > 999) {
          //case card on field is pair the Humalien
          cardField = cards_field[0].number + cards_field[1].number - 999;
        } else if (cardField === 666 || cardField === 333) {
          cardField = cards_prev[0].number;
        }
        if (!revolution) {
          if (pairCardNum >= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.double.push({
              title: pairCardNum + ' のペア',
            });
          }
        } else if (revolution) {
          if (pairCardNum <= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.double.push({
              title: pairCardNum + ' のペア',
            });
          }
        }
      }

      if (pairCardNum === 333) {
        let cardField = cards_field[0] ? cards_field[0].number : 0;
        let owlColor = chunkSameNumbers[idx][0].color;
        if (numCardsField === 0) {
          hints_obj.double.push({
            title: '🦉のペア',
            color: owlColor,
          });
        } else if (
          (numCardsField === 1 || numCardsField === 2) &&
          cardField !== 333 &&
          cardField !== 7
        ) {
          hints_obj.double.push({
            title: '🦉のペア',
            color: owlColor,
          });
        }
      } else if (pairCardNum === 666) {
        let cardField = cards_field[0].number;
        if (numCardsField === 0) {
          hints_obj.double.push({
            title: 'Eye👁 のペア',
            color: 'yellow',
          });
        } else if ((numCardsField === 1 || numCardsField === 2) && cardField !== 333) {
          hints_obj.double.push({
            title: 'Eye👁 のペア',
            color: 'yellow',
          });
        }
      } else if (pairCardNum === 999) {
        if (numCardsField === 0) {
          hints_obj.double.push({
            title: 'Humalien',
            color: 'white',
          });
        } else if (numCardsField === 1 || numCardsField === 2) {
          hints_obj.double.push({
            title: 'Humalien',
            color: 'white',
          });
        }
      }
    }
  }
  if (hasHumalien) {
    hints_obj.double.push({
      title: 'Humalien と何でものペア',
      color: 'white',
    });
  }
  return hints_obj;
};

export const TripleCombination = (
  revolution,
  hints_obj,
  cards_field,
  cards_prev,
  cards_flipped,
  chunkSameNumbers,
  allNums,
) => {
  const hasHumalienPair = cards_flipped.filter((card, index) => card.number === 999).length;
  const numCardsField = cards_field.length;

  for (let idx in chunkSameNumbers) {
    if (chunkSameNumbers[idx].length >= 3) {
      let pairCardNum = chunkSameNumbers[idx][0].number;
      if (numCardsField === 0) {
        if (pairCardNum >= 1 && pairCardNum <= 13) {
          hints_obj.triple.push({
            title: pairCardNum + ' のトリプル',
          });
        }
      } else if (numCardsField === 1) {
        let cardField = cards_field[0].number;
        if (cardField === 666 || cardField === 333) {
          cardField = cards_prev[0].number;
        }
        if (!revolution) {
          if (pairCardNum >= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.triple.push({
              title: pairCardNum + ' のトリプル',
            });
          }
        } else if (revolution) {
          if (pairCardNum <= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.triple.push({
              title: pairCardNum + ' のトリプル',
            });
          }
        }
      } else if (numCardsField === 2) {
        let cardField = cards_field[0].number;
        if (cards_field[0].number + cards_field[1].number > 999) {
          //case card on field is pair the Humalien
          cardField = cards_field[0].number + cards_field[1].number - 999;
        } else if (cardField === 666 || cardField === 333) {
          cardField = cards_prev[0].number;
        }
        if (!revolution) {
          if (pairCardNum >= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.triple.push({
              title: pairCardNum + ' のトリプル',
            });
          }
        } else if (revolution) {
          if (pairCardNum <= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.triple.push({
              title: pairCardNum + ' のトリプル',
            });
          }
        }
      } else if (numCardsField === 3) {
        let cardField = cards_field[0].number;
        if (cards_field[0].number + cards_field[1].number + cards_field[2].number > 999) {
          //case card on field is pair the Humalien
          cardField = cards_field[0].number + cards_field[1].number + cards_field[2].number - 999;
        } else if (cards_field[0].number + cards_field[1].number + cards_field[2].number > 1998) {
          //case card on field is double the Humalien
          cardField = cards_field[0].number + cards_field[1].number + cards_field[2].number - 1998;
        } else if (cardField === 666 || cardField === 333) {
          if (cards_prev.length === 3) {
            //incase previous card the stare of 3
            cardField = cards_prev[1].number;
          }
          cardField = cards_prev[0].number;
        }

        if (!revolution) {
          if (pairCardNum >= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.triple.push({
              title: pairCardNum + ' のトリプル',
            });
          }
        } else if (revolution) {
          if (pairCardNum <= cardField && pairCardNum <= 13 && cardField !== 7) {
            hints_obj.triple.push({
              title: pairCardNum + ' のトリプル',
            });
          }
        }
      }

      if (pairCardNum === 333) {
        let cardField = cards_field[0] ? cards_field[0].number : 0;
        let owlColor = chunkSameNumbers[idx][0].color;
        if (numCardsField === 0) {
          hints_obj.triple.push({
            title: '🦉のトリプル',
            color: owlColor,
          });
        } else if (
          (numCardsField === 1 || numCardsField === 2 || numCardsField === 3) &&
          cardField !== 333 &&
          cardField !== 7
        ) {
          hints_obj.triple.push({
            title: '🦉のトリプル',
            color: owlColor,
          });
        }
      }
    } else if (chunkSameNumbers[idx].length === 2) {
      let pairCardNum = chunkSameNumbers[idx][0].number;
      let cardField = cards_field[0] ? cards_field[0].number : 0;
      if (pairCardNum === 999 && cardField !== 999) {
        hints_obj.triple.push({
          title: 'Humalien 2枚と何か',
          color: 'white',
        });
      }
    } else if (chunkSameNumbers[idx].length === 1) {
      let pairCardNum = chunkSameNumbers[idx][0].number;
      let cardField = cards_field[0] ? cards_field[0].number : 0;
      if (pairCardNum === 999 && cardField !== 999) {
        hints_obj.triple.push({
          title: 'Humalien とペア',
          color: 'white',
        });
      }
    }
  }
  console.log(allNums);
  if (allNums.length >= 2) {
    for (let eachNum = 0; eachNum < allNums.length - 2; eachNum++) {
      let difference =
        allNums[eachNum + 2] - allNums[eachNum + 1] + (allNums[eachNum + 1] - allNums[eachNum]);
      if (difference === 2 && cards_field[0].number !== 7) {
        //one by one by one
        if (revolution) {
          if (numCardsField === 0) {
            hints_obj.specialCombination.push({
              title:
                allNums[eachNum + 2] +
                ',' +
                allNums[eachNum + 1] +
                ',' +
                allNums[eachNum] +
                ' の階段',
              color: 'white',
            });
          } else if (numCardsField === 1 || numCardsField === 2) {
            if (allNums[eachNum + 1] <= cards_field[0].number) {
              hints_obj.specialCombination.push({
                title:
                  allNums[eachNum + 2] +
                  ',' +
                  allNums[eachNum + 1] +
                  ',' +
                  allNums[eachNum] +
                  ' の階段',
                color: 'white',
              });
            }
          } else if (numCardsField === 3) {
            if (allNums[eachNum + 1] <= cards_field[1].number) {
              hints_obj.specialCombination.push({
                title:
                  allNums[eachNum + 2] +
                  ',' +
                  allNums[eachNum + 1] +
                  ',' +
                  allNums[eachNum] +
                  ' の階段',
                color: 'white',
              });
            }
          }
        } else if (!revolution) {
          if (numCardsField === 0) {
            hints_obj.specialCombination.push({
              title:
                allNums[eachNum] +
                ',' +
                allNums[eachNum + 1] +
                ',' +
                allNums[eachNum + 2] +
                ' の階段',
              color: 'white',
            });
          } else if (numCardsField === 1 || numCardsField === 2) {
            if (allNums[eachNum + 1] >= cards_field[0].number) {
              hints_obj.specialCombination.push({
                title:
                  allNums[eachNum] +
                  ',' +
                  allNums[eachNum + 1] +
                  ',' +
                  allNums[eachNum + 2] +
                  ' の階段',
                color: 'white',
              });
            }
          } else if (numCardsField === 3) {
            if (allNums[eachNum + 1] >= cards_field[1].number) {
              hints_obj.specialCombination.push({
                title:
                  allNums[eachNum] +
                  ',' +
                  allNums[eachNum + 1] +
                  ',' +
                  allNums[eachNum + 2] +
                  ' の階段',
                color: 'white',
              });
            }
          }
        }
      }
    }
    if (hasHumalienPair === 2) {
      hints_obj.specialCombination.push({
        title: 'Humalien , Humalienと数字の階段',
        color: 'white',
      });
    }
  }
  return hints_obj;
};

export const QuadrupleCombination = (
  revolution,
  hints_obj,
  cards_field,
  cards_prev,
  cards_flipped,
  chunkSameNumbers,
  allNums,
) => {
  console.log("checked");
  return hints_obj;
}
