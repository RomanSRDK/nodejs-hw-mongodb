import { contactTypeList } from '../constants/constants.js';

export const parseFilterParams = ({ type, isFavourite }) => {
  const parsedType = contactTypeList.includes(type) ? type : undefined;

  let parsedIsFavourite;
  if (isFavourite === 'true') {
    parsedIsFavourite = true;
  } else if (isFavourite === 'false') {
    parsedIsFavourite = false;
  }

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
