// Show/hide search bar when nav search button is clicked
document.addEventListener("DOMContentLoaded", function () {
  const searchBtn = document.getElementsByClassName("searchBtn")[0];
  const searchBar = document.getElementById("searchBar");
  if (searchBtn && searchBar) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      if (
        searchBar.style.display === "none" ||
        searchBar.style.display === ""
      ) {
        searchBar.style.display = "block";
        setTimeout(() => {
          document.getElementById("searchInput").focus();
        }, 100);
      } else {
        searchBar.style.display = "none";
      }
    });
  }
  // Optional: Hide search bar when clicking outside
  document.addEventListener("click", function (e) {
    if (
      searchBar.style.display === "block" &&
      !searchBar.contains(e.target) &&
      !e.target.classList.contains("searchBtn")
    ) {
      searchBar.style.display = "none";
    }
  });
});

// Admin login form enhancements
document.addEventListener("DOMContentLoaded", function () {
  // Password visibility toggle
  const passwordToggle = document.querySelector(".password-toggle");

  if (passwordToggle) {
    passwordToggle.addEventListener("click", function () {
      const input = this.closest(".input-group").querySelector("input");
      const icon = this.querySelector("i");

      if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
        this.setAttribute("aria-label", "Hide password");
      } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
        this.setAttribute("aria-label", "Show password");
      }
    });
  }

  // Add loading state to form submission
  const form = document.querySelector(".admin-login-form");

  if (form) {
    form.addEventListener("submit", function () {
      const button = this.querySelector(".admin-login-btn");
      const originalText = button.innerHTML;

      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
      button.disabled = true;

      // Revert after 3 seconds if still on page (fallback)
      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
      }, 3000);
    });
  }
});

// Confirm before deleting a post
function confirmDelete() {
  return confirm(
    "Are you sure you want to delete this post? This action cannot be undone."
  );
}

// Alert on successful post update
document
  .getElementsByClassName("btn-primary")[0]
  .addEventListener("click", function () {
    alert("Post updated successfully!");
  });
