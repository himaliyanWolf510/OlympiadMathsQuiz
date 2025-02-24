document.addEventListener("DOMContentLoaded", function () {
  // Update the static hidden fields with registration info from localStorage.
  const storedUserInfo = localStorage.getItem("userInfo");
  if (storedUserInfo) {
    const info = JSON.parse(storedUserInfo);
    document.getElementById("firstNameHidden").value = info.firstName || "";
    document.getElementById("lastNameHidden").value = info.lastName || "";
    document.getElementById("emailHidden").value = info.email || "";
    document.getElementById("phoneHidden").value = info.phone || "";
    document.getElementById("classEnrolledHidden").value = info.classEnrolled || "";
  }

  // Timer and form submission code.
  const timerElement = document.getElementById("timer");
  const quizForm = document.getElementById("quizForm");
  let totalTime = 30 * 60; // 30 minutes in seconds
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

  // Grade quiz function to collect answers, store them, and submit the form via fetch.
  function gradeQuiz(event) {
    if (event) event.preventDefault();
    const correctAnswers = ["64", "5", "35", "1", "1938", "48", "1.25", "3xyz", "93", "10"];
    let userAnswers = [];
    for (let i = 1; i <= 10; i++) {
      const input = document.getElementsByName("answer" + i)[0];
      userAnswers.push(input.value.trim());
    }
    localStorage.setItem("userResponses", JSON.stringify(userAnswers));
    
    // Create a FormData object from the quiz form.
    let formData = new FormData(quizForm);
    // (Since the hidden fields are already in the HTML, they are automatically included.)
    
    fetch("/", {
      method: "POST",
      body: formData
    })
      .then(function (response) {
        console.log("Form successfully submitted!", response);
        window.location.href = "score.html";
      })
      .catch(function (error) {
        console.error("Error submitting form:", error);
        window.location.href = "score.html";
      });
  }

  if (quizForm) {
    quizForm.addEventListener("submit", gradeQuiz);
  }
});
