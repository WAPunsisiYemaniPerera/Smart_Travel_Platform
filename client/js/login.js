document.addEventListener('DOMContentLoaded', ()=>{
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('http://localhost:5000/api/auth/login',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if(res.ok){
                const data = await res.json();

                localStorage.setItem('token', data.token); //save the token in the local storage of the browser
                alert('Login Successful!');
                window.location.href = 'travel.html'; //directs to the travel page
            }else {
                const data = await res.json();
                alert('Error: ${data.msg}');
            }
        } catch (err) {
            console.error(err);
            alert('An error occured. Please try again')
        }
    })
})