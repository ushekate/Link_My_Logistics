import pbclient from "./db";
export const fetchData = async ({ collectionName, options = {} }) => {
  try {
    pbclient.autoCancellation(false);
    const res = await pbclient.collection(collectionName).getFullList(options);
    return res
  } catch (err) {
    console.log(err)
  }
};
