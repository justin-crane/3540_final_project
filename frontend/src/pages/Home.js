import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (token) {
            localStorage.setItem('token', token);
            navigate('/user'); // Redirect to the profile page
        }
    }, [navigate]);

    // Render your homepage content here
    return <div>Home Page Content</div>;
};

export default HomePage;