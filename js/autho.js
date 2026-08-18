document
  .getElementById("authorityForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    // Get all values
    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const organization = document.getElementById("organization").value.trim();
    const role = document.getElementById("role").value;
    const badgeId = document.getElementById("badgeId").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const terms = document.getElementById("terms").checked;

    //  Check required fields
    if (
      !fullName ||
      !email ||
      !organization ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid email address!");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!terms) {
      alert("You must agree to the Terms of Service!");
      return;
    }

    const authority = {
      fullName: fullName,
      email: email,
      organization: organization,
      role: role,
      badgeId: badgeId,
      password: password,
      dateJoined: new Date().toLocaleString(),
    };

    let authorities = JSON.parse(localStorage.getItem("authorityUsers")) || [];

    // Check if email already exists
    const emailExists = authorities.some(function (user) {
      return user.email === email;
    });

    if (emailExists) {
      alert("This email is already registered!");
      return;
    }

    // new authority
    authorities.push(authority);

    // Save to localStorage
    localStorage.setItem("authorityUsers", JSON.stringify(authorities));

    // Success message
    alert("Authority account created successfully!\n\nYou can now log in.");

    // Clear the form
    document.getElementById("authorityForm").reset();
  });
