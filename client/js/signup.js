document.addEventListener('DOMContentLoaded', ()=>{
    const signupForm = document.getElementById('signup-form');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); //avoid refresing the form

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            if (res.ok) {
                alert('Signup successful! Please login');
                window.location.href = 'login.html'; //directs to the login page
            }else {
                const data = await res.json();
                alert('Error: ${data.msg}');
            }
        } catch (err){
            console.error(err);
            alert('An error occured. Please try again');
        }
    })
})