import {useRoute} from '@react-navigation/native';
import React, {useEffect, useMemo, useState} from 'react';
import {FlatList, Linking, Pressable, Text, View} from 'react-native';
import {Model} from '../../typings';
import {Constants} from '../../constants';
import RNFS from 'react-native-fs';
import {CreatorPostDto} from '../../typings/typings.v2';

export const ExportedModelDetailScreen = () => {
  const [creatorPosts, setCreatorPosts] = useState<CreatorPostDto[]>([]);
  const {params} = useRoute<any>();
  const model: Model = params.model;

  useEffect(() => {
    loadFileContent(model);
  }, [model]);

  const loadFileContent = async (model: Model) => {
    const filePath = `${model.category}/${model.name} ${model.provider}/${model.name}-${model.provider}-posts.txt`;
    const dir = `${RNFS.DownloadDirectoryPath}/${Constants.directoryName}`;
    const creatorPosts: CreatorPostDto[] = await readJsonArrayFromFile(
      `${dir}/${filePath}`,
    );

    setCreatorPosts(creatorPosts.filter(p => p.videos && p.videos.length));
  };

  const readJsonArrayFromFile = async (filePath: string): Promise<any[]> => {
    try {
      const fileExists = await RNFS.exists(filePath);
      if (!fileExists) {
        throw new Error(`File not found at path: ${filePath}`);
      }

      const fileContent = await RNFS.readFile(filePath, 'utf8');
      const parsed = JSON.parse(fileContent);

      if (!Array.isArray(parsed)) {
        throw new Error('Expected a JSON array in the file.');
      }

      return parsed;
    } catch (error) {
      console.error('Error reading or parsing file:', error);
      return [];
    }
  };

  return (
    <View>
      <FlatList
        data={creatorPosts}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <View style={{padding: 10}}>
              {item.videos?.map((v, index) => {
                return (
                  <Pressable
                    key={`${item.id}-${index}`}
                    onPress={() => {
                      if (v.downloadUrl) {
                        const sanitizedUrl = encodeURI(
                          v.downloadUrl?.trim().replace(/([^:]\/)\/+/g, '$1') ||
                            '',
                        );
                        console.log(sanitizedUrl);
                        Linking.openURL(sanitizedUrl).catch(err =>
                          console.error('Failed to open URL:', err),
                        );
                      }
                    }}>
                    <Text
                      style={{color: 'blue', textDecorationLine: 'underline'}}>
                      {item.title} — {v.formattedSize || 'Unknown size'}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          );
        }}
      />
    </View>
  );
};
