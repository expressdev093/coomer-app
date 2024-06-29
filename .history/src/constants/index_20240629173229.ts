import {makeBookmarkFlat} from '../helpers';
import {Category} from '../typings';

export const Constants = {
  bookmarks: makeBookmarkFlat(
    require('./../assets/bookmark.json') as Category[],
  ),
  categories: (require('./../assets/bookmark.json') as Category[]).map(d => ({
    label: d.category,
    value: d.category,
  })),
  directoryName: 'coomer',
  bunkrDirectory: 'bunkr',
  videoExtensions: [
    '.mp4',
    '.mov',
    '.avi',
    '.mkv',
    '.wmv',
    '.flv',
    '.webm',
    '.m4v',
  ],
  imageExtensions: ['.jpg', '.jpeg'],
};

// const url = [
//   'https://c6.coomer.su/data/85/e3/85e39d1b6b1cb3dd18a509fd8db979e4e91fb784cbe4814d85ce6830c47766d8.mp4?f=2022-07-13 20 Afternoon delight 🌞♥️ (OnlyFans) 1716805989165.mp4',
//   'https://c5.coomer.su/data/e1/3f/e13f3f5dce59f10dc78f1aac0d432a92b969f2bdf5c68732ad9e4a959bbb4756.mp4?f=2022-07-10 21 Ass & titties, ass & titties 🍒 🍑 (OnlyFans) 1716805989948.mp4',
//   'https://c2.coomer.su/data/e9/b2/e9b2450c9c20e9e474286891dae3a5c6cd8c2562d287840eaf27341272cf43de.mp4?f=2022-07-10 21 Ass & titties, ass & titties 🍒 🍑 (OnlyFans) 1716805989954.mp4',
//   'https://c3.coomer.su/data/d1/6c/d16c6cbe7b7b166efcedafb6944dbd0d2d35a4db965f92307a9eee7268e1bb7e.mp4?f=2022-07-05 16 A little yoga video I made (half clothed/half nude) Enjoy :) (OnlyFans) 1716805990406.mp4',
//   'https://c3.coomer.su/data/84/2b/842b8e16bbbd5ec363d9283a17c2cfea903f545b31d01f1bebbd00a137934ea1.mp4?f=2022-07-01 18 Had a fun Skype session today 😛 (OnlyFans) 1716805991887.mp4',
//   'https://c4.coomer.su/data/e2/70/e2704524cdf72974449087260d777c9ef076c1e32774d55a00b7824f19592ddd.mp4?f=2022-06-26 00 I love kissing girls 👯‍♀️ Check your inbox for the full vide.. (OnlyFans) 1716805992579.mp4',
//   'https://c5.coomer.su/data/e6/d8/e6d890fba3d4a144dbdd21d48da99af265c35be1c4fb5de0f2f684f229f1db2b.mp4?f=2022-06-21 18 Do you like it when I rub lotion all over my body? 🤤🥰 (OnlyFans) 1716805994484.mp4',
//   'https://c1.coomer.su/data/3a/4c/3a4c048daf8173d14bc4c2f90327cf09dddb671cc89bac3027454b62b6b32224.mp4?f=2022-06-17 18 Imagine this: I’m the girl next door that you want to fuck 😉.. (OnlyFans) 1716805993776.mp4',
//   'https://c4.coomer.su/data/6f/36/6f361ec507d90dd6ea6cb0d4d1d2b05e49609cbc4c064aea3ee28c379f6078af.mp4?f=2022-06-11 18 🥚Let’s pretend we’re at a strip club today on my OnlyFans 😋 .. (OnlyFans) 1716805995694.mp4',
//   'https://c6.coomer.su/data/cf/9e/cf9e0697ed15da36a0215704474d00e45418cdb3dab7654cb65fb753625608f7.mp4?f=2022-05-31 15 I usually like to post more of my bootay 🍑, but come on, it’.. (OnlyFans) 1716805998051.mp4',
//   'https://c4.coomer.su/data/69/34/6934cefa4e463762bc64f72a0efc5dd68ff7694cae635bbee0f2f9f433153eaf.mp4?f=2022-05-30 19 Boobies are here for two reasons: 1) feeding & 2) playing wi.. (OnlyFans) 1716805998317.mp4',
//   'https://c3.coomer.su/data/2e/fe/2efe1d27d739c2045087b0403388555e3ec5db3e20b6de0bf08269f05c09d336.mp4?f=2022-05-24 21 I need help getting out of these handcuffs so I can touch my.. (OnlyFans) 1716805999374.mp4',
// ];
