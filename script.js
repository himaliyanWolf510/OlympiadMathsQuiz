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
      
      // Define correct answers (not used in email, but you might extend functionality later)
      const correctAnswers = ["64", "5", "35", "1", "1938", "48", "1.25", "3xyz", "93", "10"];
      let userAnswers = [];
      
      // Loop over input fields named answer1 ... answer10
      for (let i = 1; i <= 10; i++) {
        const input = document.getElementsByName("answer" + i)[0];
        userAnswers.push(input.value.trim());
      }
      
      // Store the responses in localStorage (for the score page to use)
      localStorage.setItem("userResponses", JSON.stringify(userAnswers));
      
      // Build a message string from userAnswers for the email body
      let message = "Quiz Submission Results:\n";
      for (let i = 0; i < userAnswers.length; i++) {
        message += "Problem " + (i + 1) + ": " + userAnswers[i] + "\n";
      }
      
      // Use EmailJS to send the email to shahmeraj@gmail.com
      emailjs.send(
        'service_t785vzy', 
        'template_lajt4gg', 
        {
          to_email: 'mehraj.math1729@gmail.com',
          subject: 'Quiz Submission Results',
          message: message
        },
        'K84bKhzGGDKsH6LgR'
      )
      .then(function(response) {
        console.log('SUCCESS!', response.status, response.text);
        window.location.href = "score.html";
      }, function(error) {
        console.log('FAILED...', error);
        // Even if sending the email fails, navigate to the score page
        window.location.href = "score.html";
      });
    }
    
    // Attach event listener for form submission if the form exists
    if (quizForm) {
      quizForm.addEventListener("submit", gradeQuiz);
    }
  });
  