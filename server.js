const express = require('express')
const app = express();
const mySql = require('mysql2')
const cors = require('cors')
require('dotenv').config()

app.use(express.json())
app.use(cors())


const db = mySql.createConnection({
    host: process.env.DB_HOST,
    user: 'admin',
    password: process.env.DB_PASSWORD,
    database: 'mydb'
})

app.post('/register', (req, res)=>{
    
    console.log(req.body)
    try{

        const sql = "INSERT INTO users (`username`, `email`, `password`) VALUES (?)";
        const values = [req.body.username, req.body.email, req.body.password]

        db.query(sql, [values], (err, result)=>{
            if(err){

                if (err.code === 'ER_DUP_ENTRY'){

                    res.json({msg:'This email is already registered'})
                }
            }
            else return res.status(200).json({msg:'user registered successfully', result})
        })

    }
    catch(err){
        res.send({msg: "An Error Occured"})
    }

})

app.post('/login', (req, res)=>{
    console.log(req.body)

    const sql = `SELECT id, email, username FROM users WHERE email = ? AND password = ?`;
    const values = [req.body.email, req.body.password];

    db.query(sql, values, (err, result)=>{
        if (err) throw err

        else if (result.length === 0){

         return res.status(201).json({msg:'Invalid email or password', result}) 

        }
        
        return res.json({msg:'user logged in successfully', result})
    }) 

})

app.get('/home/:userID', (req, res)=>{
    const userID = req.params.userID

    const sql = `SELECT * from users WHERE id = ?`
    db.query(sql, [userID], (err, result)=>{
        if (err) throw err


        return res.json({body:result[0]})


    })

})

app.put('/editprofile/:userID', (req, res)=>{

    const sql = 'UPDATE users SET email = ?, username = ? WHERE id = ?';
    const values = [req.body.email, req.body.username, req.params.userID]

    db.query(sql, values, (err, result)=>{
        if (err) throw err

        return res.json({msg:'User updated successfully', result})

    })

})

app.delete('/remove-user/:userID', (req, res)=>{
    console.log(req.params.userID)
    const sql = 'DELETE from users WHERE id = ?'
    
    db.query(sql, [req.params.userID], (err, result)=>{
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).send('Server error');
        }

        res.status(200).send({msg:'User deleted successfully', result});

    })

})



app.listen(8082, ()=>{
    console.log('hello mysql')
})
