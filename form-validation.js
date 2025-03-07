document.addEventListener('DOMContentLoaded', function() {
    // Get the form and all input elements
    const form = document.querySelector('#contact-form form');
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const telephone = document.getElementById('telephone');
    const email = document.getElementById('email');
    const message = document.getElementById('message');
    const submitButton = document.getElementById('send-message');
    
    // Function to validate each field
    function validateField(field, regex, errorMessage) {
        // Create or get error element
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '14px';
            errorElement.style.marginTop = '-15px';
            errorElement.style.marginBottom = '15px';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        // Test the field against regex
        if (!regex.test(field.value)) {
            field.style.borderColor = '#e74c3c';
            errorElement.textContent = errorMessage;
            return false;
        } else {
            field.style.borderColor = '#2ecc71';
            errorElement.textContent = '';
            return true;
        }
    }
    
    // Function to validate message field (non-regex)
    function validateMessage(field) {
        let errorElement = field.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.color = '#e74c3c';
            errorElement.style.fontSize = '14px';
            errorElement.style.marginTop = '-15px';
            errorElement.style.marginBottom = '15px';
            field.parentNode.insertBefore(errorElement, field.nextSibling);
        }
        
        if (field.value.trim() === '') {
            field.style.borderColor = '#e74c3c';
            errorElement.textContent = 'Please enter your message';
            return false;
        } else {
            field.style.borderColor = '#2ecc71';
            errorElement.textContent = '';
            return true;
        }
    }
    
    // Validation when form is submitted
    submitButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validation patterns
        const nameRegex = /^[a-zA-Z]{2,}$/;
        const phoneRegex = /^(\+\d{1,3})?\s?\d{9,15}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Validate each field
        const isFirstNameValid = validateField(
            firstName, 
            nameRegex, 
            'First name must contain at least 2 letters (no numbers or special characters)'
        );
        
        const isLastNameValid = validateField(
            lastName, 
            nameRegex, 
            'Last name must contain at least 2 letters (no numbers or special characters)'
        );
        
        const isPhoneValid = validateField(
            telephone, 
            phoneRegex, 
            'Please enter a valid phone number (e.g., +254779130005 or 0779130005)'
        );
        
        const isEmailValid = validateField(
            email, 
            emailRegex, 
            'Please enter a valid email address'
        );
        
        const isMessageValid = validateMessage(message);
        
        // If all validations pass
        if (isFirstNameValid && isLastNameValid && isPhoneValid && isEmailValid && isMessageValid) {
            // Special handling for Netlify forms
            // Create a hidden input for Netlify's form-name
            if (!form.querySelector('input[name="form-name"]')) {
                let formNameInput = document.createElement('input');
                formNameInput.setAttribute('type', 'hidden');
                formNameInput.setAttribute('name', 'form-name');
                formNameInput.setAttribute('value', 'feedback');
                form.appendChild(formNameInput);
            }
            
            // Use fetch API to submit the form to Netlify
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(new FormData(form)).toString()
            })
            .then(() => {
                // Show success message
                alert('Form submitted successfully! Thank you for your message.');
                // Reset the form
                form.reset();
                // Reset validation styling
                [firstName, lastName, telephone, email, message].forEach(field => {
                    field.style.borderColor = '';
                });
            })
            .catch((error) => {
                console.error('Form submission error:', error);
                alert('There was a problem submitting your form. Please try again later.');
            });
        } else {
            // Scroll to the first error
            const firstError = document.querySelector('.error-message:not(:empty)');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    });
    
    // Real-time validation as user types
    [firstName, lastName, telephone, email, message].forEach(field => {
        field.addEventListener('blur', function() {
            switch(field.id) {
                case 'firstName':
                    validateField(field, /^[a-zA-Z]{2,}$/, 'First name must contain at least 2 letters');
                    break;
                case 'lastName':
                    validateField(field, /^[a-zA-Z]{2,}$/, 'Last name must contain at least 2 letters');
                    break;
                case 'telephone':
                    validateField(field, /^(\+\d{1,3})?\s?\d{9,15}$/, 'Please enter a valid phone number');
                    break;
                case 'email':
                    validateField(field, /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address');
                    break;
                case 'message':
                    validateMessage(field);
                    break;
            }
        });
    });
});