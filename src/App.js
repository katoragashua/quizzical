import React, { useState, useEffect } from "react";
import Intro from "./components/Intro";
import Quiz from "./components/Quiz";
import {decode} from "html-entities"
import Confetti from "react-confetti"

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => ({
    intro: true,
    quiz: false,
  }));

  const [quiz, setQuiz] = useState(() => []);
  const [gameOn, setGameOn] = useState(() => true);
  const [count, setCount] = useState(() => 0);
  const [score, setScore] = useState(() => 0);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        const quizArray = [];
        data.results.forEach((datum, index) => {
          datum = {
            question: decode(datum.question),
            answer: decode(datum.correct_answer),
            incorrect_answers: decode(datum.incorrect_answers),
            allAnswers: [...datum.incorrect_answers, datum.correct_answer],
            id: index,
            userAnswer: "",
          };
          quizArray.push(datum);
          console.log(datum.answer)
        });
        setQuiz(quizArray);
      });
  }, [count]);

  function switchPages() {
    setCurrentPage((prev) => {
      return {
        ...prev,
        intro: !prev.intro,
        quiz: !prev.quiz,
      };
    });
  }

  function compileUserAnswers(e) {
    const newArray = [];
    const { name, value,} = e.target;

    quiz.forEach((item) => {
      if (item.id === Number(name)) {
        item = {
          ...item,
          userAnswer: value,
        };
        newArray.push(item);
      } else {
        newArray.push(item);
      }
    });
    setQuiz(newArray);
  }

  function checkAnswers() {
    const allUserAnswers = quiz.map((item) => item.userAnswer);
    const answers = quiz.map((item) => item.answer);

    
    for (let i = 0; i < allUserAnswers.length; i++) {
      if (allUserAnswers[i] === answers[i]) {
        setScore(prev => prev + 1);
      }
    }
    setGameOn((prev) => !prev);
    setQuiz((prev) => {
      return prev.map((item) => {
        return {
          ...item,
          score: score,
        };
      });
    });
  }

  function playAgain() {
    setCount((prev) => prev + 1);
    setGameOn((prev) => !prev);
  }

  return (
    <>
      {currentPage.intro && (
        <main className="intro-main">
          <Intro onClick={switchPages} />
        </main>
      )}
      {currentPage.quiz && (
        <main className="quiz-main">
          {score === 5 && <Confetti />}
          <Quiz
            onClick={switchPages}
            quiz={quiz}
            handleChange={compileUserAnswers}
            checkAnswers={checkAnswers}
            gameOn={gameOn}
            playAgain={playAgain}
            score={score}
          />
        </main>
      )}
    </>
  );
}

// function getAnswers() {
//     const allAnswers = []
//     quizes.forEach(quiz => {
//         let random = Math.floor(Math.random() * (quizes.length + 1))
//         quiz.incorrect_answers.splice(random, 0, quiz.correct_answer)
//         allAnswers.push(quiz.incorrect_answers)
//     })
//     return allAnswers
// }

// function shuffle(arr) {
//     for (let i = 0; i < arr.length; i++) {
//         let random = Math.floor(Math.random() * (i + 1))
//         let item = arr[i]
//         arr[i] = arr[random]
//         arr[random] = item
//     }
//     return arr
// }
//
