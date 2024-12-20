const rawUrl =
  'https:\\/\\/ev-h.phncdn.com\\/hls\\/videos\\/202303\\/21\\/427839721\\/720P_4000K_427839721.mp4\\/master.m3u8?validfrom=1719667683&validto=1719674883&ipa=190.2.152.151&hdl=-1&hash=ueS03duE%2BrJuwlL%2FTCjLAlqaUms%3D';

// Replace the escaped backslashes with a single backslash
const formattedUrl = rawUrl.replace(/\\\//g, '/');

console.log(formattedUrl);
