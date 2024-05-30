import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ScopedStorage from 'react-native-scoped-storage';
import {Category, Model} from '../typings';

const DIRECTORY_DIR_PATH = 'directory_dir_path';
const BOOKMARK_JSON = 'bookmark_json';
const BOOKMARK_CATEGORIES = 'bookmark_categories';
const IS_AP_LOAD_FIRST_TIME = 'is_app_load_first_time';
const SHOW_HIDE_IMAGE = 'show_hide_image';

export class Storage {
  static setDirectory = async (value: ScopedStorage.FileType) => {
    try {
      await AsyncStorage.setItem(DIRECTORY_DIR_PATH, JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  static getDirectory = async (): Promise<ScopedStorage.FileType> => {
    const str = (await AsyncStorage.getItem(DIRECTORY_DIR_PATH)) ?? '';
    return JSON.parse(str) as ScopedStorage.FileType;
  };

  static setBookmark = async (value: Model[]) => {
    try {
      await AsyncStorage.setItem(BOOKMARK_JSON, JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  static getBookmarks = async (): Promise<Model[]> => {
    const str = (await AsyncStorage.getItem(BOOKMARK_JSON)) ?? '';
    return JSON.parse(str) as Model[];
  };

  static setCategories = async (value: any[]) => {
    try {
      await AsyncStorage.setItem(BOOKMARK_CATEGORIES, JSON.stringify(value));
    } catch (e) {
      // saving error
    }
  };

  static getCategories = async (): Promise<any[]> => {
    const str = (await AsyncStorage.getItem(BOOKMARK_CATEGORIES)) ?? '';
    return JSON.parse(str) as any[];
  };

  static setFirstLoad = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(IS_AP_LOAD_FIRST_TIME, `${value}`);
    } catch (e) {
      // saving error
    }
  };

  static getIsFirstLoad = async (): Promise<boolean> => {
    const str = (await AsyncStorage.getItem(IS_AP_LOAD_FIRST_TIME)) ?? 'true';

    return str === 'true';
  };

  static setImageShow = async (value: boolean) => {
    try {
      await AsyncStorage.setItem(SHOW_HIDE_IMAGE, `${value}`);
    } catch (e) {
      // saving error
    }
  };

  static isImageShow = async (): Promise<boolean> => {
    const str = (await AsyncStorage.getItem(SHOW_HIDE_IMAGE)) ?? 'true';

    return str === 'true';
  };
}
