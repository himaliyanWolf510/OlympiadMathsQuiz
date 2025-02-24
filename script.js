document.addEventListener("DOMContentLoaded", function () {
  // Retrieve user info from localStorage, if available.
  const storedUserInfo = localStorage.getItem("userInfo");
  const userInfo = storedUserInfo ? JSON.parse(storedUserInfo) : {};

  const timerElement = document.getElementById("timer");
  const quizForm = document.getElementById("quizForm");

  // Start a 30-minute timer (in seconds)
  let totalTime = 30 * 60;
  let timerInterval = setInterval(function () {
    let minutes = Math.floor(totalTime / 60);
    let seconds = totalTime % 60;
    timerElement.textContent =
      (minutes < 10 ? "0" + minutes : minutes) +
      ":" +
      (seconds < 10 ? "0" + seconds : seconds);

    if (totalTime <= 0) {
      clearInterval(timerInterval);
      gradeQuiz({ preventDefault: function () {} });
    }
    totalTime--;
  }, 1000);

  // Function to grade the quiz, append user info, and submit via AJAX (fetch)
  function gradeQuiz(event) {
    if (event) event.preventDefault();

    // Collect quiz answers from input fields answer1 to answer10
    let userAnswers = [];
    for (let i = 1; i <= 10; i++) {
      const input = document.getElementsByName("answer" + i)[0];
      userAnswers.push(input.value.trim());
    }
    // Save the quiz answers locally (if needed for the score page)
    localStorage.setItem("userResponses", JSON.stringify(userAnswers));

    // Create a FormData object from the quiz form (this will include any static fields)
    let formData = new FormData(quizForm);

    // Manually append the user info from localStorage into the FormData.
    for (let key in userInfo) {
      formData.append(key, userInfo[key]);
    }

    // Use fetch to POST the data to the current URL ("/") so that Netlify captures it.
    fetch("/", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        console.log("Form submitted successfully!", response);
        // Redirect to the score page after submission
        window.location.href = "score.html";
      })
      .catch(function (error) {
        console.error("Error submitting form:", error);
        // Even on error, navigate to the score page
        window.location.href = "score.html";
      });
  }

  // Attach the gradeQuiz function to the form submission event
  console.log(quizForm);
  if (quizForm) {
    quizForm.addEventListener("submit", gradeQuiz);
  }
});
