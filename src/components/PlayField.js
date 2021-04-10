import React, { useState, useEffect, createContext } from 'react';
import Card from '../Card/Card';
import BoxDeck from './BoxDeck';
import {
  Box,
  Flex,
  Button,
  Stack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import '../Card/Card.css';
import allCards from '../CardData/AllCards.json';
import Overlay from './Overlay';
import { singleCombination, doubleCombination } from './HintCombinations';

export const CardContex = createContext({
  addToOtherDeck: null,
  addToField: null,
});

export default function PlayField() {
  // Initialize cards for deck, field, and hand
  useEffect(() => {
    let counter = 0;
    const copy_allCard = [...allCards];
    var stackCardsAll = [];
    // ↓ pick random 20 + 1 + 10 = 31 cards to play
    while (counter < 30) {
      const index = Math.floor(Math.random() * copy_allCard.length + 0);
      stackCardsAll.push(copy_allCard[index]);
      copy_allCard.splice(index, 1);
      counter++;
    }

    // ↓ set a 10 card to cards in hand
    const hand = stackCardsAll.splice(20, 10);
    hand.sort(function (a, b) {
      return a.number - b.number;
    });
    setCardsInHand(hand);

    // ↓ set 20 cards to deck
    var stackList = chunkArray(stackCardsAll, 4);
    setStackCardsList(stackList);
  }, []);

  const [cardsInHand, setCardsInHand] = useState([]); // Cards in user's hand
  const [stackCardsList, setStackCardsList] = useState([]); // 4*5 cardsList for users
  const [selectedCards, setSelectedCards] = useState([]); // selected cards before putting to field
  const [cardsonField, setCardsonField] = useState([]); // current cards on field
  const [movedCards, setMovedCards] = useState([]); //cards which have been moved
  const [revolution, setRevolution] = useState(false); // false ? 13 is stronger : 1 is stronger
  const [prev_card, setPrev_card] = useState([]); // previous cards before the revolution
  const [overlayID, setOverlayID] = useState('');
  const [hintsList, setHintsList] = useState({}); //

  // ↓ useHooks from chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();

  if (colorMode === 'light') {
    toggleColorMode();
  }

  // ↓ chunck a myArray into chunk_size
  function chunkArray(myArray, chunk_size) {
    var index = 0;
    var arrayLength = myArray.length;
    var tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
      let myChunk = myArray.slice(index, index + chunk_size);
      tempArray.push(myChunk);
    }

    return tempArray;
  }

  // ↓ moving a card from and to aother deck
  const addToOtherDeck = (_id, from_Index, to_Index) => {
    if (from_Index === to_Index) {
      return;
    }
    const copyDeck = [...stackCardsList];
    const card_toDeck = stackCardsList[from_Index].filter((card, i) => card._id === _id);
    if (isEqual(card_toDeck[0], copyDeck[to_Index][copyDeck[to_Index].length - 1])) {
      copyDeck[to_Index] = copyDeck[to_Index].concat(card_toDeck[0]);
      copyDeck[from_Index] = stackCardsList[from_Index].filter((card, i) => card._id !== _id);
      setMovedCards([...movedCards, card_toDeck[0]]);

      setStackCardsList(copyDeck);
    }
  };

  // ↓ add selectedCards into cardsonField
  const addToField = (selectedList) => {
    var checkRevolution = selectedList.filter((card) => card.number === 333);
    if (checkRevolution.length >= 1 && checkRevolution.length <= 4) {
      setRevolution(!revolution);
    }
    setPrev_card(cardsonField);
    setCardsonField(selectedList);
    setSelectedCards([]);

    var new_cardsinHand = cardsInHand.filter((card) => !selectedCards.includes(card));
    setCardsInHand(new_cardsinHand);

    var new_cardsonDeck = [...stackCardsList];
    for (var deck in stackCardsList) {
      new_cardsonDeck[deck] = stackCardsList[deck].filter((card) => !selectedCards.includes(card));
      setStackCardsList(new_cardsonDeck);
    }
  };

  //↓ check whether top and second_top cards are identical
  const isEqual = (top, second_top) => {
    // 🦉 => 333
    // 👁 => 666
    // Humalian => 999
    if (top && second_top) {
      return top.number === second_top.number;
    }
    return false;
  };

  // ↓ check should the title of current card should be display
  function shouldBeTop(arr, index, stacks, card) {
    if (index === stacks.length - 1) {
      return true;
    } else if (
      movedCards.includes(arr[stacks.length - 1]) &&
      index === stacks.length - 2 &&
      arr[stacks.length - 1].number === arr[stacks.length - 2].number
    ) {
      return true;
    } else if (
      movedCards.includes(arr[stacks.length - 2]) &&
      index === stacks.length - 3 &&
      arr[stacks.length - 2].number === arr[stacks.length - 3].number
    ) {
      return true;
    } else if (
      movedCards.includes(arr[stacks.length - 3]) &&
      index === stacks.length - 4 &&
      arr[stacks.length - 3].number === arr[stacks.length - 4].number
    ) {
      return true;
    } else {
      return false;
    }
  }

  // ↓ check whether givin list is empty or not
  const isEmpty = (list) => {
    var isEmpty = true;
    for (var a_list in list) {
      if (list[a_list].length !== 0) {
        isEmpty = false;
      }
    }
    return isEmpty;
  };

  // ↓ check number of empty deck in stackCards
  const checkEmptyDeck = (list) => {
    var emptyCounter = 0;
    for (var a_list in list) {
      if (list[a_list].length === 0) {
        emptyCounter += 1;
      }
    }
    return emptyCounter;
  };

  // ↓ add to selectedCards list
  const addSelected = (input_card) => {
    var copy_selected = [...selectedCards];
    if (copy_selected.includes(input_card)) {
      copy_selected = copy_selected.filter((card, id) => card !== input_card);
    } else {
      copy_selected.push(input_card);
    }
    setSelectedCards(copy_selected);
  };

  // ↓ get all the displaying cards
  const getHints = () => {
    // push all displaying cards to flippedCards
    const temp_hand = [...cardsInHand];
    const temp_deck = [...stackCardsList];
    const temp_moved = [...movedCards];
    var flippedCards_all = [];
    for (var deck_idx in temp_deck) {
      var each_deck = temp_deck[deck_idx];
      for (let idx in each_deck) {
        if (temp_moved.includes(each_deck[idx]) && idx !== 0) {
          flippedCards_all.push(each_deck[idx]);
          if (
            !temp_moved.includes(each_deck[idx - 1]) &&
            each_deck[idx].number === each_deck[idx - 1].number
          ) {
            flippedCards_all.push(each_deck[idx - 1]);
          }
        } else if (parseInt(idx) === parseInt(each_deck.length - 1)) {
          flippedCards_all.push(each_deck[idx]);
        }
      }
    }
    flippedCards_all = flippedCards_all.concat(temp_hand);
    flippedCards_all.sort(function (a, b) {
      return a.number - b.number;
    });

    var hints = {
      single: 0,
      specialCards: [],
      double: [],
      triple: [],
      specialCombination: [],
    };
    // if 革命 is first card on field ? only Humalien is available
    var checkRevolution = cardsonField.filter((card) => card.number === 333);
    if (prev_card.length === 0 && checkRevolution.length > 0 && checkRevolution.length < 4) {
      hints.specialCards.push({
        title: 'Humalien',
        color: 'white',
      });
      setHintsList(hints);
      return;
    }

    // Find all numbers in flipped catds
    var allNums = [];
    for (let index in flippedCards_all) {
      allNums.push(flippedCards_all[index].number);
    }
    allNums = allNums.filter((card, index) => allNums.indexOf(card) === index);

    // chunk same number cards
    var chunkSames = [];
    for (let idx in allNums) {
      chunkSames.push(flippedCards_all.filter((card, index) => card.number === allNums[idx]));
    }

    // case when cards on field is 1
    // if (cardsonField.length === 1) {
    //   if (
    //     cardsonField[0].number <= 13 &&
    //     cardsonField[0].number >= 1 &&
    //     cardsonField[0].number !== 7
    //   ) {
    //     if (!revolution && flippedCards_all.some((card) => card.number >= cardsonField[0].number)) {
    //       // 13 is strongest
    //       hints.single = cardsonField[0].number;
    //     } else if (
    //       revolution &&
    //       (flippedCards_all.some((card) => card.number <= cardsonField[0].number) ||
    //         flippedCards_all.some((card) => card.number === 999))
    //     ) {
    //       // 1 is strongest
    //       hints.single = cardsonField[0].number;
    //     }
    //   } else if (
    //     (cardsonField[0].number === 999 && flippedCards_all.some((card) => card.number === 999)) ||
    //     (cardsonField[0].number === 333 && flippedCards_all.some((card) => card.number === 999))
    //   ) {
    //     hints.specialCards.push({
    //       title: 'Humalien',
    //       color: 'white',
    //     });
    //   } else if (
    //     cardsonField[0].number === 7 &&
    //     flippedCards_all.some((card) => card.number === 666)
    //   ) {
    //     hints.specialCards.push({
    //       title: 'Eyes of Providence',
    //       color: 'yellow',
    //     });
    //   } else if (cardsonField[0].number === 333) {
    //     if (!revolution && flippedCards_all.some((card) => card.number >= prev_card[0].number)) {
    //       // 13 is strongest
    //       hints.single = prev_card[0].number;
    //     } else if (
    //       revolution &&
    //       (flippedCards_all.some((card) => card.number <= prev_card[0].number) ||
    //         flippedCards_all.some((card) => card.number === 999))
    //     ) {
    //       // 1 is strongest
    //       hints.single = prev_card[0].number;
    //     }
    //   }
    //   for (let idx in chunkSames) {
    //     if (
    //       (cardsonField[0].number !== 333 &&
    //         !revolution &&
    //         chunkSames[idx].length >= 2 &&
    //         chunkSames[idx][0].number >= cardsonField[0].number &&
    //         cardsonField[0].number !== 7) ||
    //       (cardsonField[0].number === 333 &&
    //         !revolution &&
    //         chunkSames[idx].length >= 2 &&
    //         chunkSames[idx][0].number >= prev_card[0].number &&
    //         cardsonField[0].number !== 7)
    //     ) {
    //       if (chunkSames[idx][0].number === 333 && cardsonField[0].number !== 333) {
    //         hints.double.push({
    //           title: '🦉のダブル',
    //         });
    //       } else if (chunkSames[idx][0].number === 666) {
    //         hints.double.push({
    //           title: 'Eyes of Providence のダブル',
    //         });
    //       } else if (chunkSames[idx][0].number === 999) {
    //         hints.double.push({
    //           title: 'Humalien のダブル',
    //         });
    //       } else if (chunkSames[idx][0].number !== 333) {
    //         hints.double.push({
    //           title: chunkSames[idx][0].number + ' のダブル',
    //         });
    //       }
    //     } else if (
    //       (cardsonField[0].number !== 333 &&
    //         revolution &&
    //         chunkSames[idx].length >= 2 &&
    //         chunkSames[idx][0].number <= cardsonField[0].number &&
    //         cardsonField[0].number !== 7) ||
    //       (cardsonField[0].number === 333 &&
    //         revolution &&
    //         chunkSames[idx].length >= 2 &&
    //         chunkSames[idx][0].number <= prev_card[0].number &&
    //         cardsonField[0].number !== 7)
    //     ) {
    //       if (chunkSames[idx][0].number === 333 && cardsonField[0].number !== 333) {
    //         hints.double.push({
    //           title: '🦉のダブル',
    //         });
    //       } else if (chunkSames[idx][0].number === 666) {
    //         hints.double.push({
    //           title: 'Eyes of Providence のダブル',
    //         });
    //       } else if (chunkSames[idx][0].number === 999) {
    //         hints.double.push({
    //           title: 'Humalien のダブル',
    //         });
    //       } else if (chunkSames[idx][0].number !== 333) {
    //         hints.double.push({
    //           title: chunkSames[idx][0].number + ' のダブル',
    //         });
    //       }
    //     }
    //   }
    // } else if (cardsonField.length === 2) {
    // }
    if (cardsonField.length <= 2) {
      hints = doubleCombination(
        revolution,
        hints,
        cardsonField,
        prev_card,
        flippedCards_all,
        chunkSames,
      );
      if (cardsonField.length <= 1) {
        hints = singleCombination(revolution, hints, cardsonField, prev_card, flippedCards_all);
      }
    }
    setHintsList(hints);
  };

  // console log area
  console.log(hintsList);
  //

  return (
    <CardContex.Provider value={{ addToOtherDeck, addToField }}>
      <Box height="full">
        <Stack h="100vh">
          {/* --------------- Stack of cards in top ------------------------------*/}
          <Flex justifyContent="center" justify="center" mt={5} mb={5}>
            {stackCardsList.map((stacks, p_index) => (
              <BoxDeck key={p_index} to_index={p_index}>
                <Flex key={p_index}>
                  {stacks.map((card, index, a_pile) => (
                    <Card
                      key={index}
                      _id={card._id}
                      from_index={p_index}
                      title={card.title}
                      color={card.color}
                      selected={selectedCards.includes(card)}
                      cardsinHand={false}
                      clicked={() => {
                        const selectable = shouldBeTop(a_pile, index, stacks, card);
                        if (selectable) {
                          addSelected(card);
                        }
                      }}
                      moved={movedCards.includes(card)}
                      // ↓ check if same card title is overlapping
                      top={shouldBeTop(a_pile, index, stacks, card)}
                    />
                  ))}
                </Flex>
              </BoxDeck>
            ))}
          </Flex>
          {/* --------------------------------------------------------------------*/}

          <Flex
            justifyContent="space-between"
            alignItems="center"
            height="full"
            minHeight={'300px'}
          >
            <Stack marginLeft="4rem" marginTop="-5em">
              　
              <Heading size="md" marginLeft="0.5rem" marginBottom="0.5rem">
                ポイント
              </Heading>
              <NumberInput
                size="lg"
                maxW={32}
                defaultValue={0}
                min={0}
                max={399}
                focusBorderColor="#24E500"
                marginBottom="3rem"
                focusInputOnChange={false}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <Menu isLazy>
                {({ isOpen }) => (
                  <>
                    <MenuButton
                      isActive={isOpen}
                      as={Button}
                      rightIcon={<ChevronDownIcon />}
                      size="lg"
                      variant="outline"
                      colorScheme="messenger"
                    >
                      <Heading size="sm">{isOpen ? '閉じる' : 'オプション一覧'}</Heading>
                    </MenuButton>
                    <MenuList>
                      <MenuItem
                        ml={'1rem'}
                        onClick={() => {
                          setOverlayID('hintOverlay');
                          getHints();
                          onOpen();
                        }}
                      >
                        <Heading size="md">ヒント 😎</Heading>
                      </MenuItem>
                      <MenuItem
                        ml={'1rem'}
                        onClick={() => {
                          setTimeout(() => {
                            setCardsonField([]);
                          }, 500);
                        }}
                      >
                        <Heading size="md">流す</Heading>
                      </MenuItem>
                      <MenuItem ml={'1rem'} onClick={() => setRevolution(!revolution)}>
                        <Heading size="md">革命 {revolution ? ' 1強' : ' 13強'}</Heading>
                      </MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu>
            </Stack>
            <Stack>
              {isEmpty(stackCardsList) && isEmpty(cardsInHand) ? (
                // <Heading>あがり🎉</Heading>
                <Flex justifyContent="center" marginBottom="5rem">
                  <Heading>反則あがり😭</Heading>
                </Flex>
              ) : null}
              {/* --------------- cards on field in middle ------------------------------*/}
              <Flex>
                {cardsonField.map((card, index) => (
                  <Card
                    key={index}
                    _id={card._id}
                    title={card.title}
                    color={card.color}
                    selected={false}
                    cardsinHand={true}
                    isDisable={true}
                    top={true}
                    clicked={() => setSelectedCards(cardsonField)}
                  />
                ))}
              </Flex>
              {/* -----------------------------------------------------------------------*/}
            </Stack>

            <Stack marginRight="7rem">
              {selectedCards.length !== 0 ? (
                <Button
                  size="lg"
                  width="100%"
                  onClick={selectedCards.length !== 0 ? () => addToField(selectedCards) : null}
                  marginBottom="2rem"
                  variant="outline"
                  colorScheme="teal"
                >
                  札を場に展開
                </Button>
              ) : null}

              <Button
                size="lg"
                variant="outline"
                colorScheme="purple"
                marginBottom="2rem"
                onClick={() => {
                  setOverlayID('setOppoCards');
                  onOpen();
                }}
              >
                場の札を設定
              </Button>
              {checkEmptyDeck(stackCardsList) !== 0 ? (
                <Button
                  size="lg"
                  width="100%"
                  variant="outline"
                  colorScheme="facebook"
                  onClick={() => {
                    setTimeout(() => {
                      setCardsonField([]);
                    }, 500);
                  }}
                >
                  相手がパス
                </Button>
              ) : null}
              <Overlay
                _id={overlayID}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                oppoCards={(cardList) => {
                  addToField(cardList);
                }}
                revolution={revolution}
              />
            </Stack>
          </Flex>
        </Stack>
        {/* --------------- cards in hand in bottom ------------------------------*/}
        <Flex mt={2}>
          <section className="card-list">
            {cardsInHand.map((card, index) => (
              <Card
                key={index}
                _id={card._id}
                title={card.title}
                color={card.color}
                selected={selectedCards.includes(card)}
                cardsinHand={true}
                top={true}
                clicked={() => addSelected(card)}
              />
            ))}
          </section>
        </Flex>
        {/* ----------------------------------------------------------------------*/}
      </Box>
    </CardContex.Provider>
  );
}
