import express from 'express';
import mongoose from 'mongoose';
import { productSchema } from './model/product.js';
import { customerSchema } from './model/customers.js';

const PORT = 3000;
const url = 'mongodb://localhost:27017/shop';

const app = express();

const connection = mongoose.createConnection(url, {maxPoolSize: 10})

const Product = connection.model('product', productSchema);
const Customer = connection.model('customer', customerSchema);

connection.on('open', () => {
    console.log('Connected to the database!');
    app.listen(PORT, ()=> {
        console.log(`Server started on http://localhost:${PORT}`);
    })
  });
  
  connection.on('error', (err) => {
    console.error(`Database connection error: ${err}`);
  });

  app.get('/', async (req, res) => {
    try {
      const customers = await Customer.find({});
      const result = await Promise.all(customers.map(async (customer) => {
        const product = await Product.findById(customer.product_id);
        return {
          name: customer.name,
          product: product.title,
          price: product.price
        };
      }));
      const html = `
      <h2>Users purchases:</h2>
      ${result.map((customer) => {
        return `
        <div style="border: 1px solid #000;
                    display: flex; 
                    justify-content: space-between; 
                    width: 200px;
                    margin: 0 0 20px 0; 
                    padding: 0 10px">
          <p>${customer.name}</p>
          <p>${customer.product}</p>
          <p>Price: ${customer.price}</p>
        </div>`;
      }).join('')}
    `;
      res.send(html);
    } catch (e) {
      console.error(e);
    }
  });