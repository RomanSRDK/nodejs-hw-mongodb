export const parseSortParams = ({ sortBy, sortOrder }) => {
  const sortOrederList = ['asc', 'desc'];

  const parsedSortBy = ['name'].includes(sortBy) ? sortBy : '_id';
  const parsedSortOrder = sortOrederList.includes(sortOrder)
    ? sortOrder
    : sortOrederList[0];

  return {
    sortBy: parsedSortBy,
    sortOrder: parsedSortOrder,
  };
};
