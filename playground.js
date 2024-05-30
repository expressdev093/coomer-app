// const t =
//   'https://c3.coomer.su/data/2e/fe/2efe1d27d739c2045087b0403388555e3ec5db3e20b6de0bf08269f05c09d336.mp4?f=0h2k7l8v5xj1dv5084c46_source.mp4';

// function replaceTitle(url, date, title) {
//   const splitUrl = url.split('?f=');
//   const baseUrl = splitUrl[0];
//   const urlFileName = splitUrl[1];
//   const extension = urlFileName.substring(urlFileName.lastIndexOf('.') + 1);
//   const newFileName = `${date} ${title} ${new Date().getTime()}.${extension}`;

//   const newUrl = `${baseUrl}?f=${newFileName}`;

//   return newUrl;
// }

// const newUrl = replaceTitle(t, new Date().toString(), 'video title');
// console.log(newUrl);

const data = [
  {
    category: 'Try on hail',
    links: [
      {
        id: 'dharmajonesxxx',
        image: 'https://img.coomer.su/icons/onlyfans/dharmajonesxxx',
        name: 'dharmajonesxxx',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/dharmajonesxxx',
        text: 'Posts of dharmajonesxxx from OnlyFans | Coomer',
      },
      {
        id: '286247803682824192',
        image: 'https://img.coomer.su/icons/fansly/286247803682824192',
        name: 'cute_bean_ting',
        provider: 'Fansly',
        url: 'https://coomer.su/fansly/user/286247803682824192',
        text: 'Posts of cute_bean_ting from Fansly | Coomer',
      },
      {
        id: 'melody_katt',
        image: 'https://img.coomer.su/icons/onlyfans/melody_katt',
        name: 'melody_katt',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/melody_katt',
        text: 'Posts of melody_katt from OnlyFans | Coomer',
      },
    ],
  },
  {
    category: 'Twitter',
    links: [
      {
        id: 'steffiiirose',
        image: 'https://img.coomer.su/icons/onlyfans/steffiiirose',
        name: 'steffiiirose',
        provider: 'OnlyFans',
        url: 'https://coomer.party/onlyfans/user/steffiiirose',
        text: 'Posts of steffiiirose from OnlyFans | Coomer',
      },
      {
        id: 'vinny_bun',
        image: 'https://img.coomer.su/icons/onlyfans/vinny_bun',
        name: 'vinny_bun',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/vinny_bun',
        text: 'Posts of vinny_bun from OnlyFans | Coomer',
      },
      {
        id: 'jenniferdeku',
        image: 'https://img.coomer.su/icons/onlyfans/jenniferdeku',
        name: 'jenniferdeku',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/jenniferdeku',
        text: 'Posts of jenniferdeku from OnlyFans | Coomer',
      },
      {
        id: 'lanaivy.x',
        image: 'https://img.coomer.su/icons/onlyfans/lanaivy.x',
        name: 'lanaivy.x',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/lanaivy.x',
        text: 'Posts of lanaivy.x from OnlyFans | Coomer',
      },
      {
        id: 'sunnylanelive',
        image: 'https://img.coomer.su/icons/onlyfans/sunnylanelive',
        name: 'sunnylanelive',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/sunnylanelive',
        text: 'Posts of sunnylanelive from OnlyFans | Coomer',
      },
      {
        id: 'misslacylennon',
        image: 'https://img.coomer.su/icons/onlyfans/misslacylennon',
        name: 'misslacylennon',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/misslacylennon',
        text: 'Posts of misslacylennon from OnlyFans | Coomer',
      },
      {
        id: 'weedprincess',
        image: 'https://img.coomer.su/icons/onlyfans/weedprincess',
        name: 'weedprincess',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/weedprincess',
        text: 'Posts of weedprincess from OnlyFans | Coomer',
      },
      {
        id: 'nyksniks',
        image: 'https://img.coomer.su/icons/onlyfans/nyksniks',
        name: 'nyksniks',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/nyksniks',
        text: 'Posts of nyksniks from OnlyFans | Coomer',
      },
      {
        id: 'nickeyhuntsman',
        image: 'https://img.coomer.su/icons/onlyfans/nickeyhuntsman',
        name: 'nickeyhuntsman',
        provider: 'OnlyFans',
        url: 'https://coomer.su/onlyfans/user/nickeyhuntsman',
        text: 'Posts of nickeyhuntsman from OnlyFans | Coomer',
      },
    ],
  },
];

const flatData = [];

data.map(d => {
  d.links.map(l => {
    flatData.push({...l, category: d.category});
  });
});

console.log(flatData);
