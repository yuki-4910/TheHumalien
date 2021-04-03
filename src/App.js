import PlayField from './components/PlayField';
import { ChakraProvider, extendTheme  } from '@chakra-ui/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import './App.css';

function App() {
  const cardColor = extendTheme({
    colors: {
      red: '#ff006e',
      blue: '#1982c4',
      green: '#6a994e',
      yellow: '#fbff12',
      white: '#ebebeb',
    },
  });

  return (
    <ChakraProvider theme={cardColor}>
      <DndProvider backend={HTML5Backend}>
        <PlayField />
      </DndProvider>
    </ChakraProvider>
  );
}

export default App;
