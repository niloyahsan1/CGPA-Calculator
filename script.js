document.addEventListener("DOMContentLoaded", function () {
    var courseCountSelect = document.getElementById("courseCount");
    var courseGpaInputs = document.getElementById("courseGpaInputs");
    var hasCSE400Checkbox = document.getElementById("hasCSE400");
    var cse400GpaInput = document.getElementById("cse400GpaInput");
    var emptyCoursesNotice = document.getElementById("emptyCoursesNotice");
    var cgpaForm = document.getElementById("cgpaForm");
    
    // Result elements
    var resultText = document.getElementById("resultText");
    var resultBox = document.getElementById("resultBox");
    var resultPlaceholder = document.getElementById("resultPlaceholder");
    var startOverButton = document.getElementById("startOverButton");

    function updateCourseNoticeState() {
        var courseCount = parseInt(courseCountSelect.value) || 0;
        var hasCSE400 = hasCSE400Checkbox.checked;

        if (courseCount > 0 || hasCSE400) {
            if (emptyCoursesNotice) emptyCoursesNotice.style.display = "none";
        } else {
            if (emptyCoursesNotice) emptyCoursesNotice.style.display = "block";
        }
    }

    // Update course GPA inputs based on selected course count
    courseCountSelect.addEventListener("change", function () {
        var courseCount = parseInt(courseCountSelect.value) || 0;
        courseGpaInputs.innerHTML = ""; // Clear previous inputs

        if (courseCount > 0) {
            for (var i = 1; i <= courseCount; i++) {
                var div = document.createElement("div");
                div.className = "form-group";
                div.innerHTML = `
                    <label for="c${i}_gpa">Course ${i} GPA (3 Credits)</label>
                    <input type="number" step="0.01" min="0" max="4.00" id="c${i}_gpa" name="c${i}_gpa" placeholder="e.g. 4.00" required>
                `;
                courseGpaInputs.appendChild(div);
            }
        }
        updateCourseNoticeState();
    });

    // Show CSE400 GPA input when checkbox is checked
    hasCSE400Checkbox.addEventListener("change", function () {
        if (hasCSE400Checkbox.checked) {
            cse400GpaInput.innerHTML = `
                <div class="form-group">
                    <label for="cse400_gpa">CSE400 GPA (4 Credits)</label>
                    <input type="number" step="0.01" min="0" max="4.00" id="cse400_gpa" name="cse400_gpa" placeholder="e.g. 4.00" required>
                </div>
            `;
        } else {
            cse400GpaInput.innerHTML = ""; // Clear CSE400 input if unchecked
        }
        updateCourseNoticeState();
    });

    // Calculate CGPA
    cgpaForm.addEventListener("submit", function (event) {
        event.preventDefault();

        var cdcom = parseFloat(document.getElementById("cdcom").value) || 0;
        var oldcgpa = parseFloat(document.getElementById("oldcgpa").value) || 0;
        var courseCount = parseInt(courseCountSelect.value) || 0;
        var hasCSE400 = hasCSE400Checkbox.checked;

        var lastsempoints = cdcom * oldcgpa;
        var recentpoints = 0;
        var newcd = courseCount * 3;

        // Calculate points for regular courses
        if (courseCount > 0) {
            for (var i = 1; i <= courseCount; i++) {
                var inputEl = document.getElementById(`c${i}_gpa`);
                var courseGpa = inputEl ? parseFloat(inputEl.value) || 0 : 0;
                recentpoints += 3 * courseGpa;
            }
        }

        // Add points for CSE400 if taken
        if (hasCSE400) {
            var cse400Input = document.getElementById("cse400_gpa");
            var cse400Gpa = cse400Input ? parseFloat(cse400Input.value) || 0 : 0;
            recentpoints += 4 * cse400Gpa;
            newcd += 4;
        }

        var totalCredits = cdcom + newcd;
        var finalCGPA = 0;

        if (totalCredits <= 0) {
            resultText.textContent = "0.00";
        } else {
            var FINAL = (lastsempoints + recentpoints) / totalCredits;
            finalCGPA = Math.round(FINAL * 100) / 100;
            resultText.textContent = finalCGPA.toFixed(2);
        }

        if (resultPlaceholder) resultPlaceholder.style.display = "none";
        resultBox.style.display = "block";
    });

    // Start Over / Reset logic
    if (startOverButton) {
        startOverButton.addEventListener("click", function () {
            cgpaForm.reset();
            courseGpaInputs.innerHTML = "";
            cse400GpaInput.innerHTML = "";
            resultBox.style.display = "none";
            if (resultPlaceholder) resultPlaceholder.style.display = "block";
            updateCourseNoticeState();
        });
    }
});
