import Dexie from 'dexie';

export const db = new Dexie('QuizDatabase');

db.version(1).stores({
  attempts: '++id,date,score,timeSpent',
  answers: '++id,attemptId,questionId,userAnswer,isCorrect'
});

export const saveQuizAttempt = async (score, timeSpent, answers) => {
  const attemptId = await db.attempts.add({
    date: new Date(),
    score,
    timeSpent
  });

  const answersToSave = answers.map(answer => ({
    attemptId,
    questionId: answer.questionId,
    userAnswer: answer.userAnswer,
    isCorrect: answer.isCorrect
  }));

  await db.answers.bulkAdd(answersToSave);
  return attemptId;
};

export const getAttemptHistory = async () => {
  return await db.attempts.orderBy('date').reverse().toArray();
}; 