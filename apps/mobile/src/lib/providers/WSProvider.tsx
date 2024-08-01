import React, {PropsWithChildren, useEffect} from 'react';
import Config from 'react-native-config';
import {WebSocket} from '../ws';
import {Socket} from 'socket.io-client';

const WSContext = React.createContext({} as Socket);

const URL = 'http://localhost:3333';
// const URL = Config.API_URL!;

export const WSProvider: React.FC<PropsWithChildren> = ({children}) => {
  const ws = new WebSocket(URL);
  const socket = ws.socket('/');

  useEffect(() => {
    socket.open();

    return () => {
      socket.disconnect();
    };
  }, []);

  return <WSContext.Provider value={socket}>{children}</WSContext.Provider>;
};

export const useSocket = () => React.useContext(WSContext);
