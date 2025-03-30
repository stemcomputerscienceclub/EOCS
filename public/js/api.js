// API Service for Quiz Platform
class QuizAPI {
    constructor() {
        this.baseUrl = '/api';
        this.headers = {
            'Content-Type': 'application/json'
        };
    }

    // Set authentication token
    setAuthToken(token) {
        this.headers['Authorization'] = `Bearer ${token}`;
    }

    // Get quiz categories
    async getCategories() {
        try {
            const response = await fetch(`${this.baseUrl}/categories`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    }

    // Get questions for a specific category
    async getQuestions(categoryId, quizType) {
        try {
            const response = await fetch(`${this.baseUrl}/questions`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    categoryId,
                    quizType
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching questions:', error);
            throw error;
        }
    }

    // Submit quiz answers
    async submitQuiz(submissionData) {
        try {
            const response = await fetch(`${this.baseUrl}/submit-quiz`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(submissionData)
            });
            
            if (!response.ok) {
                throw new Error('Failed to submit quiz');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error submitting quiz:', error);
            throw error;
        }
    }

    // Get user's quiz history
    async getQuizHistory() {
        try {
            const response = await fetch(`${this.baseUrl}/quiz-history`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch quiz history');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching quiz history:', error);
            throw error;
        }
    }

    // Get leaderboard data
    async getLeaderboard(timeframe = 'weekly') {
        try {
            const response = await fetch(`${this.baseUrl}/leaderboard?timeframe=${timeframe}`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch leaderboard');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
            throw error;
        }
    }

    // Get user's performance analytics
    async getPerformanceAnalytics() {
        try {
            const response = await fetch(`${this.baseUrl}/analytics`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch performance analytics');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching performance analytics:', error);
            throw error;
        }
    }

    // Save quiz progress
    async saveProgress(quizId, progress) {
        try {
            const response = await fetch(`${this.baseUrl}/save-progress`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify({
                    quizId,
                    progress
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save progress');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error saving progress:', error);
            throw error;
        }
    }

    // Get quiz progress
    async getProgress(quizId) {
        try {
            const response = await fetch(`${this.baseUrl}/progress/${quizId}`, {
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch progress');
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching progress:', error);
            throw error;
        }
    }
}

// Initialize API service
const quizAPI = new QuizAPI();

// Export for use in other files
window.quizAPI = quizAPI; 