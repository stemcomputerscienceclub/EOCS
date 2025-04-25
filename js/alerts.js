function showAlert(title, message) {
    // Create alert elements
    const overlay = document.createElement('div');
    overlay.className = 'alert-overlay';
    
    const alertBox = document.createElement('div');
    alertBox.className = 'alert-box';
    
    const icon = document.createElement('div');
    icon.className = 'alert-icon';
    
    const titleEl = document.createElement('h3');
    titleEl.className = 'alert-title';
    titleEl.textContent = title;
    
    const messageEl = document.createElement('p');
    messageEl.className = 'alert-message';
    messageEl.textContent = message;
    
    const button = document.createElement('button');
    button.className = 'alert-button';
    button.textContent = 'OK';
    
    // Assemble alert
    alertBox.appendChild(icon);
    alertBox.appendChild(titleEl);
    alertBox.appendChild(messageEl);
    alertBox.appendChild(button);
    overlay.appendChild(alertBox);
    document.body.appendChild(overlay);
    
    // Handle close
    button.addEventListener('click', () => {
        overlay.remove();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
        }
    });
}

// Usage in your form submission:
document.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    // ... your form submission logic ...
    
    // Show alert on success
    showAlert('Success', 'Registration submitted successfully!');
}); 