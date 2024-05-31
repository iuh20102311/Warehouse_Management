const handleError = (error: any): void => {
    console.error('API call error', error);
}

const getData = async (endpoint: string, token?: string): Promise<any> => {
    try {
        const headers : HeadersInit = {
            'Accept': 'application/json'
        }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${endpoint}`, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        handleError(error);
        throw error;
    }
}
const deleteData = async (endpoint: string)=> {
    try {
        const response = await fetch(`${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json'
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        handleError(error);
        throw error;
    }
}


export {getData, deleteData};
