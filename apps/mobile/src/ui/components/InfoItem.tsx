import React, {PropsWithChildren} from 'react';
import {StyleSheet, Text} from 'react-native';
import {Row} from './Row';
import {Colors} from '../constants';
import {text} from '../../../assets/styles/text';
import {global} from '../../../assets/styles/global';

export const InfoItem: React.FC<PropsWithChildren> = ({children}) => {
  return (
    <Row gap={10} alignCenter style={styles.container}>
      <Text style={[text.semiBold, text.l, {color: Colors.orange}]}>
        Info:{' '}
      </Text>
      <Text style={[text.s, global.flex, text.medium]}>{children}</Text>
    </Row>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 10,
    backgroundColor: Colors.option,
    borderColor: Colors.orange,
    borderRadius: 12,
  },
  infoText: {},
});
