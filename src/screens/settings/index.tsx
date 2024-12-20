import React from 'react';
import {StyleSheet, View} from 'react-native';
import TextArea from '../../components/textarea.';
import {useAppDispatch, useAppSelector} from '../../store';
import {SettingActions} from '../../store/slices';
import StyledTextInput from '../../components/textinput';

export const SettingsScreen = () => {
  const {domains, waitingTime, maximumRequest, categories} = useAppSelector(
    state => state.settings,
  );
  const dispatch = useAppDispatch();
  return (
    <View style={styles.container}>
      <TextArea
        placeholder="Download Domains"
        value={domains.join(',')}
        onChangeText={text => {
          dispatch(
            SettingActions.setSettings({
              domains: text.split(','),
            }),
          );
        }}
      />
      <StyledTextInput
        value={'' + waitingTime}
        placeholder="Waiting time..."
        onChangeText={text => {
          if (!Number.isNaN(parseInt(text, 10))) {
            dispatch(
              SettingActions.setSettings({
                waitingTime: parseInt(text),
              }),
            );
          }
        }}
        maxLength={50}
      />
      <StyledTextInput
        value={'' + maximumRequest}
        placeholder="Maximum requests..."
        onChangeText={text => {
          if (!Number.isNaN(parseInt(text, 10))) {
            dispatch(
              SettingActions.setSettings({
                maximumRequest: parseInt(text),
              }),
            );
          }
        }}
        maxLength={50}
      />
      <TextArea
        maxLength={2000}
        placeholder="Categories"
        value={categories.join(',')}
        onChangeText={text => {
          dispatch(
            SettingActions.setSettings({
              categories: text.split(','),
            }),
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  fileView: {
    borderWidth: 1,
    borderStyle: 'solid',
    paddingVertical: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    borderLeftWidth: 1,
    paddingLeft: 10,
  },
});
