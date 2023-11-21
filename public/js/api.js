export default {
    async checkLogin() {
        const result = await fetch(
            '/api/todos',
            { 
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            }
        );
    
        if (result.status === 403 || result.status === 401) {
            window.location.href = "/login.html";
        }
    },

    logout() {
        localStorage.removeItem('token');
        window.location.href = "/login.html";
    },

    async register(username, password) {
        const newUser = { _id: username, password: password };

        const result = await fetch(
            '/api/register',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            }
        );

        if (result.status === 200) {
            return true;
        } else {            
            return false;
        }
    },

    async getLists() {
        const result = await fetch(
            '/api/todos',
            {                 
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            }
        );        
        return await result.json();
    },

    async getList(id) {
        const result = await fetch(
            '/api/todos/' + id,
            { 
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            }
        );
        return await result.json();
    },

    async createList(name) {
        const newList = { name: name, items: [] };

        const result = await fetch(
            '/api/todos',
            {
                method: 'POST',
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newList)
            }
        );
    },

    async deleteList(id) {
        await fetch(            
            '/api/todos/' + id,
            {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            }
        );
    },

    async updateList(list) {
        await fetch(
            '/api/todos/' + list._id,
            {
                method: 'PUT',
                headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(list)
            }
        );
    }
}