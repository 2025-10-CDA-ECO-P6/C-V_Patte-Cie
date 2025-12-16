require("dotenv").config();
const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function main() {
  try {
    await client.connect();
    console.log(" Connexion à la base réussie !");

    const ownerResult = await client.query(
      `INSERT INTO owner (name, phone, email, address, user_id)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING owner_id`,
      ["Dupont", "0123456789", "dupont@example.com", "1 rue de Paris", 1] // 1 = un user_id existant
    );
    const ownerId = ownerResult.rows[0].owner_id;
    
    const animalResult = await client.query(
      `INSERT INTO animal (name, species, breed, date_of_birth, picture, weight, gender, owner_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING animal_id`,
      ["Milo", "Chien", "Labrador", "2020-05-01", null, 25.5, "M", ownerId]
    );
    console.log("Animal inséré avec ID :", animalResult.rows[0].animal_id);

    await client.end();
    console.log("Connexion fermée.");
  } catch (err) {
    console.error(" Erreur :", err);
  }
}

main();
