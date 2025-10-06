// Academic Rank to Maximum Hours Mapping
const rankHours = {
  professor: 10,
  associate: 12,
  assistant: 14,
  lecturer: 16,
  ta: 16,
}

// Hardcoded credentials for demo (static pages only)
const users = {
  faculty: {
    password: "faculty123",
    type: "faculty",
    name: "Dr. Ahmed Al-Saud",
  },
  admin: {
    password: "admin123",
    type: "admin",
    name: "System Administrator",
  },
}

// Check authentication on protected pages
function checkAuth(requiredType) {
  const loggedIn = localStorage.getItem("loggedIn")
  const userType = localStorage.getItem("userType")

  if (!loggedIn || loggedIn !== "true") {
    window.location.href = "login.html"
    return false
  }

  if (requiredType && userType !== requiredType) {
    alert("Access denied. You do not have permission to view this page.")
    window.location.href = "login.html"
    return false
  }

  return true
}

// Logout function
function logout() {
  localStorage.removeItem("loggedIn")
  localStorage.removeItem("userType")
  localStorage.removeItem("username")
  localStorage.removeItem("name")
  window.location.href = "index.html"
}

document.addEventListener("DOMContentLoaded", () => {
  // Update maximum hours based on selected rank
  const academicRankSelect = document.getElementById("academicRank")
  const maxHoursInput = document.getElementById("maxHours")
  const availabilityRadios = document.querySelectorAll('input[name="availability"]')
  const coursePreferencesSection = document.getElementById("coursePreferencesSection")

  // Update max hours when rank changes
  if (academicRankSelect && maxHoursInput) {
    academicRankSelect.addEventListener("change", function () {
      const selectedRank = this.value
      if (selectedRank && rankHours[selectedRank]) {
        maxHoursInput.value = rankHours[selectedRank] + " hours"
      } else {
        maxHoursInput.value = "--"
      }
    })
  }

  // Show/hide course preferences based on availability
  if (availabilityRadios.length > 0 && coursePreferencesSection) {
    availabilityRadios.forEach((radio) => {
      radio.addEventListener("change", function () {
        if (this.value === "available" || this.value === "partial") {
          coursePreferencesSection.style.display = "block"
        } else {
          coursePreferencesSection.style.display = "none"
        }
      })
    })
  }

  // Drag and Drop functionality for course preferences
  const availableCourses = document.getElementById("availableCourses")
  const selectedCourses = document.getElementById("selectedCourses")

  if (availableCourses && selectedCourses) {
    let draggedElement = null

    // Add drag event listeners to all course items
    function addDragListeners() {
      const courseItems = document.querySelectorAll(".course-item")
      courseItems.forEach((item) => {
        item.addEventListener("dragstart", handleDragStart)
        item.addEventListener("dragend", handleDragEnd)
      })
    }

    function handleDragStart(e) {
      draggedElement = this
      this.classList.add("dragging")
      e.dataTransfer.effectAllowed = "move"
    }

    function handleDragEnd(e) {
      this.classList.remove("dragging")
    }

    function handleDragOver(e) {
      if (e.preventDefault) {
        e.preventDefault()
      }
      e.dataTransfer.dropEffect = "move"
      return false
    }

    function handleDrop(e) {
      if (e.stopPropagation) {
        e.stopPropagation()
      }

      if (draggedElement) {
        // Remove placeholder text if exists
        const placeholder = this.querySelector("p")
        if (placeholder) {
          placeholder.remove()
        }

        this.appendChild(draggedElement)
        updateRankNumbers()
      }

      return false
    }

    function updateRankNumbers() {
      const items = selectedCourses.querySelectorAll(".course-item")
      items.forEach((item, index) => {
        // Add rank number if not exists
        let rankBadge = item.querySelector(".rank-badge")
        if (!rankBadge) {
          rankBadge = document.createElement("span")
          rankBadge.className = "badge bg-primary rank-badge me-2"
          item.insertBefore(rankBadge, item.firstChild)
        }
        rankBadge.textContent = index + 1
      })
    }

    availableCourses.addEventListener("dragover", handleDragOver)
    availableCourses.addEventListener("drop", handleDrop)
    selectedCourses.addEventListener("dragover", handleDragOver)
    selectedCourses.addEventListener("drop", handleDrop)

    addDragListeners()
  }

  // Form submission handler
  const preferencesForm = document.getElementById("preferencesForm")
  if (preferencesForm) {
    preferencesForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const rank = document.getElementById("academicRank").value
      const availability = document.querySelector('input[name="availability"]:checked').value

      if (!rank) {
        alert("Please select your academic rank")
        return
      }

      if (availability === "available" || availability === "partial") {
        const selectedCoursesList = document.getElementById("selectedCourses")
        const selectedItems = selectedCoursesList.querySelectorAll(".course-item")

        if (selectedItems.length === 0) {
          alert("Please rank at least one course preference")
          return
        }
      }
//----- RahAFS addition: Save faculty preferences -----
const selectedCoursesList = document.getElementById("selectedCourses");
const selectedItems = selectedCoursesList ? selectedCoursesList.querySelectorAll(".course-item") : [];
const courses = [];

selectedItems.forEach((li) => {
  const text = li.textContent.trim().replace(/^\d+\s*/, ""); // يشيل رقم الترتيب لو موجود
  courses.push(text);
});

const rankSelect = document.getElementById("academicRank");
const rankValue = rankSelect ? rankSelect.value : "";

const availabilityInput = document.querySelector('input[name="availability"]:checked');
const availabilityValue = availabilityInput ? availabilityInput.value : "";

// خريطة الرتب للعرض في الداشبورد
const rankMap = {
  professor: "Professor",
  associate: "Associate Professor",
  assistant: "Assistant Professor",
  lecturer: "Lecturer",
  ta: "Teaching Assistant"
};

const formData = {
  name: localStorage.getItem("name") || "Faculty Member",
  rank: rankMap[rankValue] || rankValue,
  availability: availabilityValue === "available" ? "Available" :
                availabilityValue === "partial" ? "Partially Available" :
                "Unavailable",
  courses: courses
};

localStorage.setItem("facultyForm", JSON.stringify(formData));
//-----  addition ends -----

      alert("Preferences submitted successfully!")
      window.location.href = "faculty-dashboard.html"
    })
  }

  // Login form validation
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const username = document.getElementById("username").value
      const password = document.getElementById("password").value
      const userType = document.getElementById("userType").value

      // Validate credentials
      if (users[username] && users[username].password === password && users[username].type === userType) {
        // Store login info in localStorage
        localStorage.setItem("loggedIn", "true")
        localStorage.setItem("userType", userType)
        localStorage.setItem("username", username)
        localStorage.setItem("name", users[username].name)

        // Redirect based on user type
        if (userType === "faculty") {
          window.location.href = "faculty-dashboard.html"
        } else {
          window.location.href = "admin-dashboard.html"
        }
      } else {
        // Show error message
        let errorAlert = document.querySelector(".alert-danger")
        if (!errorAlert) {
          errorAlert = document.createElement("div")
          errorAlert.className = "alert alert-danger mt-3"
          loginForm.appendChild(errorAlert)
        }
        errorAlert.textContent = "Invalid username, password, or user type. Please try again."
      }
    })
  }

  const userNameElement = document.querySelector(".user-name")
  if (userNameElement) {
    const name = localStorage.getItem("name")
    if (name) {
      userNameElement.textContent = name
    }
  }
})
