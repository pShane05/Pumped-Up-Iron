export const fetchImage = async (exercise: string) => {
  const url = `https://exercisedb.p.rapidapi.com/image?resolution=360&exerciseId=${exercise}`
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '2a535ec02fmshb1bf27a5625f582p15107fjsn834f46357734',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.text();
    return result;
  } catch (error) {
    console.error('Failed to fetch exercises:', error);
  }
};
