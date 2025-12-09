import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

export const useDecoded = () => {
    const [decodedToken, setDecodedToken] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve JWT token from local storage

        if (token) {
            try {
                const decoded = jwtDecode(token); // Decode the token
                setDecodedToken(decoded); // Store in state
            } catch (error) {
                console.error("Invalid JWT token", error);
            }
        } else {
            console.log("No token found");
        }
    }, []);

    return decodedToken;
};
