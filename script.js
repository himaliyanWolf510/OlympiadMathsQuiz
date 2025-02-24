document.addEventListener("DOMContentLoaded", function () {
    // References to the DOM elements
    const timerElement = document.getElementById("timer");
    const quizForm = document.getElementById("quizForm");
  
    // Set total time for 30 minutes in seconds
    let totalTime = 30 * 60;
    
    // Timer interval function
    let timerInterval = setInterval(function () {
      let minutes = Math.floor(totalTime / 60);
      let seconds = totalTime % 60;
      timerElement.textContent =
        (minutes < 10 ? "0" + minutes : minutes) +
        ":" +
        (seconds < 10 ? "0" + seconds : seconds);
  
      if (totalTime <= 0) {
        clearInterval(timerInterval);
        // When time runs out, call gradeQuiz with a dummy event
        gradeQuiz({ preventDefault: function () {} });
      }
      totalTime--;
    }, 1000);
  
    // Function to grade the quiz, send an email, and navigate to the score page
    function gradeQuiz(event) {
      if (event) event.preventDefault();
    
      // Collect user responses
      let userAnswers = [];
      for (let i = 1; i <= 10; i++) {
        const input = document.getElementsByName("answer" + i)[0];
        userAnswers.push(input.value.trim());
      }
      localStorage.setItem("userResponses", JSON.stringify(userAnswers));
    
      // Create a FormData object from the form
      const form = document.getElementById("quizForm");
      const formData = new FormData(form);
      
      // Optionally, you can add additional fields if needed:
      // formData.append("userResponses", JSON.stringify(userAnswers));
    
      // Post the form data to the current URL (Netlify will capture this submission)
      fetch("/", {
        method: "POST",
        body: formData
      })
      .then(function(response) {
        console.log("Form successfully submitted!", response);
        // Redirect to score page after submission
        window.location.href = "score.html";
      })
      .catch(function(error) {
        console.error("Error submitting form:", error);
        // Even on error, navigate to score page or handle error appropriately
        window.location.href = "score.html";
      });
    }
    
    
    // Attach event listener for form submission if the form exists
    if (quizForm) {
      quizForm.addEventListener("submit", gradeQuiz);
    }
  });
  