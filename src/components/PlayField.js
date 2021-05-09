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
  useToast,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import '../Card/Card.css';
import allCards from '../CardData/AllCards.json';
import Overlay from './Overlay';
import {
  singleCombination,
  doubleCombination,
  TripleCombination,
  QuadrupleCombination,
} from './HintCombinations';

export const CardContex = createContext({
  addToOtherDeck: null,
  addToField: null,
});

export default function PlayField() {
  // Initialize cards for deck, field, and hand
  useEffect(() => {
    initialization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [cardsInHand, setCardsInHand] = useState([]); // Cards in user's hand
  const [stackCardsList, setStackCardsList] = useState([]); // 4*5 cardsList for users
  const [selectedCards, setSelectedCards] = useState([]); // selected cards before putting to field
  const [cardsonField, setCardsonField] = useState([]); // current cards on field
  const [movedCards, setMovedCards] = useState([]); //cards which have been moved
  const [revolution, setRevolution] = useState(false); // false ? 13 is stronger : 1 is stronger
  const [prev_card, setPrev_card] = useState([]); // previous cards before the revolution
  const [round, setRound] = useState(1);
  const [score, setScore] = useState(0);
  const [overlayID, setOverlayID] = useState('');
  const [hintsList, setHintsList] = useState({}); //
  const deckAlphabet = ['A', 'B', 'C', 'D', 'E'];

  // ↓ useHooks from chakra UI
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();

  if (colorMode === 'light') {
    toggleColorMode();
  }

  function initialization() {
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

  // ↓ check whether player is finishing illegally
  const isIllegal = () => {
    let hasHumalien = cardsonField.some((card) => card.number === 999);
    let hasOwl = cardsonField.some((card) => card.number === 333);
    let hasEye = cardsonField.some((card) => card.number === 666);
    if (hasHumalien || hasOwl || hasEye) {
      return true;
    } else if (revolution && cardsonField.length === 1) {
      if (cardsonField[0].number === 1) {
        return true;
      }
    } else if (!revolution && cardsonField.length === 1) {
      if (cardsonField[0].number === 13) {
        return true;
      }
    } else {
      return false;
    }
  };

  // ↓ check number of empty deck in stackCards
  // const checkEmptyDeck = (list) => {
  //   var emptyCounter = 0;
  //   for (var a_list in list) {
  //     if (list[a_list].length === 0) {
  //       emptyCounter += 1;
  //     }
  //   }
  //   return emptyCounter;
  // };

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
      quadruple: [],
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

    if (cardsonField.length <= 4) {
      hints = QuadrupleCombination(
        revolution,
        hints,
        cardsonField,
        prev_card,
        flippedCards_all,
        chunkSames,
        allNums,
      );
      if (cardsonField.length <= 3) {
        hints = TripleCombination(
          revolution,
          hints,
          cardsonField,
          prev_card,
          flippedCards_all,
          chunkSames,
          allNums,
        );

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
      }
    }
    setHintsList(hints);
  };

  //↓ get notification for special card
  const checkEffect = () => {
    var hasSkull = selectedCards.some((card) => card.number === 6);
    if (hasSkull) {
      var numOfSkull = selectedCards.filter((card) => card.number === 6).length;
      var numOfHumalien = selectedCards.filter((card) => card.number === 999).length;
      setScore(score + (numOfSkull + numOfHumalien) * round);
      toast({
        position: 'top-left',
        duration: 3000,
        isClosable: true,
        render: () => (
          <Box color="#003049" p={4} bg="#4cc9f0" borderRadius="10px">
            <Heading size="md">
              ドクロ☠の効果で {(numOfSkull + numOfHumalien) * round}
              ポイント追加です❕
            </Heading>
          </Box>
        ),
      });
    }
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
                <Heading size="lg" textAlign="center" mt="1rem" color="#d3d3d3">
                  {deckAlphabet[p_index]}
                </Heading>
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
              <Box
                background="#1c2335"
                padding="1rem"
                borderRadius="10px"
                border="2px solid #1780a1"
                marginBottom="3rem"
              >
                <Flex alignItems="center" marginBottom="1rem">
                  <Heading size="md" fontFamily="serif" marginRight="1rem">
                    ラウンド
                  </Heading>
                  <Heading size="lg" color="#56cfe1">
                    {round}
                  </Heading>
                </Flex>

                <Flex
                  alignContent="center"
                  alignItems="center"
                  justifyContent="center"
                  marginBottom="1.5rem
                "
                >
                  <Heading size="md" marginRight="1rem">
                    ポイント
                  </Heading>
                  <NumberInput
                    size="lg"
                    maxW={32}
                    defaultValue={0}
                    value={score}
                    min={0}
                    max={399}
                    color="#56cfe1"
                    focusBorderColor="#64dfdf"
                    focusInputOnChange={false}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper
                        onClick={score !== 399 ? () => setScore(score + 1) : null}
                      />
                      <NumberDecrementStepper
                        onClick={score !== 0 ? () => setScore(score - 1) : null}
                      />
                    </NumberInputStepper>
                  </NumberInput>
                </Flex>

                <Flex alignItems="center">
                  <Heading size="md" fontFamily="serif" marginRight="1rem">
                    革命
                  </Heading>
                  <Heading size="md" color="#56cfe1" marginLeft="2.1rem">
                    １{revolution ? '強 ⇚ 弱' : '弱 ⇒ 強'}13
                  </Heading>
                </Flex>
              </Box>
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
                        <Heading size="md">流す 🚽</Heading>
                      </MenuItem>
                      <MenuItem ml={'1rem'} onClick={() => setRevolution(!revolution)}>
                        <Heading size="md">革命 🏳‍🌈</Heading>
                      </MenuItem>
                      <MenuItem
                        ml={'1rem'}
                        onClick={() => {
                          setOverlayID('setOppoCards');
                          onOpen();
                        }}
                      >
                        <Heading size="md">場の札を設定 🎴</Heading>
                      </MenuItem>
                      <MenuItem
                        ml={'1rem'}
                        onClick={
                          round !== 3
                            ? () => {
                                initialization();
                                setRound(round + 1);
                                setCardsonField([]);
                                setPrev_card([]);
                              }
                            : () => window.location.reload()
                        }
                      >
                        <Heading size="md">
                          {round !== 3 ? '次のラウンド👉' : 'もう一度プレイ👉'}
                        </Heading>
                      </MenuItem>
                    </MenuList>
                  </>
                )}
              </Menu>
            </Stack>
            <Stack>
              {isEmpty(stackCardsList) && isEmpty(cardsInHand) ? (
                isIllegal() ? (
                  <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    marginBottom="5rem"
                  >
                    <Heading marginBottom="1rem">反則あがり😭</Heading>
                    <Button
                      size="lg"
                      width="100%"
                      variant="outline"
                      colorScheme="teal"
                      onClick={
                        round !== 3
                          ? () => {
                              initialization();
                              setRound(round + 1);
                              setCardsonField([]);
                              setPrev_card([]);
                            }
                          : () => window.location.reload()
                      }
                    >
                      {round !== 3 ? '次のラウンド' : 'もう一度プレイ'}
                    </Button>
                  </Stack>
                ) : (
                  <Stack
                    justifyContent="center"
                    alignContent="center"
                    alignItems="center"
                    marginBottom="5rem"
                  >
                    <Heading marginBottom="1rem">あがり🎉</Heading>
                    <Button
                      size="lg"
                      width="100%"
                      variant="outline"
                      colorScheme="teal"
                      onClick={
                        round !== 3
                          ? () => {
                              initialization();
                              setRound(round + 1);
                              setCardsonField([]);
                              setPrev_card([]);
                            }
                          : () => window.location.reload()
                      }
                    >
                      {round !== 3 ? '次のラウンド' : 'もう一度プレイ'}
                    </Button>
                  </Stack>
                )
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

            <Stack marginRight="7rem" width="10rem">
              {selectedCards.length !== 0 ? (
                <Button
                  size="lg"
                  width="100%"
                  onClick={
                    selectedCards.length !== 0
                      ? () => {
                          addToField(selectedCards);
                          checkEffect();
                        }
                      : null
                  }
                  marginBottom="2rem"
                  variant="outline"
                  colorScheme="teal"
                >
                  札を場に展開
                </Button>
              ) : null}
              {selectedCards.length !== 0 ? (
                <Button
                  size="lg"
                  width="100%"
                  onClick={selectedCards.length !== 0 ? () => setSelectedCards([]) : null}
                  marginBottom="2rem"
                  variant="outline"
                  colorScheme="white"
                >
                  札をリセット
                </Button>
              ) : null}

              {/* <Button
                size="lg"
                width="100%"
                variant="outline"
                colorScheme="facebook"
                onClick={() => {
                  setTimeout(() => {
                    setCardsonField([]);
                  }, 500);
                  toast({
                    position: 'top-left',
                    duration: 3000,
                    isClosable: true,
                    render: () => (
                      <Box color="#003049" p={4} bg="#fcbf49" borderRadius="10px">
                        <Heading size="md">
                          自分の空いてる山札の数をポイントに追加してください
                        </Heading>
                      </Box>
                    ),
                  });
                }}
              >
                相手がパス
              </Button> */}
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
