document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const APP_API_KEY = 'HELLO_HELLO_WORLD_2025'

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    const usernameSpan = document.getElementById('profile-username');
    const emailSpan = document.getElementById('profile-email');
    const changePasswordForm = document.getElementById('change-password-form');
    const deleteAccountBtn = document.getElementById('delete-account-btn');

    // Display the fetched user details
    async function fetchUserProfile() {
        try {
            const res = await fetch('http://localhost:5000/api/auth/user', {
                headers: { 'x-auth-token': token }
            });
            if (!res.ok) throw new Error('Could not fetch user profile');
            const user = await res.json();
            usernameSpan.textContent = user.username;
            emailSpan.textContent = user.email;
        } catch (error) {
            console.error(error);
            usernameSpan.textContent = 'Error';
            emailSpan.textContent = 'Error';
        }
    }

    // Handle changing password
    changePasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;

        try {
            const res = await fetch('http://localhost:5000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.msg || 'Failed to change password');
            }
            alert(data.msg);
            changePasswordForm.reset();
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    });

    // Handle the delete account button
    deleteAccountBtn.addEventListener('click', async () => {
        // Agree twice
        if (confirm('Are you sure you want to delete your account? This will also delete all your saved searches. This action cannot be undone.')) {
            try {
                const res = await fetch('http://localhost:5000/api/auth/delete-account', {
                    method: 'DELETE',
                    headers: { 'x-auth-token': token }
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.msg || 'Failed to delete account');
                
                alert(data.msg);
                localStorage.removeItem('token');
                window.location.href = 'login.html';

            } catch (error) {
                alert(`Error: ${error.message}`);
            }
        }
    });

    // display the details when the page is loaded
    fetchUserProfile();
});