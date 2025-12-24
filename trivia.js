/**
 * CLI TRIVIA Game
 * A Command-line trivia game with timer, scoring, and user feedback
 */

const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Trivia questions database
const triviaQuestions = [
    {
        question: "What is the capital of France?",
        options: ["A) London", "B) Berlin", "C) Paris", "D) Madrid"],
        correctAnswer: "C",
        timeLimit: 15
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["A) Venus", "B) Mars", "C) Jupiter", "D) Saturn"],
        correctAnswer: "B",
        timeLimit: 15
    },
    {
        question: "What is the largest ocean on Earth?",
        options: ["A) Atlantic", "B) Indian", "C) Arctic", "D) Pacific"],
        correctAnswer: "D",
        timeLimit: 15
    },
    {
        question: "Who painted the Mona Lisa?",
        options: ["A) Van Gogh", "B) Picasso", "C) Da Vinci", "D) Rembrandt"],
        correctAnswer: "C",
        timeLimit: 15
    },
    {
        question: "What is the smallest prime number?",
        options: ["A) 0", "B) 1", "C) 2", "D) 3"],
        correctAnswer: "C",
        timeLimit: 15
    }
];

// Game state
let currentQuestionIndex = 0;
let score = 0;
let totalQuestions = triviaQuestions.length;
let gameTimer = null;
let questionStartTime = null;

/**
 * Display welcome message and start the game
 */
function startGame() {
    console.clear();
    console.log("=".repeat(50));
    console.log("         WELCOME TO CLI TRIVIA GAME");
    console.log("=".repeat(50));
    console.log("\nRules:");
    console.log("- Answer each question within the time limit");
    console.log("- Type A, B, C, or D to select your answer");
    console.log("- Your score will be displayed at the end");
    console.log("\n" + "=".repeat(50) + "\n");
    
    setTimeout(() => {
        presentQuestion();
    }, 2000);
}

/**
 * Present a question to the user
 */
function presentQuestion() {
    if (currentQuestionIndex >= totalQuestions) {
        endGame();
        return;
    }
    
    const question = triviaQuestions[currentQuestionIndex];
    questionStartTime = Date.now();
    
    console.log(`\nQuestion ${currentQuestionIndex + 1}/${totalQuestions}`);
    console.log("-".repeat(50));
    console.log(question.question);
    question.options.forEach(option => console.log(option));
    console.log(`\nTime limit: ${question.timeLimit} seconds`);
    console.log("-".repeat(50));
    
    // Start timer
    let timeRemaining = question.timeLimit;
    gameTimer = setInterval(() => {
        timeRemaining--;
        process.stdout.write(`\rTime remaining: ${timeRemaining}s `);
        
        if (timeRemaining <= 0) {
            clearInterval(gameTimer);
            console.log("\n\n⏰ Time's up!");
            provideFeedback(null, question.correctAnswer);
        }
    }, 1000);
    
    getUserAnswer();
}

/**
 * Get user's answer
 */
function getUserAnswer() {
    rl.question('\nYour answer (A/B/C/D): ', (answer) => {
        clearInterval(gameTimer);
        
        const userAnswer = answer.trim().toUpperCase();
        const question = triviaQuestions[currentQuestionIndex];
        
        // Validate input
        if (!['A', 'B', 'C', 'D'].includes(userAnswer)) {
            console.log("\n❌ Invalid input! Please enter A, B, C, or D.");
            presentQuestion();
            return;
        }
        
        provideFeedback(userAnswer, question.correctAnswer);
    });
}

/**
 * Provide immediate feedback on user's answer
 * @param {string} userAnswer - The user's selected answer
 * @param {string} correctAnswer - The correct answer
 */
function provideFeedback(userAnswer, correctAnswer) {
    const timeTaken = ((Date.now() - questionStartTime) / 1000).toFixed(1);
    
    console.log("\n" + "=".repeat(50));
    
    if (userAnswer === correctAnswer) {
        console.log("✅ CORRECT! Well done!");
        score++;
    } else if (userAnswer === null) {
        console.log(`❌ TIME UP! The correct answer was: ${correctAnswer}`);
    } else {
        console.log(`❌ INCORRECT! The correct answer was: ${correctAnswer}`);
    }
    
    console.log(`Time taken: ${timeTaken}s`);
    console.log(`Current score: ${score}/${currentQuestionIndex + 1}`);
    console.log("=".repeat(50));
    
    currentQuestionIndex++;
    
    setTimeout(() => {
        presentQuestion();
    }, 2000);
}

/**
 * End the game and display final results
 */
function endGame() {
    console.log("\n" + "=".repeat(50));
    console.log("              GAME OVER!");
    console.log("=".repeat(50));
    
    const percentage = ((score / totalQuestions) * 100).toFixed(1);
    
    console.log(`\nFinal Score: ${score}/${totalQuestions} (${percentage}%)`);
    
    // Performance feedback
    if (percentage === 100) {
        console.log("\n🏆 PERFECT SCORE! Outstanding performance!");
    } else if (percentage >= 80) {
        console.log("\n🌟 Excellent work! Great knowledge!");
    } else if (percentage >= 60) {
        console.log("\n👍 Good job! Keep practicing!");
    } else if (percentage >= 40) {
        console.log("\n📚 Not bad! Review the topics and try again!");
    } else {
        console.log("\n💪 Keep learning! Practice makes perfect!");
    }
    
    console.log("\n" + "=".repeat(50));
    
    // Ask if user wants to play again
    rl.question('\nWould you like to play again? (Y/N): ', (answer) => {
        if (answer.trim().toUpperCase() === 'Y') {
            resetGame();
            startGame();
        } else {
            console.log("\nThank you for playing! Goodbye! 👋\n");
            rl.close();
        }
    });
}

/**
 * Reset game state for a new game
 */
function resetGame() {
    currentQuestionIndex = 0;
    score = 0;
    gameTimer = null;
    questionStartTime = null;
}

// Start the game
startGame();