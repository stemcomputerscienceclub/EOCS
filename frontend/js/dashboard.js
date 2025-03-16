import auth from './auth.js';
import { formatDate, storage } from './utils.js';

class Dashboard {
    constructor() {
        this.apiUrl = '/api';
        this.user = storage.get('user');
        this.initDashboard();
    }

    async initDashboard() {
        // Check authentication
        if (!auth.isAuthenticated()) {
            window.location.href = '/login.html';
            return;
        }

        // Initialize components
        this.initProfile();
        this.initTeamSection();
        this.initCompetitionStatus();
        this.initEventListeners();
    }

    async initProfile() {
        const profileSection = document.querySelector('.profile-section');
        if (!profileSection) return;

        try {
            const response = await this.fetchUserProfile();
            if (response.success) {
                this.updateProfileUI(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            this.showError('Failed to load profile data');
        }
    }

    async initTeamSection() {
        const teamSection = document.querySelector('.team-section');
        if (!teamSection) return;

        try {
            const response = await this.fetchTeamData();
            if (response.success) {
                this.updateTeamUI(response.data);
            }
        } catch (error) {
            console.error('Error fetching team data:', error);
            this.showError('Failed to load team data');
        }
    }

    async initCompetitionStatus() {
        const statusSection = document.querySelector('.competition-status');
        if (!statusSection) return;

        try {
            const response = await this.fetchCompetitionStatus();
            if (response.success) {
                this.updateStatusUI(response.data);
            }
        } catch (error) {
            console.error('Error fetching competition status:', error);
            this.showError('Failed to load competition status');
        }
    }

    initEventListeners() {
        // Profile update form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleProfileUpdate(e.target);
            });
        }

