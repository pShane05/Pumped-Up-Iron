export const fetchExercisesByBodyPart = async (bodyPart: string) => {
  const url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': '2a535ec02fmshb1bf27a5625f582p15107fjsn834f46357734',
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data; // an array of exercise objects
  } catch (error) {
    console.error('Failed to fetch exercises:', error);
    return [];
  }
};
