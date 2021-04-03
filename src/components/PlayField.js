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
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import '../Card/Card.css';
import allCards from '../CardData/AllCards.json';
import Overlay from './Overlay';

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
  const [overlayID, setOverlayID] = useState("")
  const { isOpen, onOpen, onClose } = useDisclosure();

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
  const addToField = () => {
    var fieldCard_copy = [...cardsonField];
    fieldCard_copy.concat(selectedCards);
    setCardsonField(selectedCards);
    setSelectedCards([]);

    var new_cardsinHand = cardsInHand.filter((card) => !selectedCards.includes(card));
    setCardsInHand(new_cardsinHand);

    var new_cardsonDeck = [...stackCardsList];
    for (var deck in stackCardsList) {
      new_cardsonDeck[deck] = stackCardsList[deck].filter((card) => !selectedCards.includes(card));
      setStackCardsList(new_cardsonDeck);
    }
  };

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
    } else if (movedCards.includes(arr[stacks.length - 1]) && index === stacks.length - 2) {
      return true;
    } else if (movedCards.includes(arr[stacks.length - 2]) && index === stacks.length - 3) {
      return true;
    } else if (movedCards.includes(arr[stacks.length - 3]) && index === stacks.length - 4) {
      return true;
    } else {
      return false;
    }
  }

  const isEmpty = (list) => {
    var isEmpty = true;
    for (var a_list in list) {
      if (list[a_list].length !== 0) {
        isEmpty = false;
      }
    }
    return isEmpty;
  };

  // console log area
  //

  return (
    <CardContex.Provider value={{ addToOtherDeck, addToField }}>
      <Box height="full" background="#100e14">
        <Stack h="100vh">
          <Flex justifyContent="center" mt={5} mb={5}>
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
                          setSelectedCards([...selectedCards, card]);
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
                    >
                      <Heading size="sm">{isOpen ? '閉じる' : 'オプション一覧'}</Heading>
                    </MenuButton>
                    <MenuList>
                      <MenuItem>
                        <Heading size="md" onClick={() => {
                          setOverlayID("hintOverlay")
                          onOpen()
                        }}>
                          😎 ヒント
                        </Heading>
                      </MenuItem>
                      <MenuItem>
                        <Heading size="md">
                          相手がパス
                        </Heading>
                      </MenuItem>
                      <MenuItem>
                        <Heading size="md" onClick={() => setCardsonField([])}> 
                          流す
                        </Heading>
                      </MenuItem>
                      {/* <MenuItem onClick={() => alert('Kagebunshin')}>Create a Copy</MenuItem> */}
                    </MenuList>
                  </>
                )}
              </Menu>
            </Stack>
            <Stack>
              <Flex justifyContent="center" marginBottom="5rem">
                {isEmpty(stackCardsList) && isEmpty(cardsInHand) ? (
                  // <Heading>あがり🎉</Heading>
                  <Heading>反則あがり😭</Heading>
                ) : null}
              </Flex>
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
            </Stack>

            <Stack marginRight="7rem">
              <Button
                size="lg"
                width="100%"
                onClick={selectedCards.length !== 0 ? () => addToField() : null}
                marginBottom="2rem"
                variant="outline"
              >
                札を場に展開
              </Button>
              {selectedCards.length === 0 ? null : (
                <Button
                  marginBottom="2rem"
                  size="lg"
                  variant="outline"
                  onClick={() => setSelectedCards([])}
                >
                  選択をリセット
                </Button>
              )}
              <Button size="lg" variant="outline" onClick={() => {
                setOverlayID("setOppoCards")
                onOpen()
              }}>
                場の札を設定
              </Button>
              <Overlay
                _id={overlayID}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
                oppoCards={(cardList) => setCardsonField(cardList)}
              />
            </Stack>
          </Flex>
        </Stack>

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
                clicked={() => setSelectedCards([...selectedCards, card])}
              />
            ))}
          </section>
        </Flex>
      </Box>
    </CardContex.Provider>
  );
}
