import express from "express";
import { db } from "../connect.js";
import mysql from "mysql2";

export const postsparedetails=(req,res) =>{

 
    const { category, details } = req.body;
    const equipmentName= details.equipment;
    console.log(equipmentName);
    // const equipmentName = req.query.equipmentname;
    // console.log(equipmentName);
    console.log(category);
    
     // convert the category name to table name
    const keys = Object.keys(details);
    
    console.log(keys);
    const values = Object.values(details).map((value) => `'${value}'`);
    console.log(values);
    const query = `INSERT INTO ${category} (${keys.join(", ")}) VALUES (${values.join(", ")})`;
    console.log(query)

    db.query(query, (err, result) => {
      if (err) {
        
        console.log(err);
      } else{
        
        
        let sql = '';
        
        db.query(`
          SELECT TABLE_NAME
          FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
          WHERE REFERENCED_TABLE_NAME = '${category}'
            AND REFERENCED_COLUMN_NAME = 'equipment'
        `, (error, results, fields) => {
          if (error) {
            console.log(error);
          }
          
          results.forEach(result => {
            console.log(result.TABLE_NAME);
            sql = `INSERT INTO ${result.TABLE_NAME} (equipment) VALUES ('${equipmentName}')`;
            db.query(sql, (error, results, fields) => {
              if (error) {console.log(error);}
              console.log('Inserted new equipment name into child tables.');
              
            });
          });
          
          
        });
        
      res.send(`Successfully added spare details for ${category}`);
      }
    });
  };
  





export const getequipdetails=(req,res) =>{
  const table_name= req.query.category;
  console.log(table_name);
  
  
  const sql = "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = 'mms' AND TABLE_NAME = ?";

 
  db.query(sql,[table_name], (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    } else {
      

      console.log(results);


      return res.json(results);
      
    }
  });
  
  

};