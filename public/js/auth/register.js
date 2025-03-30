document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const categorySelect = document.getElementById('category');
    const gradeYearSelect = document.getElementById('gradeYear');
    const gradeYearContainer = document.querySelector('.grade-year');

    // Grade/Year options based on category
    const gradeOptions = {
        'high-school': [
            { value: '9', label: 'Grade 9' },
            { value: '10', label: 'Grade 10' },
            { value: '11', label: 'Grade 11' },
            { value: '12', label: 'Grade 12' }
        ],
        'university': [
            { value: '1', label: '1st Year' },
            { value: '2', label: '2nd Year' },
            { value: '3', label: '3rd Year' },
            { value: '4', label: '4th Year' }
        ]
    };

    // Update grade/year options when category changes
    categorySelect.addEventListener('change', function() {
        const category = this.value;
        gradeYearContainer.style.display = category ? 'block' : 'none';
        
        if (category) {
            gradeYearSelect.innerHTML = `
                <option value="">Select Grade/Year</option>
                ${gradeOptions[category]
                    .map(opt => `<option value="${opt.value}">${opt.label}</option>`)
                    .join('')}
            `;
            gradeYearSelect.required = true;
        } else {
            gradeYearSelect.required = false;
        }
    });

    // Form submission handler
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Basic validation
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Phone number validation
        const phone = document.getElementById('phone').value;
        if (!phone.match(/^01[0-9]{9}$/)) {
            alert('Please enter a valid Egyptian phone number');
            return;
        }

        // Collect form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Store token if provided
                if (result.token) {
                    localStorage.setItem('authToken', result.token);
                }
                // Redirect to success page or login
                window.location.href = '/auth/login?registered=true';
            } else {
                alert(result.error || 'Registration failed. Please try again.');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('An error occurred during registration. Please try again.');
        }
    });

    // Password strength validation
    const passwordInput = document.getElementById('password');
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && isLongEnough)) {
            this.setCustomValidity('Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters');
        } else {
            this.setCustomValidity('');
        }
    });
});