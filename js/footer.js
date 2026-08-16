// footer.js

const footer = document.createElement("footer");

footer.className = "site-footer";

footer.innerHTML = `
<div class="footer-container">

    <!-- Logo / Brand -->
    <div class="footer-logo">
        CivicReport Platform
    </div>

    <!-- Footer Links -->
    <div class="footer-links">
        <a href="privacy.html">Privacy Policy</a>
        <a href="terms.html">Terms of service</a>
        <a href="help.html">Help Center</a>
    </div>

    <!-- Copyright -->
    <div class="footer-copy">
        © 2026 CivicReport Platform. All rights reserved.
    </div>

</div>
`;

// Add footer to the page
document.body.appendChild(footer);
