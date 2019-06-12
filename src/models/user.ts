import bcrypt from 'bcrypt'
const saltRounds = 10

const users: User[] = [
    {
        id: '0',
        steamID: '10',
        username: 'username00',
        role: 'user',
        jwtEpoch: 'some_random_val_00',
        extraPerm: '',
        email: 'user0@test.com',
        password: '$2b$10$03K7vNR612di0gWm1YXtS.bftY0AYC8y0hxu5aymroV1wQ.pqrIw6'
    },
    {
        id: '1',
        steamID: '11',
        username: 'username01',
        role: 'user',
        jwtEpoch: 'some_random_val_01',
        extraPerm: '',
        email: 'user1@test.com'
    },
    {
        id: '2',
        steamID: '12',
        username: 'username02',
        role: 'user',
        jwtEpoch: 'some_random_val_02',
        extraPerm: '',
        email: 'user2@test.com'
    },
    {
        id: '3',
        steamID: '13',
        username: 'username03',
        role: 'user',
        jwtEpoch: 'some_random_val_03',
        extraPerm: '',
        email: 'user3@test.com'
    }
]

// bcrypt.hash('1234', saltRounds).then(pass => {
//     console.log(pass)
// })

const idToUser = new Map(users.map(u => [u.id, u]))
const steamIDToUser = new Map(users.map(u => [u.steamID, u]))
const usernameToUser = new Map(users.map(u => [u.username, u]))

const User = {
    get: (id: string): Promise<User | undefined> => Promise.resolve(idToUser.get(id)),
    create: (username: string, password: string, email?: string): Promise<User> =>
        new Promise((resolve, reject) => {
            const exists = usernameToUser.has(username)
            if (exists) {
                reject(new Error('username taken!'))
            } else {
                bcrypt.hash(password, saltRounds).then(pass => {
                    // create new user
                    resolve({
                        id: '4',
                        steamID: '14',
                        username: 'username04',
                        role: 'user',
                        jwtEpoch: 'some_random_val_04',
                        extraPerm: '',
                        password: pass,
                        email
                    })
                })
            }
        }),
    getUsingUsernameAndPassword: (username: string, password: string): Promise<User> =>
        new Promise((resolve, reject) => {
            const user = usernameToUser.get(username)
            if (user && user.password) {
                bcrypt.compare(password, user.password).then(same => {
                    if (same) {
                        resolve(user)
                    } else {
                        reject(new Error('invalid credentials!'))
                    }
                })
            } else {
                reject(new Error('invalid credentials!'))
            }
        }),
    getUsingSteamID: (id: string): Promise<User | undefined> => Promise.resolve(user),
    createUsingSteamID: (id: string): Promise<User> => Promise.resolve(user)
}

export default User
