document.addEventListener('DOMContentLoaded', ()=>{
    const token = localStorage.getItem('token');

    //if token is not there, directs the user to the login page
    if(!token){
        window.location.href = 'login.html';
        return; //stop running the below code
    }

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', ()=>{
        //remove the token from the storage
        localStorage.removeItem('token');

        alert('You have been logged out.')
        //directs to the login
        window.location.href = 'login.html';
    })
})