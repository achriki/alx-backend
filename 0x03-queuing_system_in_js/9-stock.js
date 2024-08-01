import express from "express";
import { createClient } from "redis";
import { promisify } from 'util';

const listProducts = [
    {
      itemId: 1,
      itemName: 'Suitcase 250',
      price: 50,
      initialAvailableQuantity: 4
    },
    {
      itemId: 2,
      itemName: 'Suitcase 450',
      price: 100,
      initialAvailableQuantity: 10
    },
    {
      itemId: 3,
      itemName: 'Suitcase 650',
      price: 350,
      initialAvailableQuantity: 2
    },
    {
      itemId: 4,
      itemName: 'Suitcase 1050',
      price: 550,
      initialAvailableQuantity: 5
    },
];

const getItemById = (id) => {
    const item = listProducts.find(obj => obj.itemId === id);
  
    if (item) {
      return Object.fromEntries(Object.entries(item));
    }
}

const app = express()
const client = createClient()
const PORT = 1245

const reserveStockById = (itemId, stock) => {
    return promisify(client.SET).bind(client)(`item.${itemId}`, stock);
}

const getCurrentReservedStockById = async (itemId) => {
    return promisify(client.GET).bind(client)(`item.${itemId}`);
}

app.get('/list_products', (req, res) => {
    res.json(listProducts);
})

app.get('/list_products/:itemId(\\d+)', (res, res) => {
    const itemId = Number.parseInt(req.prams.itemId)
    const productItem = getItemById(Number.parseInt(itemId))

    if (!productItem) {
        res.json({ status: 'Product not found' });
        return;
    }
    getCurrentReservedStockById(itemId)
        .then((result) => Number.parseInt(result || 0))
        .then((reservedStock) => {
            productItem.currentQuantity = productItem.initialAvailableQuantity - reservedStock;
            res.json(productItem);
        })
})
