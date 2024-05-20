const express = require('express');
const NodeCache = require('node-cache');
const cors = require('cors');
const _ = require('lodash');
const app = express();
const PORT = process.env.PORT || 5000;

const cache = new NodeCache({ stdTTL: 3600 });
const products = [
  {
    id: 1,
    name: 'Striped Cotton T-Shirt',
    image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    price: 2.99,
    color: 'Blue',
    popularity: 'High',
    size: ['S', 'M', 'L'],
    brand: 'simple Brand',
  },
  {
    id: 2,
    name: 'Slim Fit Jeans',
    price: 39.99,
    image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    color: 'Black',
    popularity: 'High',
    size: ['28', '30', '32', '34'],
    brand: ' Brand',
  },
  {
    id: 3,
    name: 'Casual Plaid Shirt',
    price: 29.99,
    image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    color: 'Red',
    popularity: 'Medium',
    size: ['S', 'M', 'L', 'XL'],
    brand: 'denom',
  },
  {
    id: 4,
    name: 'Graphic Print T-Shirt',
    price: 19.99,
    image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    color: 'White',
    popularity: 'Medium',
    size: ['S', 'M', 'L'],
    brand: 'denom',
  },
  {
    id: 5,
    name: 'Skinny Fit Chinos',
    price: 49.99,
    image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    color: 'Khaki',
    popularity: 'High',
    size: ['28', '30', '32', '34'],
    brand: 'denom',
  },
  {
    id: 6,
    name: 'Classic Polo Shirt',
    price: 34.99,
    color: 'Navy', 
     image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    popularity: 'High',
    size: ['S', 'M', 'L', 'XL'],
    brand: 'denom',
  },
  {
    id: 7,
    name: 'Denim Jacket',
    price: 59.99,
      image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    color: 'Blue',
    popularity: 'Medium',
    size: ['S', 'M', 'L'],
    brand: 'goags',
  },
  {
    id: 8,
    name: 'Cargo Shorts',
    price: 29.99,
    image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    color: 'Olive',
    popularity: 'Medium',
    size: ['28', '30', '32', '34'],
    brand: 'pinkvilla',
  },
  {
    id: 9,
    name: 'Casual Linen Shirt',
    price: 39.99,
    image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    color: 'Beige',
    popularity: 'Medium',
    size: ['S', 'M', 'L', 'XL'],
    brand: 'paragon',
  },
  {
    id: 10,
    name: 'Athletic Joggers',
    price: 45.99,
    image: 'https://media.istockphoto.com/id/1097626470/photo/white-collared-shirt-design-template.jpg?s=1024x1024&w=is&k=20&c=3YFZV3AMjBZXQUql-5h281nwj6FuOX_TbUqTS0ihX6g=',
    color: 'Gray',
    popularity: 'High',
    size: ['28', '30', '32', '34'],
    brand: 'jordog',
  },
];


app.use(cors());

app.get('/api/products', (req, res) => {
  const { page = 1, limit = 5, size, color, brand, sortBy, order = 'asc' } = req.query;

  let filteredProducts = [...products];

  if (size) {
    filteredProducts = filteredProducts.filter(product => product.size.includes(size));
  }

  if (color) {
    filteredProducts = filteredProducts.filter(product => product.color.toLowerCase() === color.toLowerCase());
  }

  if (brand) {
    filteredProducts = filteredProducts.filter(product => product.brand.toLowerCase() === brand.toLowerCase());
  }

  if (sortBy) {
    filteredProducts.sort((a, b) => {
      if (order === 'asc') {
        return a[sortBy] > b[sortBy] ? 1 : -1;
      } else {
        return a[sortBy] < b[sortBy] ? 1 : -1;
      }
    });
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const resultProducts = filteredProducts.slice(startIndex, endIndex);

  res.json(resultProducts);
});
app.get('/api/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = products.find(p => p.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});
app.get('/api/search', (req, res) => {
  const query = req.query.q.toLowerCase();
  const cachedResult = cache.get(query);
  if (cachedResult) {
    return res.json(cachedResult);
  }
  const results = products.filter(p => p.name.toLowerCase().includes(query));
  cache.set(query, results);

  res.json(results);
});
app.get('/api/suggestions', (req, res) => {
  const query = req.query.q.toLowerCase();
  const suggestions = products
    .filter(p => p.name.toLowerCase().includes(query))
    .map(p => p.name);
  res.json(_.uniq(suggestions));
});
const users = [];


app.use(bodyParser.json());


app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
    }
   
    const hashedPassword = await bcrypt.hash(password, 10);
 
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
  
    const user = users.find(user => user.username === username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
   
    if (await bcrypt.compare(password, user.password)) {
      
      const token = jwt.sign({ username }, 'secret', { expiresIn: '1h' });
      res.json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
