export const parseJson = async (response) => {
  try {
    return await response.json();
  } catch {
    return {};
  }
};
