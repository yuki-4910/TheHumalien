import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  Button,
  Select,
  Stack,
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import allCards from '../CardData/AllCards.json';

export default function OpponentCards(props) {
  const btnRef = React.useRef();
  const [cardsIDs, setCardsIDs] = useState([]);
  const [sizeofList, setSizeofList] = useState(1);

  // ↓ base on the cardsID list, filter the card objects from allCards.json
  const filterCards = () => {
    var allCards_obj = [...allCards];
    var selectedCards = [];
    for (let cardID in cardsIDs) {
      if (cardsIDs[cardID].number === 666 || cardsIDs[cardID].number === 999) {
        let filteredCards = allCards_obj.filter(
          (card, i) => card.number === cardsIDs[cardID].number,
        );
        selectedCards.push(filteredCards[0]);
      } else if (cardsIDs[cardID].color !== '' && cardsIDs[cardID].number !== '') {
        let filteredCards = allCards_obj.filter(
          (card, i) =>
            card.color === cardsIDs[cardID].color && card.number === cardsIDs[cardID].number,
        );
        selectedCards.push(filteredCards[0]);
      }
    }
    return selectedCards;
  };

  return (
    <Drawer
      isOpen={props.isOpen}
      placement="right"
      onClose={props.onClose}
      finalFocusRef={btnRef}
      size={'md'}
    >
      <DrawerOverlay>
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            {props._id === 'setOppoCards' ? (
              <Heading size="lg" mb={'3rem'}>
                相手が出した札の
              </Heading>
            ) : (
              <Heading size="lg" mb={'3rem'}>
                出せる組み合わせは
              </Heading>
            )}
          </DrawerHeader>

          <DrawerBody>
            <form
              id={props._id}
              onSubmit={(e) => {
                e.preventDefault();
                const list = filterCards();
                props.oppoCards(list);
                setSizeofList(1);
                setCardsIDs([]);
                props.onClose();
              }}
            >
              {props._id === 'setOppoCards' ? (
                <>
                  <Flex alignItems="center">
                    <Heading size="md" mr={3}>
                      枚数は?
                    </Heading>
                    <NumberInput
                      size="md"
                      defaultValue={1}
                      min={1}
                      max={4}
                      alignItems="center"
                      onChange={(e) => {
                        setSizeofList(e);
                      }}
                      focusInputOnChange={false}
                      value={sizeofList}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {cardsIDs.length === 0 ? (
                      <Button
                        ml={'1rem'}
                        onClick={() => {
                          var template = {
                            number: '',
                            color: '',
                          };
                          var template_list = [...cardsIDs];
                          for (var size = cardsIDs.length; size < sizeofList; size++) {
                            template_list.push(template);
                          }
                          setCardsIDs(template_list);
                        }}
                      >
                        決定
                      </Button>
                    ) : (
                      <Button
                        ml={'1rem'}
                        onClick={() => {
                          setSizeofList(1);
                          setCardsIDs([]);
                        }}
                      >
                        リセット
                      </Button>
                    )}
                  </Flex>
                  <Text size="md" mt={3}>
                    ⚠ Humalian と Eye of Provideonce は<br />
                    色の選択が特殊カードになります
                  </Text>
                  {cardsIDs.map((card, index) => (
                    <Stack marginY={'3rem'} key={index}>
                      <Heading size="md">{index + 1} 枚目</Heading>
                      <Select
                        variant="filled"
                        placeholder="カードを選択してください"
                        onChange={(e) => {
                          var currentCards = [...cardsIDs];
                          currentCards[index] = {
                            number: parseInt(e.target.value),
                            color: currentCards[index].color,
                          };
                          setCardsIDs(currentCards);
                        }}
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6☠</option>
                        <option value="7">7👼</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="11">11</option>
                        <option value="12">12</option>
                        <option value="13">13</option>
                        <option value="666">Eyes of Providence 👁</option>
                        <option value="333">🦉</option>
                        <option value="999">Humalian</option>
                      </Select>
                      <Select
                        variant="filled"
                        placeholder="色をを選択してください"
                        onChange={(e) => {
                          var currentCards = [...cardsIDs];
                          currentCards[index] = {
                            number: currentCards[index].number,
                            color: e.target.value,
                          };
                          setCardsIDs(currentCards);
                        }}
                      >
                        <option value="red">レッド</option>
                        <option value="blue">ブルー</option>
                        <option value="green">グリーン</option>
                        <option value="yellow">イエロー</option>
                        <option value="special">特殊カード</option>
                      </Select>
                    </Stack>
                  ))}
                </>
              ) : (
                <>
                  <Heading size="4xl">
                    Feature
                    <br />
                    Not Available
                  </Heading>
                </>
              )}
            </form>
          </DrawerBody>

          <DrawerFooter justifyContent="left">
            <Button type="submit" mr={3} form={props._id} colorScheme="telegram">
              札を展開
            </Button>
            <Button
              variant="outline"
              colorScheme="pink"
              onClick={() => {
                setSizeofList(1);
                setCardsIDs([]);
                props.onClose();
              }}
            >
              キャンセル
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
}
