import { features } from "../3/mock";

export const getSensitiveFeatures = () => {
  return features.filter((feature) => feature.sensitive === true);
};
