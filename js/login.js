// 1. Show / Hide Password
const toggleBtn = document.getElementById("togglePassword");
const passwordInput = document.getElementById("password");

toggleBtn.addEventListener("click", function () {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});

// Helper: Get all users from signup page
function getUsers() {
  const users = localStorage.getItem("civicReportUsers");
  return users ? JSON.parse(users) : [];
}

// Helper: Validate email format
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 2. Form Submit with proper validation
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const emailInput = document
    .getElementById("email")
    .value.trim()
    .toLowerCase();
  const password = document.getElementById("password").value;
  const remember = document.getElementById("remember").checked;

  // Clear previous error styles
  document.getElementById("email").classList.remove("border-red-500");
  document.getElementById("password").classList.remove("border-red-500");

  let isValid = true;

  // 1. Validate Email is not empty and format is correct
  if (emailInput === "") {
    alert("Please enter your email.");
    document.getElementById("email").classList.add("border-red-500");
    isValid = false;
  } else if (!isValidEmail(emailInput)) {
    alert("Please enter a valid email address.");
    document.getElementById("email").classList.add("border-red-500");
    isValid = false;
  }

  // 2. Validate Password
  if (password === "") {
    alert("Please enter your password.");
    document.getElementById("password").classList.add("border-red-500");
    isValid = false;
  } else if (password.length < 8) {
    alert("Password must be at least 8 characters long.");
    document.getElementById("password").classList.add("border-red-500");
    isValid = false;
  }

  if (!isValid) return;

  // 3. Check if user exists in localStorage
  const users = getUsers();
  const user = users.find((u) => u.email === emailInput);

  if (!user) {
    // No account found - flag to create account
    alert("No account found with this email. Please create an account first.");
    window.location.href = "../pages/signup.html";
    return;
  }

  // 4. Check if password matches
  if (user.password !== password) {
    alert("Incorrect password. Please try again.");
    document.getElementById("password").classList.add("border-red-500");
    return;
  }

  // 5. Login Successful - Save session
  const sessionData = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    loggedIn: true,
    remember: remember,
    loginTime: new Date().toISOString(),
  };

  if (remember) {
    localStorage.setItem("civicReportSession", JSON.stringify(sessionData));
  } else {
    sessionStorage.setItem("civicReportSession", JSON.stringify(sessionData));
  }

  alert(`Welcome back, ${user.fullName}! Login successful.`);

  //  rest
  document.getElementById("loginForm").reset();
  window.location.href = "dashboard.html";
  console.log("Logged in user:", sessionData);
});
