document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const chatBtn = document.querySelector('.chat-btn');

    // Handle form submission
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Basic validation
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Show success message
                alert('Thank you for your message. We will get back to you soon!');
                contactForm.reset();
            } else {
                alert(data.error || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            console.error('Contact form error:', error);
            alert('An error occurred while sending your message. Please try again.');
        }
    });

    // Live chat functionality
    if (chatBtn) {
        chatBtn.addEventListener('click', function() {
            // Initialize chat widget
            if (window.initChat) {
                window.initChat({
                    name: document.getElementById('name')?.value || '',
                    email: document.getElementById('email')?.value || ''
                });
            } else {
                alert('Chat service is currently unavailable. Please try again later.');
            }
        });
    }

    // Subject field dynamic behavior
    const subjectSelect = document.getElementById('subject');
    subjectSelect.addEventListener('change', function() {
        const messageInput = document.getElementById('message');
        const selectedSubject = this.value;

        // Add placeholder text based on selected subject
        switch (selectedSubject) {
            case 'general':
                messageInput.placeholder = 'How can we help you?';
                break;
            case 'competition':
                messageInput.placeholder = 'Please provide your competition-related inquiry...';
                break;
            case 'registration':
                messageInput.placeholder = 'Please describe any registration issues or questions...';
                break;
            case 'sponsorship':
                messageInput.placeholder = 'Tell us about your organization and sponsorship interests...';
                break;
            default:
                messageInput.placeholder = 'Type your message here...';
        }
    });

    // Character counter for message
    const messageTextarea = document.getElementById('message');
    const maxLength = 1000;
    
    messageTextarea.addEventListener('input', function() {
        const remaining = maxLength - this.value.length;
        let counterElement = this.parentElement.querySelector('.char-counter');
        
        if (!counterElement) {
            counterElement = document.createElement('div');
            counterElement.className = 'char-counter';
            this.parentElement.appendChild(counterElement);
        }
        
        counterElement.textContent = `${remaining} characters remaining`;
        counterElement.style.color = remaining < 50 ? 'red' : 'inherit';
    });
});