        // Team creation form
        const createTeamForm = document.getElementById('createTeamForm');
        if (createTeamForm) {
            createTeamForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleTeamCreation(e.target);
            });
        }

        // Team join form
        const joinTeamForm = document.getElementById('joinTeamForm');
        if (joinTeamForm) {
            joinTeamForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.handleTeamJoin(e.target);
            });
        }

        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.switchTab(button.dataset.tab);
            });
        });
    }

    async handleProfileUpdate(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            institution: formData.get('institution'),
            bio: formData.get('bio')
        };

        try {
            this.showLoading(form);
            const response = await this.updateProfile(data);
            
            if (response.success) {
                this.showSuccess(form, 'Profile updated successfully');
                this.updateProfileUI(response.data);
            } else {
                this.showError(form, response.message || 'Failed to update profile');
            }
        } catch (error) {
            this.showError(form, 'An error occurred while updating profile');
        } finally {
            this.hideLoading(form);
        }
    }

    async handleTeamCreation(form) {
        const formData = new FormData(form);
        const data = {
            name: formData.get('teamName'),
            description: formData.get('teamDescription')
        };

        try {
            this.showLoading(form);
            const response = await this.createTeam(data);
            
            if (response.success) {
                this.showSuccess(form, 'Team created successfully');
                this.updateTeamUI(response.data);
                form.reset();
            } else {
                this.showError(form, response.message || 'Failed to create team');
            }
        } catch (error) {
            this.showError(form, 'An error occurred while creating team');
        } finally {
            this.hideLoading(form);
        }
    }

    async handleTeamJoin(form) {
        const formData = new FormData(form);
        const teamCode = formData.get('teamCode');

        try {
            this.showLoading(form);
            const response = await this.joinTeam(teamCode);
            
            if (response.success) {
                this.showSuccess(form, 'Successfully joined team');
                this.updateTeamUI(response.data);
                form.reset();
            } else {
                this.showError(form, response.message || 'Failed to join team');
            }
        } catch (error) {
            this.showError(form, 'An error occurred while joining team');
        } finally {
            this.hideLoading(form);
        }
    }

    updateProfileUI(profileData) {
        const nameElement = document.querySelector('.profile-name');
        const institutionElement = document.querySelector('.profile-institution');
        const bioElement = document.querySelector('.profile-bio');
        const categoryElement = document.querySelector('.profile-category');

        if (nameElement) nameElement.textContent = profileData.name;
        if (institutionElement) institutionElement.textContent = profileData.institution;
        if (bioElement) bioElement.textContent = profileData.bio || 'No bio provided';
        if (categoryElement) categoryElement.textContent = `Category ${profileData.category}`;
    }

    updateTeamUI(teamData) {
        const teamSection = document.querySelector('.team-section');
        if (!teamSection) return;

        if (teamData.team) {
            // User has a team
            teamSection.innerHTML = `
                <div class="team-info">
                    <h3>${teamData.team.name}</h3>
                    <p>${teamData.team.description}</p>
                    <div class="team-members">
                        <h4>Team Members</h4>
                        <ul>
                            ${teamData.team.members.map(member => `
                                <li>
                                    <img src="${member.avatar || '/assets/default-avatar.svg'}" alt="${member.name}">
                                    <span>${member.name}</span>
                                    ${member.isLeader ? '<span class="leader-badge">Leader</span>' : ''}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                    <div class="team-code">
                        <p>Team Code: <strong>${teamData.team.code}</strong></p>
                        <button class="btn btn-outline copy-code" data-code="${teamData.team.code}">
                            <i class="fas fa-copy"></i> Copy Code
                        </button>
                    </div>
                </div>
            `;

            // Add copy code functionality
            const copyButton = teamSection.querySelector('.copy-code');
            if (copyButton) {
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(copyButton.dataset.code);
                    copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-copy"></i> Copy Code';
                    }, 2000);
                });
            }
        } else {
            // User has no team
            teamSection.innerHTML = `
                <div class="no-team">
                    <p>You are not part of any team yet.</p>
                    <div class="team-options">
                        <button class="btn btn-primary" data-action="create">Create Team</button>
                        <button class="btn btn-outline" data-action="join">Join Team</button>
                    </div>
                </div>
            `;
        }
    }

    updateStatusUI(statusData) {
        const statusSection = document.querySelector('.competition-status');
        if (!statusSection) return;

        statusSection.innerHTML = `
            <div class="status-card">
                <h3>Competition Progress</h3>
                <div class="progress-bar">
                    <div class="progress" style="width: ${statusData.progress}%"></div>
                </div>
                <div class="status-details">
                    <p>Current Round: ${statusData.currentRound}</p>
                    <p>Next Round: ${statusData.nextRound}</p>
                    <p>Start Date: ${formatDate(statusData.startDate)}</p>
                    <p>End Date: ${formatDate(statusData.endDate)}</p>
                </div>
            </div>
        `;
    }

    switchTab(tabId) {
        // Update active tab button
        document.querySelectorAll('.tab-button').forEach(button => {
            button.classList.toggle('active', button.dataset.tab === tabId);
        });

        // Show active tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === tabId);
        });
    }

    // API calls
    async fetchUserProfile() {
        const response = await fetch(`${this.apiUrl}/users/profile`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        return await response.json();
    }

    async updateProfile(data) {
        const response = await fetch(`${this.apiUrl}/users/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async fetchTeamData() {
        const response = await fetch(`${this.apiUrl}/teams/my-team`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        return await response.json();
    }

    async createTeam(data) {
        const response = await fetch(`${this.apiUrl}/teams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async joinTeam(teamCode) {
        const response = await fetch(`${this.apiUrl}/teams/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${auth.token}`
            },
            body: JSON.stringify({ teamCode })
        });
        return await response.json();
    }

    async fetchCompetitionStatus() {
        const response = await fetch(`${this.apiUrl}/competition/status`, {
            headers: {
                'Authorization': `Bearer ${auth.token}`
            }
        });
        return await response.json();
    }

    showLoading(form) {
        const button = form?.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = true;
            button.innerHTML = '<div class="loading"></div>';
        }
    }

    hideLoading(form) {
        const button = form?.querySelector('button[type="submit"]');
        if (button) {
            button.disabled = false;
            button.innerHTML = button.getAttribute('data-text') || 'Submit';
        }
    }

    showSuccess(form, message) {
        const messageElement = form?.querySelector('.form-message') || 
                             document.createElement('div');
        messageElement.className = 'form-message success';
        messageElement.textContent = message;
        
        if (!form?.querySelector('.form-message')) {
            form?.appendChild(messageElement);
        }
    }

    showError(form, message) {
        const messageElement = form?.querySelector('.form-message') || 
                             document.createElement('div');
        messageElement.className = 'form-message error';
        messageElement.textContent = message;
        
        if (!form?.querySelector('.form-message')) {
            form?.appendChild(messageElement);
        }
    }
}

// Initialize dashboard
const dashboard = new Dashboard();
export default dashboard;