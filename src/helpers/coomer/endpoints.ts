export const COOMER_ENDPOINTS = {
  creators: '/creators.txt',
  userPosts: (service: string, creatorId: string) =>
    `/${service}/user/${creatorId}`,
  specificPost: (service: string, creatorId: string, postId: string) =>
    `/${service}/user/${creatorId}/post/${postId}`,
};
