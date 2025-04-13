// Countdown Timer for Registration Deadline

class CountdownTimer {
    constructor(deadline) {
        this.deadline = deadline;
        this.daysElement = document.querySelector('.days');
        this.hoursElement = document.querySelector('.hours');
        this.minutesElement = document.querySelector('.minutes');
        this.secondsElement = document.querySelector('.seconds');
        this.countdownElement = document.querySelector('.countdown');
        this.interval = null;
    }

    calculateTimeLeft() {
        const now = new Date().getTime();
        const distance = this.deadline - now;

        if (distance < 0) {
            if (this.interval) {
                clearInterval(this.interval);
            }
            if (this.countdownElement) {
                this.countdownElement.innerHTML = "<h2>Registration Closed</h2>";
            }
            return null;
        }

        return {
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
        };
    }

    updateDisplay(timeLeft) {
        if (!timeLeft) return;

        // Only update if elements exist
        if (this.daysElement) {
            this.daysElement.textContent = String(timeLeft.days).padStart(2, '0');
        }
        if (this.hoursElement) {
            this.hoursElement.textContent = String(timeLeft.hours).padStart(2, '0');
        }
        if (this.minutesElement) {
            this.minutesElement.textContent = String(timeLeft.minutes).padStart(2, '0');
        }
        if (this.secondsElement) {
            this.secondsElement.textContent = String(timeLeft.seconds).padStart(2, '0');
        }
    }

    start() {
        // Only start if at least one countdown element exists
        if (!this.daysElement && !this.hoursElement && !this.minutesElement && !this.secondsElement) {
            return;
        }

        // Initial update
        this.updateDisplay(this.calculateTimeLeft());

        // Update every second
        this.interval = setInterval(() => {
            const timeLeft = this.calculateTimeLeft();
            if (timeLeft) {
                this.updateDisplay(timeLeft);
            }
        }, 1000);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }
}

// Set deadline to 3 months from now
const deadline = new Date();
deadline.setMonth(deadline.getMonth() + 3);

// Initialize and start the countdown
document.addEventListener('DOMContentLoaded', () => {
    const countdown = new CountdownTimer(deadline);
    countdown.start();

    // Clean up on page unload
    window.addEventListener('unload', () => {
        countdown.stop();
    });
});