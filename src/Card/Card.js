import React from 'react';
import { Heading } from '@chakra-ui/react';
import './Card.css';
import { ItemTypes } from '../utils/items';
import { useDrag } from 'react-dnd';

export default function Card(props) {
  const [{ isDraging }, drag] = useDrag({
    item: {
      type: ItemTypes.CARD,
      _id: props._id,
      from_index: props.from_index,
    },
    collect: (monitor) => ({
      isDraging: !!monitor.isDragging(),
    }),
  });

  let className = setClassName(props);
  
  return (
    <article
      className={className}
      ref={props.cardsinHand ? null : drag}
      style={{ opacity: isDraging ? '0' : '1' }}
      onClick={props.isDisable ? null : () => props.clicked()}
    >
      <Heading
        as="h1"
        size={isNaN(props.title) ? 'lg' : '3xl'}
        cursor="pointer"
        color={props.color}
      >
        {props.top ? props.title : null}
      </Heading>
      <Heading
        as="h1"
        size={isNaN(props.title) ? 'lg' : '3xl'}
        position="absolute"
        bottom="2rem"
        right="1.5rem"
        cursor="pointer"
        color={props.color}
      >
        {props.top ? props.title : null}
      </Heading>
    </article>
  );
}

function setClassName(props) {
  let className = '';
  if (props.cardsinHand) {
    if (props.selected) {
      className += 'card card_in_hand hand_selected glow';
    } else {
      className += 'card card_in_hand';
    }
  } else {
    if (props.selected) {
      className += 'cardStack card_in_Stack same_card glow';
    } else if (props.top) {
      if (props.moved) {
        className += 'cardStack card_in_Stack same_card glow';
      }
      className += 'cardStack card_in_Stack';
    } else {
      className += 'cardStack card_in_Stack';
    }
  }
  return className;
}

