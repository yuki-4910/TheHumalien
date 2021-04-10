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
        let cardField = cards_field[0].number;
        let owlColor = chunkSameNumbers[idx][0].color;
        if (numCardsField === 0) {
          hints_obj.double.push({
            title: '🦉のペア',
            color: owlColor,
          });
        } else if (numCardsField === 1 && cardField !== 333 && cardField !== 7) {
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
        } else if (numCardsField === 1 && cardField !== 333) {
          hints_obj.double.push({
            title: 'Eye👁 のペア',
            color: 'yellow',
          });
        }
      } else if (pairCardNum === 999) {
        let cardField = cards_field[0].number;
        if (numCardsField === 0) {
          hints_obj.double.push({
            title: 'Humalien',
            color: 'white',
          });
        } else if (numCardsField === 1 && cardField !== 333 && cardField !== 7) {
          hints_obj.double.push({
            title: 'Humalien',
            color: 'white',
          });
        }
      }
    }
  }
  return hints_obj;
};
