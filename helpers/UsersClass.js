//Display users
class Users {
    
    constructor(){//defining constructor method
        this.users = [];//empty array
    }
    
    //methods
    //add user data to socket
    AddUserData(id, name, room){
        var users = {id, name, room};//object destructuring
        this.users.push(users);//push to users array
        return users;
    }
    //remove users based on id
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        
        return user;
    }
    //get id from the array
    GetUser(id){
        var getUser = this.users.filter((userId) => {
           return userId.id === id; //loops through the array and returns the id that matches it
        })[0];//return object at index 0
        
        return getUser;
    }
    //List all users list connected in that room
    GetUsersList(room){
        var users = this.users.filter((user) => user.room === room);//loop through the array, filter method creates a new array with all elements that pass the test implemented by provided function
        
        var namesArray = users.map(user => {// name of users inside that array using map
            return user.name;
        }); 
        
        return namesArray;
    }
}

module.exports = {Users};