import React, { useContext } from 'react';
import { Box } from '@chakra-ui/react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../utils/items';
import { CardContex } from './PlayField';

export default function BoxDeck(props) {
  const { addToOtherDeck } = useContext(CardContex);

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.CARD,
    drop: (item, monitor) => {
      addToOtherDeck(item._id, item.from_index, props.to_index);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <Box
      ref={drop}
      minWidth={'250Px'}
      minHeight={'350px'}
      bg={isOver ? 'gray.300' : 'none'}
      border="1px solid white"
      padding={3}
    >
      {props.children}
    </Box>
  );
}
