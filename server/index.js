const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db"); // pool instance for local db
const { json } = require("express");

// middleware
app.use(cors());
app.use(express.json()); // allows us to access the req.body

//ROUTES//

//locations
app.post("/locations", async (req, res) => {
    try {
        const { name, address, lat, lon } = req.body;
        console.log({ name, address, lat, lon });
        const createLocation = await pool.query(
            "INSERT INTO Locations (Lname, Address, Longitude, Latitude) VALUES ($1, $2, $3, $4) RETURNING *",
            [name, address, lon, lat]
        );
        res.json(createLocation.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

app.get("/locations", async (req, res) => {
    try {
        const allLocations = await pool.query("SELECT * FROM Locations");
        res.json(allLocations.rows);
    } catch (err) {
        console.error(err.message);
    }
})


const splitEmail = email => {
    const [ userName, domainName, rest ] = email.split('@');
    // console.log([ userName, domainName, rest ]);
    return { userName, domainName, rest };
}

const validEmail = ({ userName, domainName, rest }) => {
    return (userName.length==0 || domainName.length==0 || rest!==undefined)
}

//Sign up
app.post("/signup", async (req, res) => {
    try {
        const { email, password, superAdmin } = req.body;
        const [ userName, domainName, rest ] = email.split('@');
        console.log([ userName, domainName, rest ]);
        //validate email address
        if (userName.length==0 || domainName.length==0 || rest!==undefined) {
            throw 'invalid email';
        }
        if ((await pool.query(`SELECT * FROM Users WHERE email = '${email}'`)).rowCount > 0) {
            throw 'email address already in use';
        }
        console.log('here');

        // validate type of account
        const schoolAdminExists = (await pool.query(`SELECT * FROM SuperAdmins WHERE email LIKE '%${domainName}'`)).rowCount > 0;
        if (superAdmin && schoolAdminExists) {
            throw 'school already has a super admin';
        }
        if (!superAdmin && !schoolAdminExists) {
            throw 'cannot create account for school without super admin';
        }

        //create account
        try {
            console.log('trying to create')
            const createAccount = await pool.query(
                "INSERT INTO Users (email, password, school_domain) VALUES ($1, $2, $3) RETURNING *",
                [email, password, domainName]
            );
            if (superAdmin) {
                const createSuperAdmin = await pool.query(
                    "INSERT INTO SuperAdmins (email, school_name) VALUES ($1, 'default')",
                    [email]
                );    
            }
        } catch (e) {
            throw e.message || 'email address already in use';
        }
        res.json({createdAccount: true, error: ''});
    } catch (err) {
        console.error(err.message);
        res.json({createdAccount: false, error: err.message || err});
    }
})

//Login
app.post("/login", async (req, res) => {
    console.log('login route hit');
    try {
        const { email, password, superAdmin } = req.body;
        const result = await pool.query(
            "SELECT * FROM Users WHERE email = $1 AND password = $2;",
            [email, password]
        );
        res.json({loggedIn: result.rowCount > 0});
    } catch (err) {
        console.error(err.message);
    }
})

//RSOs
app.post("/rsos", async (req, res) => {
    console.log('rso route hit');
    try {
        const { name, email, members } = req.body;
        const domainName = splitEmail(email).domainName;
        members.forEach(element => {
            if (splitEmail(email).domainName != domainName){
                throw 'members must have the same domain name in email address';
            }
        });

        const client = await pool.connect();

        try {
            client.query('BEGIN');
            const RSO_ID = (await client.query(
                'INSERT INTO "RSOs" ("RSO_name", "Email", school_domain) VALUES ($1, $2, $3) RETURNING "RSO_ID";',
                [name, email, domainName]
            )).rows[0].RSO_ID;

            if (RSO_ID===undefined) throw 'error creating RSO';
            
            console.log([ ...members, RSO_ID, email]);
            await client.query(
                'INSERT INTO "RSO_Members" ("Email", "RSO_ID") VALUES' +
                ' ($1, $5) , ($2, $5), ($3, $5), ($4, $5), ($6, $5)',
                [ ...members, RSO_ID, email]
            );
            client.query('COMMIT');
        } catch (err) {
            console.log('rolling back');
            client.query('ROLLBACK');
            console.error(err.message);
            throw err;
        } finally {
            client.release();
        }
    } catch (err) {
        console.error(err.message || err);
        res.json({error:err.message || err});
        return;
    }
    res.json({error:''});
})

app.get('/rsos', async (req, res) => {
    const { email } = req.body;
    try {
        var results;
        if (email) {
            results = await pool.query('SELECT * FROM "RSOs"')
        } else {
            results = await pool.query('SELECT * FROM "RSOs"')
        }
        res.json(results.rows);
    } catch (err) {
        res.json(err);
    }
})

//rso membership
app.delete("/rso_member", async (req, res) => {
    const { RSO_ID, Email } = req.body;
    try {
        const del = await pool.query(
            `delete from "RSO_Members" where "Email" = \'${Email}\' and "RSO_ID" = ${RSO_ID} and ` +
        `"Email" <> (select "Email" from "RSOs" where "RSOs"."RSO_ID"=${RSO_ID})`);
        res.json(del.rowCount > 0);
    } catch (err) {
        console.error(err);
        res.json(false);
    }
})

app.post("/rso_member", async (req, res) => {
    const { RSO_ID, Email } = req.body;
    try {
        const ress = await pool.query(
            'INSERT INTO "RSO_Members" ("Email", "RSO_ID") VALUES ($1, $2)',
            [Email, RSO_ID]
        );
        res.json(ress.rowCount > 0);
    } catch (err) {
        console.error(err);
        res.json(false);
    }
})

//list school RSOs and if user is member
app.get("/rso_member/:email", async (req, res) => {
    const { email } = req.params;
    const domain = splitEmail(email).domainName;
    try {
        const response = await pool.query(
            `select "RSOs"."RSO_ID", "RSOs"."RSO_name", (user_clubs."RSO_ID" is not null) as "isMember"
            from "RSOs"
            left join (select m."RSO_ID" from "RSO_Members" m where m."Email"=$1) user_clubs
            on "RSOs"."RSO_ID"=user_clubs."RSO_ID"
            where "RSOs".school_domain = $2`,
            [email, domain]
        );
        res.json(response.rows);
    } catch (err) {
        console.error(err);
        res.json(false);
    }
})

//events
app.post('/events', async (req, res) => {
    try {
        const { name, dateTime, location, description, rso_id, visibility_level } = req.body;
        await pool.query('INSERT INTO events (event_name, datetime, location, description, "RSO_ID", visibility_level)' +
        "VALUES ($1, $2, $3, $4, $5, $6)",
        [name, dateTime, location, description, rso_id, visibility_level]);
    } catch (err) {
        console.error(err);
        res.json('fail');
        return;
    }
    res.json('success');
})

app.get('/events', async (req, res) => {
    try {
        const response = await pool.query('SELECT events.*, "RSOs"."RSO_name" as rso_name, "RSOs".school_domain FROM events, "RSOs" WHERE "RSOs"."RSO_ID" = events."RSO_ID"');
        res.json(response.rows);
    } catch (err) {
        res.json(err);
    }
})

//comments
app.get("/comments", async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM comments');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
    }
})

app.put("/comments/:comment_id", async (req, res) => {
    try {
        const { rating, comment_body } = req.body;
        const { comment_id } = req.params;
        const result = await pool.query(
            'UPDATE comments SET rating = $1, comment_body = $2 WHERE comments.comment_id = $3',
            [rating, comment_body, comment_id]
        );
        res.json(true);
    } catch (err) {
        console.error(err);
        res.json(false);
    }
})

app.delete("/comments/:comment_id", async (req, res) => {
    try {
        const { comment_id } = req.params;
        const result = await pool.query(
            'delete from comments WHERE comments.comment_id = $1',
            [comment_id]
        );
        res.json(true);
    } catch (err) {
        console.error(err);
        res.json(false);
    }
})

app.post("/comments", async (req, res) => {
    try {
        const { rating, comment_body, event_id, email } = req.body;
        const result = await pool.query(
            'INSERT INTO comments (rating, comment_body, event_id, email) VALUES' +
            '($1, $2, $3, $4) RETURNING *',
            [rating, comment_body, event_id, email]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.json(false);
    }
})


app.listen(5000, () => {
    console.log("Server is starting on port 5000");
});
