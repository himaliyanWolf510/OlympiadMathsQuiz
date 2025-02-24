document.addEventListener("DOMContentLoaded", function () {
  // Retrieve the stored user info from registration (if available)
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const info = JSON.parse(userInfo);
    const quizForm = document.getElementById("quizForm");

    // Create hidden fields for each user info field
    const fields = {
      firstName: info.firstName,
      lastName: info.lastName,
      email: info.email,
      phone: info.phone,
      classEnrolled: info.classEnrolled
    };

    console.log(fields);

    for (const key in fields) {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = fields[key];
      quizForm.appendChild(input);
    }
  }

  // Timer and form submission code...
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

  // Grade quiz function to store responses and redirect
  function gradeQuiz(event) {
    if (event) event.preventDefault();
    const correctAnswers = ["64", "5", "35", "1", "1938", "48", "1.25", "3xyz", "93", "10"];
    let userAnswers = [];
    for (let i = 1; i <= 10; i++) {
      const input = document.getElementsByName("answer" + i)[0];
      userAnswers.push(input.value.trim());
    }
    localStorage.setItem("userResponses", JSON.stringify(userAnswers));
    // Now the form submission will include the registration fields as hidden inputs.
    // If you're using an AJAX submission method, ensure that the form data is sent to Netlify.
    // Here, we'll use a fetch-based submission to post the data:
    const formData = new FormData(quizForm);
    fetch("/", {
      method: "POST",
      body: formData
    })
    .then(function(response) {
      console.log("Form successfully submitted!", response);
      window.location.href = "score.html";
    })
    .catch(function(error) {
      console.error("Error submitting form:", error);
      window.location.href = "score.html";
    });
  }

  if (quizForm) {
    quizForm.addEventListener("submit", gradeQuiz);
  }
});
